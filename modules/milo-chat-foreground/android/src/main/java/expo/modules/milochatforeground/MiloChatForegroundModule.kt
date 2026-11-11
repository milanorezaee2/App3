package expo.modules.milochatforeground

import android.content.Context
import android.content.Intent
import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.json.JSONObject

class MiloChatForegroundModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MiloChatForeground")

    AsyncFunction("start") { configJson: String ->
      val context = appContext.reactContext ?: throw IllegalStateException("React context is unavailable")
      val config = JSONObject(configJson)
      validateConfig(config)
      val intent = Intent(context, MiloChatForegroundService::class.java)
        .setAction(MiloChatForegroundService.ACTION_START)
        .putExtra(MiloChatForegroundService.EXTRA_CONFIG, config.toString())
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) context.startForegroundService(intent)
      else context.startService(intent)
      true
    }

    AsyncFunction("stop") { storageKey: String ->
      val context = appContext.reactContext ?: return@AsyncFunction false
      val current = EncryptedChatSessionStore.read(context)
      if (current != null && current.optString("storageKey") == storageKey) {
        context.stopService(Intent(context, MiloChatForegroundService::class.java))
        EncryptedChatSessionStore.clear(context)
        true
      } else {
        false
      }
    }

    AsyncFunction("setAppForegrounded") { foreground: Boolean ->
      val context = appContext.reactContext ?: return@AsyncFunction false
      val configured = EncryptedChatSessionStore.read(context) ?: return@AsyncFunction false
      MiloChatForegroundService.updateLiveAppState(configured.optString("storageKey"), foreground)
      true
    }

    AsyncFunction("getStoredSession") { storageKey: String ->
      val context = appContext.reactContext ?: return@AsyncFunction null
      val config = EncryptedChatSessionStore.read(context) ?: return@AsyncFunction null
      if (config.optString("storageKey") != storageKey) return@AsyncFunction null
      config.optJSONObject("session")?.toString()
    }

    AsyncFunction("getStatus") {
      val context = appContext.reactContext ?: return@AsyncFunction "unavailable"
      EncryptedChatSessionStore.getStatus(context)
    }

    AsyncFunction("isConfigured") { storageKey: String ->
      val context = appContext.reactContext ?: return@AsyncFunction false
      val config = EncryptedChatSessionStore.read(context) ?: return@AsyncFunction false
      config.optString("storageKey") == storageKey
    }
  }

  private fun validateConfig(config: JSONObject) {
    val baseUrl = config.optString("supabaseUrl")
    val anonKey = config.optString("anonKey")
    val storageKey = config.optString("storageKey")
    val userId = config.optString("userId")
    val session = config.optJSONObject("session")
    if (!baseUrl.startsWith("https://") || anonKey.isBlank() || storageKey.isBlank() || userId.isBlank() || session == null) {
      throw IllegalArgumentException("Incomplete chat service configuration")
    }
    if (session.optString("access_token").isBlank() || session.optString("refresh_token").isBlank()) {
      throw IllegalArgumentException("The authenticated Supabase session is incomplete")
    }
    val sessionUserId = session.optJSONObject("user")?.optString("id")
    if (sessionUserId != null && sessionUserId != userId) {
      throw IllegalArgumentException("The chat service session user does not match the signed-in account")
    }
  }
}
