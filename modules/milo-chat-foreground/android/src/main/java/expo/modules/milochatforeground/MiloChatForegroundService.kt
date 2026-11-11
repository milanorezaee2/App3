package expo.modules.milochatforeground

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat
import expo.modules.milochatforeground.R
import okhttp3.HttpUrl.Companion.toHttpUrl
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.security.MessageDigest
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicLong

class MiloChatForegroundService : Service() {
  companion object {
    const val ACTION_START = "expo.modules.milochatforeground.START"
    const val ACTION_APP_STATE = "expo.modules.milochatforeground.APP_STATE"
    const val EXTRA_CONFIG = "chat_config"
    const val EXTRA_APP_FOREGROUND = "app_foreground"
    const val EXTRA_STORAGE_KEY = "storage_key"
    private const val SERVICE_CHANNEL_ID = "milo-chat-service"
    private const val MESSAGE_CHANNEL_ID = "milo-chat"
    private const val FOREGROUND_ID = 73104
    private const val CONNECTED_STATUS = "connected"
    private const val CONNECTING_STATUS = "connecting"
    private const val RECONNECTING_STATUS = "reconnecting"
    private const val TAG = "MiloChatService"
    private const val REFRESH_EARLY_SECONDS = 180L
    private const val HEARTBEAT_SECONDS = 25L
    private val JSON_MEDIA = "application/json; charset=utf-8".toMediaType()
    @Volatile private var liveInstance: MiloChatForegroundService? = null

    fun markStopRequested() {
      liveInstance?.stopRequested = true
    }

    fun updateLiveAppState(storageKey: String, foreground: Boolean): Boolean {
      val service = liveInstance ?: return false
      val current = service.config ?: return false
      if (current.optString("storageKey") != storageKey) return false
      service.appForeground = foreground
      service.allowRefreshAfter = if (foreground) Long.MAX_VALUE else System.currentTimeMillis() + 10_000L
      return true
    }
  }

  private val executor: ScheduledExecutorService = Executors.newSingleThreadScheduledExecutor()
  private val mainHandler = Handler(Looper.getMainLooper())
  private val refCounter = AtomicLong(0)
  private val http = OkHttpClient.Builder().retryOnConnectionFailure(true).build()

  @Volatile private var config: JSONObject? = null
  @Volatile private var socket: WebSocket? = null
  @Volatile private var appForeground = false
  @Volatile internal var stopRequested = false
  @Volatile private var reconnectScheduled = false
  @Volatile private var joined = false
  @Volatile private var lastHeartbeatReplyAt = 0L
  @Volatile private var allowRefreshAfter = 0L
  @Volatile private var channelJoinRef: String? = null
  private var reconnectAttempts = 0
  private var heartbeatTaskStarted = false

  override fun onCreate() {
    super.onCreate()
    liveInstance = this
    createNotificationChannels()
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    when (intent?.action) {
      ACTION_START -> {
        // Android starts the foreground-service deadline before onStartCommand.
        // Promote immediately: Keystore reads/writes below can be slow on the
        // first run (notably on Xiaomi/MIUI) and must not precede startForeground.
        if (!startInForeground(if (joined) CONNECTED_STATUS else CONNECTING_STATUS)) return START_NOT_STICKY
        val raw = intent.getStringExtra(EXTRA_CONFIG)
        if (raw.isNullOrBlank()) {
          stopSelf(startId)
          return START_NOT_STICKY
        }
        val incoming = try { JSONObject(raw) } catch (_: Exception) {
          stopSelf(startId)
          return START_NOT_STICKY
        }
        val previous = EncryptedChatSessionStore.read(this)
        config = incoming
        stopRequested = false
        appForeground = incoming.optBoolean("appForeground", true)
        try {
          EncryptedChatSessionStore.write(this, incoming)
        } catch (error: Exception) {
          // Keystore is unavailable on some devices/first runs. Keep the connection
          // alive from memory for this process instead of refusing to start.
          Log.e(TAG, "Could not save the foreground-service session", error)
          EncryptedChatSessionStore.setLastError(this, "keystore-write:" + error.javaClass.simpleName + ":" + (error.message ?: ""))
        }
        startHeartbeatLoop()
        executor.execute {
          val oldToken = previous?.optJSONObject("session")?.optString("access_token")
          val newToken = incoming.optJSONObject("session")?.optString("access_token")
          val sameAccount = previous?.optString("userId") == incoming.optString("userId")
          if (!sameAccount) {
            closeSocket()
            connectRealtime()
          } else if (oldToken != null && oldToken != newToken && joined) {
            config = incoming
            updateRealtimeToken(newToken ?: "")
          } else if (oldToken != newToken && !joined) {
            closeSocket()
            connectRealtime()
          } else if (socket == null && !reconnectScheduled) {
            connectRealtime()
          } else {
            config = incoming
          }
        }
      }
      ACTION_APP_STATE -> {
        val key = intent.getStringExtra(EXTRA_STORAGE_KEY)
        val current = EncryptedChatSessionStore.read(this)
        if (current != null && current.optString("storageKey") == key) {
          appForeground = intent.getBooleanExtra(EXTRA_APP_FOREGROUND, false)
          if (!appForeground) allowRefreshAfter = System.currentTimeMillis() + 10_000L
          else allowRefreshAfter = Long.MAX_VALUE
        }
      }
      else -> {
        // START_STICKY may restart the service without an intent. Enter
        // foreground before touching encrypted storage here as well.
        if (!startInForeground(CONNECTING_STATUS)) return START_NOT_STICKY
        val saved = EncryptedChatSessionStore.read(this)
        if (saved == null) {
          stopSelf(startId)
          return START_NOT_STICKY
        }
        config = saved
        stopRequested = false
        appForeground = false
        startHeartbeatLoop()
        executor.execute { connectRealtime() }
      }
    }
    return START_STICKY
  }

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onTaskRemoved(rootIntent: Intent?) {
    // Keep the user-enabled foreground connection alive if the app is removed from recents.
    super.onTaskRemoved(rootIntent)
  }

  override fun onDestroy() {
    if (!stopRequested) EncryptedChatSessionStore.setLastError(this, "destroyed-by-system")
    stopRequested = true
    closeSocket()
    EncryptedChatSessionStore.setStatus(this, "stopped")
    if (liveInstance === this) liveInstance = null
    if (!executor.isShutdown) executor.shutdownNow()
    super.onDestroy()
  }

  private fun createNotificationChannels() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
    val manager = getSystemService(NotificationManager::class.java)
    manager.createNotificationChannel(
      NotificationChannel(SERVICE_CHANNEL_ID, "اتصال پیام در پس‌زمینه", NotificationManager.IMPORTANCE_LOW).apply {
        description = "اعلان دائمی اتصال سرویس اعلان پیام‌های Milo"
        setShowBadge(false)
        enableVibration(false)
        setSound(null, null)
      },
    )
    manager.createNotificationChannel(
      NotificationChannel(MESSAGE_CHANNEL_ID, "پیام‌ها و درخواست‌های چت", NotificationManager.IMPORTANCE_HIGH).apply {
        description = "پیام‌های خصوصی و درخواست‌های پشتیبانی"
        enableVibration(true)
        setShowBadge(true)
      },
    )
  }

  private fun startInForeground(state: String): Boolean {
    try {
      val notification = buildServiceNotification(state)
      if (Build.VERSION.SDK_INT >= 34) {
        startForeground(FOREGROUND_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE)
      } else {
        startForeground(FOREGROUND_ID, notification)
      }
      EncryptedChatSessionStore.setStatus(this, state)
      return true
    } catch (error: Exception) {
      Log.e(TAG, "Could not enter foreground state", error)
      EncryptedChatSessionStore.setLastError(this, "start-foreground:" + error.javaClass.simpleName + ":" + (error.message ?: ""))
      EncryptedChatSessionStore.setStatus(this, "stopped")
      stopRequested = true
      stopSelf()
      return false
    }
  }

  private fun buildServiceNotification(state: String): Notification {
    val text = when (state) {
      CONNECTED_STATUS -> "اتصال پیام فعال است؛ منتظر پیام تازه"
      RECONNECTING_STATUS -> "ارتباط موقتاً قطع است؛ تلاش دوباره ادامه دارد"
      else -> "در حال اتصال امن به سرویس پیام…"
    }
    return NotificationCompat.Builder(this, SERVICE_CHANNEL_ID)
      .setSmallIcon(R.drawable.ic_stat_milo_chat)
      .setContentTitle("اعلان پیام‌های Milo")
      .setContentText(text)
      .setCategory(NotificationCompat.CATEGORY_SERVICE)
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setShowWhen(false)
      .setVisibility(NotificationCompat.VISIBILITY_PRIVATE)
      .build()
  }

  private fun updateServiceStatus(state: String) {
    EncryptedChatSessionStore.setStatus(this, state)
    mainHandler.post {
      val manager = getSystemService(NotificationManager::class.java)
      manager.notify(FOREGROUND_ID, buildServiceNotification(state))
    }
  }

  private fun startHeartbeatLoop() {
    if (heartbeatTaskStarted) return
    heartbeatTaskStarted = true
    executor.scheduleAtFixedRate({
      if (stopRequested) return@scheduleAtFixedRate
      val currentSocket = socket
      if (currentSocket != null && joined) {
        val now = System.currentTimeMillis()
        if (lastHeartbeatReplyAt > 0L && now - lastHeartbeatReplyAt > 65_000L) {
          scheduleReconnect("heartbeat timeout")
        } else {
          val ref = nextRef()
          val frame = JSONObject()
            .put("topic", "phoenix")
            .put("event", "heartbeat")
            .put("payload", JSONObject())
            .put("ref", ref)
          currentSocket.send(frame.toString())
        }
      }
      maybeRefreshSession()
    }, HEARTBEAT_SECONDS, HEARTBEAT_SECONDS, TimeUnit.SECONDS)
  }

  private fun maybeRefreshSession() {
    if (appForeground || System.currentTimeMillis() < allowRefreshAfter || stopRequested) return
    val current = config ?: EncryptedChatSessionStore.read(this) ?: return
    val session = current.optJSONObject("session") ?: return
    val expiresAt = session.optLong("expires_at", 0L)
    val now = System.currentTimeMillis() / 1000L
    if (expiresAt == 0L || expiresAt > now + REFRESH_EARLY_SECONDS) return
    try {
      if (refreshSession(current)) {
        val freshConfig = config ?: return
        updateRealtimeToken(freshConfig.optJSONObject("session")?.optString("access_token") ?: "")
      }
    } catch (error: Exception) {
      Log.w(TAG, "Session refresh failed; retrying while the service remains enabled", error)
      if (expiresAt <= now) scheduleReconnect("session refresh required")
    }
  }

  private fun refreshSession(current: JSONObject): Boolean {
    val session = current.optJSONObject("session") ?: return false
    val refreshToken = session.optString("refresh_token")
    if (refreshToken.isBlank()) return false
    val base = current.optString("supabaseUrl").trimEnd('/')
    val requestUrl = "$base/auth/v1/token?grant_type=refresh_token"
    val body = JSONObject().put("refresh_token", refreshToken).toString().toRequestBody(JSON_MEDIA)
    val request = Request.Builder()
      .url(requestUrl)
      .header("apikey", current.optString("anonKey"))
      .header("Content-Type", "application/json")
      .post(body)
      .build()
    http.newCall(request).execute().use { response ->
      if (!response.isSuccessful) {
        throw IllegalStateException("Auth refresh returned HTTP ${response.code}")
      }
      val payload = JSONObject(response.body?.string().orEmpty())
      val accessToken = payload.optString("access_token")
      val rotatedRefreshToken = payload.optString("refresh_token")
      if (accessToken.isBlank() || rotatedRefreshToken.isBlank()) {
        throw IllegalStateException("Auth refresh response did not include a complete session")
      }
      val expiresIn = payload.optLong("expires_in", 3600L)
      val updatedSession = JSONObject(session.toString())
        .put("access_token", accessToken)
        .put("refresh_token", rotatedRefreshToken)
        .put("expires_in", expiresIn)
        .put("expires_at", payload.optLong("expires_at", System.currentTimeMillis() / 1000L + expiresIn))
        .put("token_type", payload.optString("token_type", "bearer"))
      payload.optJSONObject("user")?.let { updatedSession.put("user", it) }
      val updatedConfig = JSONObject(current.toString()).put("session", updatedSession)
      config = updatedConfig
      EncryptedChatSessionStore.write(this, updatedConfig)
      return true
    }
  }

  private fun connectRealtime() {
    if (stopRequested) return
    val current = config ?: EncryptedChatSessionStore.read(this) ?: return
    val session = current.optJSONObject("session") ?: return
    val nowSeconds = System.currentTimeMillis() / 1000L
    if (!appForeground && session.optLong("expires_at", 0L) <= nowSeconds + 30L) {
      try {
        if (!refreshSession(current)) {
          scheduleReconnect("session refresh required")
          return
        }
      } catch (error: Exception) {
        Log.w(TAG, "Could not refresh session before reconnect", error)
        scheduleReconnect("session refresh required")
        return
      }
    }
    try {
      val baseUrl = current.optString("supabaseUrl").trimEnd('/').toHttpUrl()
      val url = baseUrl.newBuilder()
        .addPathSegments("realtime/v1/websocket")
        .addQueryParameter("apikey", current.optString("anonKey"))
        .addQueryParameter("vsn", "1.0.0")
        .build()
      val request = Request.Builder().url(url).build()
      joined = false
      lastHeartbeatReplyAt = System.currentTimeMillis()
      updateServiceStatus(if (reconnectAttempts == 0) CONNECTING_STATUS else RECONNECTING_STATUS)
      socket = http.newWebSocket(request, realtimeListener())
    } catch (error: Exception) {
      Log.w(TAG, "Realtime connection setup failed", error)
      scheduleReconnect("invalid realtime endpoint")
    }
  }

  private fun realtimeListener() = object : WebSocketListener() {
    override fun onOpen(webSocket: WebSocket, response: Response) {
      executor.execute {
        if (stopRequested) {
          webSocket.close(1000, "service stopped")
          return@execute
        }
        socket = webSocket
        reconnectAttempts = 0
        sendJoin(webSocket)
      }
    }

    override fun onMessage(webSocket: WebSocket, text: String) {
      executor.execute { handleRealtimeFrame(webSocket, text) }
    }

    override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
      webSocket.close(code, reason)
    }

    override fun onClosed(webSocket: WebSocket, code: Int, reason: String) {
      executor.execute {
        if (socket === webSocket && !stopRequested) scheduleReconnect("socket closed")
      }
    }

    override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
      Log.w(TAG, "Realtime WebSocket failed", t)
      executor.execute {
        if (socket === webSocket && !stopRequested) scheduleReconnect("socket failure")
      }
    }
  }

  private fun sendJoin(webSocket: WebSocket) {
    val current = config ?: return
    val session = current.optJSONObject("session") ?: return
    val filters = JSONArray()
      .put(changeSubscription("INSERT", "messages"))
      .put(changeSubscription("INSERT", "support_requests", if (current.optBoolean("isAdmin")) "manager_id=eq.${current.optString("userId")}" else "learner_id=eq.${current.optString("userId")}"))
      .put(changeSubscription("UPDATE", "support_requests", "learner_id=eq.${current.optString("userId")}"))
    val ref = nextRef()
    channelJoinRef = ref
    val topic = realtimeTopic(current)
    val payload = JSONObject()
      .put("config", JSONObject()
        .put("broadcast", JSONObject().put("ack", false).put("self", false))
        .put("presence", JSONObject().put("enabled", false).put("key", ""))
        .put("postgres_changes", filters)
        .put("private", false))
      .put("access_token", session.optString("access_token"))
    val frame = JSONObject()
      .put("topic", topic)
      .put("event", "phx_join")
      .put("payload", payload)
      .put("ref", ref)
      .put("join_ref", ref)
    if (!webSocket.send(frame.toString())) scheduleReconnect("join frame rejected")
  }

  private fun changeSubscription(event: String, table: String, filter: String? = null): JSONObject {
    val entry = JSONObject()
      .put("event", event)
      .put("schema", "public")
      .put("table", table)
    if (!filter.isNullOrBlank()) entry.put("filter", filter)
    return entry
  }

  private fun handleRealtimeFrame(webSocket: WebSocket, raw: String) {
    if (webSocket !== socket || stopRequested) return
    val frame = try { JSONObject(raw) } catch (_: Exception) { return }
    val topic = frame.optString("topic")
    val event = frame.optString("event")
    val payload = frame.optJSONObject("payload") ?: JSONObject()
    when (event) {
      "phx_reply" -> {
        if (topic == "phoenix") {
          lastHeartbeatReplyAt = System.currentTimeMillis()
          return
        }
        val status = payload.optString("status")
        if (status == "ok") {
          joined = true
          reconnectAttempts = 0
          lastHeartbeatReplyAt = System.currentTimeMillis()
          updateServiceStatus(CONNECTED_STATUS)
        } else if (status == "error") {
          Log.w(TAG, "Realtime channel join was rejected")
          joined = false
          scheduleReconnect("channel join rejected")
        }
      }
      "postgres_changes" -> handlePostgresChange(payload)
      "phx_error", "phx_close" -> {
        joined = false
        scheduleReconnect("channel rejected")
      }
    }
  }

  private fun handlePostgresChange(payload: JSONObject) {
    val current = config ?: return
    if (current.optJSONObject("session") == null) return
    val eventData = payload.optJSONObject("data") ?: return
    if (eventData.optString("schema") != "public" || eventData.optString("type") !in setOf("INSERT", "UPDATE")) return
    val table = eventData.optString("table")
    val record = eventData.optJSONObject("record") ?: return
    val userId = current.optString("userId")
    val conversationId = record.optString("conversation_id")
    if (conversationId.isBlank()) return

    if (table == "messages" && eventData.optString("type") == "INSERT") {
      if (record.optString("sender_id") == userId) return
      val messageId = record.optString("id")
      if (messageId.isBlank()) return
      val title = if (current.optBoolean("isAdmin")) "پیام تازه از زبان‌آموز" else "پیام تازه در گفت‌وگوی شما"
      postMessageNotification(current, "message:$messageId", conversationId, title, "برای مشاهده پیام، برنامه را باز کنید.")
      return
    }

    if (table == "support_requests" && eventData.optString("type") == "INSERT") {
      if (!current.optBoolean("isAdmin") || record.optString("manager_id") != userId) return
      val requestId = record.optString("id", conversationId)
      postMessageNotification(current, "support-request:$requestId", conversationId, "درخواست چت تازه", "یک زبان‌آموز درخواست گفت‌وگو دارد.")
      return
    }

    if (table == "support_requests" && eventData.optString("type") == "UPDATE") {
      if (current.optBoolean("isAdmin") || record.optString("learner_id") != userId) return
      val statusEventId = record.optString("status_event_id")
      if (statusEventId.isBlank()) return
      val title = "وضعیت درخواست پشتیبانی تغییر کرد"
      val body = if (record.optString("status") == "resolved") "درخواست پشتیبانی شما پاسخ داده شد." else "درخواست شما دوباره باز شد."
      postMessageNotification(current, "support-status:$statusEventId", conversationId, title, body)
    }
  }

  private fun postMessageNotification(current: JSONObject, eventKey: String, conversationId: String, title: String, body: String) {
    if (appForeground || stopRequested || conversationId.isBlank()) return
    val userId = current.optString("userId")
    if (userId.isBlank() || wasDelivered(userId, eventKey)) return
    val scheme = current.optString("appScheme").ifBlank { "companionenglish" }
    val uri = Uri.parse("$scheme:///conversations/human/$conversationId")
    val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
      ?: Intent(Intent.ACTION_MAIN).setPackage(packageName)
    launchIntent.data = uri
    launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
    val requestCode = stableHash("open:$eventKey").hashCode()
    val openPendingIntent = PendingIntent.getActivity(
      this,
      requestCode,
      launchIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or immutableFlag(),
    )
    val notification = NotificationCompat.Builder(this, MESSAGE_CHANNEL_ID)
      .setSmallIcon(R.drawable.ic_stat_milo_chat)
      .setContentTitle(title)
      .setContentText(body)
      .setStyle(NotificationCompat.BigTextStyle().bigText(body))
      .setContentIntent(openPendingIntent)
      .setAutoCancel(true)
      .setCategory(NotificationCompat.CATEGORY_MESSAGE)
      .setPriority(NotificationCompat.PRIORITY_HIGH)
      .setDefaults(NotificationCompat.DEFAULT_ALL)
      .setVisibility(NotificationCompat.VISIBILITY_PRIVATE)
      .build()
    val manager = getSystemService(NotificationManager::class.java)
    try {
      manager.notify(stableHash("message:$userId:$eventKey").hashCode(), notification)
      markDelivered(userId, eventKey)
    } catch (error: SecurityException) {
      Log.w(TAG, "Notification permission was revoked", error)
    }
  }

  private fun wasDelivered(userId: String, eventKey: String): Boolean {
    val key = stableHash("$userId:$eventKey")
    return getSharedPreferences("milo_chat_notification_dedupe_v1", MODE_PRIVATE).getBoolean(key, false)
  }

  private fun markDelivered(userId: String, eventKey: String) {
    val key = stableHash("$userId:$eventKey")
    val prefs = getSharedPreferences("milo_chat_notification_dedupe_v1", MODE_PRIVATE)
    val all = prefs.all.keys.toList()
    val editor = prefs.edit().putBoolean(key, true)
    if (all.size >= 500) all.take(all.size - 400).forEach(editor::remove)
    editor.apply()
  }

  private fun updateRealtimeToken(token: String) {
    if (token.isBlank() || socket == null || !joined) return
    val current = config ?: return
    val ref = nextRef()
    val frame = JSONObject()
      .put("topic", realtimeTopic(current))
      .put("event", "access_token")
      .put("payload", JSONObject().put("access_token", token))
      .put("ref", ref)
      .put("join_ref", channelJoinRef)
    socket?.send(frame.toString())
  }

  private fun scheduleReconnect(reason: String) {
    if (stopRequested || reconnectScheduled) return
    reconnectScheduled = true
    joined = false
    updateServiceStatus(RECONNECTING_STATUS)
    closeSocket()
    reconnectAttempts += 1
    val delays = longArrayOf(1_000L, 2_000L, 5_000L, 10_000L, 20_000L, 30_000L, 60_000L)
    val delay = delays[(reconnectAttempts - 1).coerceAtMost(delays.lastIndex)]
    Log.i(TAG, "Realtime reconnect scheduled ($reason)")
    executor.schedule({
      reconnectScheduled = false
      if (!stopRequested) connectRealtime()
    }, delay, TimeUnit.MILLISECONDS)
  }

  private fun closeSocket() {
    val current = socket
    socket = null
    joined = false
    channelJoinRef = null
    try { current?.close(1000, "reconnecting") } catch (_: Exception) { }
  }

  private fun nextRef(): String = refCounter.incrementAndGet().toString()

  private fun realtimeTopic(current: JSONObject): String = "realtime:milo-chat-${current.optString("userId")}"

  private fun immutableFlag(): Int = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0

  private fun stableHash(value: String): String = MessageDigest.getInstance("SHA-256")
    .digest(value.toByteArray(Charsets.UTF_8))
    .take(12)
    .joinToString("") { "%02x".format(it) }
}
