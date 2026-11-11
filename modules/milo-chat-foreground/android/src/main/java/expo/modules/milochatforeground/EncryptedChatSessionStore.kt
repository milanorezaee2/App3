package expo.modules.milochatforeground

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import org.json.JSONObject
import java.security.KeyStore
import java.security.SecureRandom
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

internal object EncryptedChatSessionStore {
  private const val PREFS = "milo_chat_foreground_service_v1"
  private const val CONFIG_KEY = "encrypted_config"
  private const val STATUS_KEY = "connection_status"
  private const val ERROR_KEY = "last_error"
  private const val KEY_ALIAS = "milo_chat_foreground_aes_v1"
  private const val IV_BYTES = 12

  @Synchronized
  fun write(context: Context, config: JSONObject) {
    val iv = ByteArray(IV_BYTES).also { SecureRandom().nextBytes(it) }
    val cipher = Cipher.getInstance("AES/GCM/NoPadding")
    cipher.init(Cipher.ENCRYPT_MODE, secretKey(), GCMParameterSpec(128, iv))
    val encrypted = cipher.doFinal(config.toString().toByteArray(Charsets.UTF_8))
    val packed = ByteArray(iv.size + encrypted.size)
    System.arraycopy(iv, 0, packed, 0, iv.size)
    System.arraycopy(encrypted, 0, packed, iv.size, encrypted.size)
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
      .edit()
      .putString(CONFIG_KEY, Base64.encodeToString(packed, Base64.NO_WRAP))
      .apply()
  }

  @Synchronized
  fun read(context: Context): JSONObject? {
    val encoded = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(CONFIG_KEY, null)
      ?: return null
    return try {
      val packed = Base64.decode(encoded, Base64.NO_WRAP)
      if (packed.size <= IV_BYTES) return null
      val iv = packed.copyOfRange(0, IV_BYTES)
      val encrypted = packed.copyOfRange(IV_BYTES, packed.size)
      val cipher = Cipher.getInstance("AES/GCM/NoPadding")
      cipher.init(Cipher.DECRYPT_MODE, secretKey(), GCMParameterSpec(128, iv))
      JSONObject(String(cipher.doFinal(encrypted), Charsets.UTF_8))
    } catch (error: Exception) {
      // A blob restored from a device backup cannot be decrypted with a fresh
      // Keystore key. Drop it silently; this must not flip the live status to
      // "stopped" while a start is in flight.
      setLastError(context, "stale-config:" + (error.javaClass.simpleName))
      context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().remove(CONFIG_KEY).apply()
      null
    }
  }

  fun setLastError(context: Context, detail: String) {
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
      .edit()
      .putString(ERROR_KEY, detail.take(200))
      .apply()
  }

  fun getLastError(context: Context): String =
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(ERROR_KEY, "") ?: ""

  fun clearLastError(context: Context) {
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().remove(ERROR_KEY).apply()
  }

  fun clear(context: Context) {
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
      .edit()
      .remove(CONFIG_KEY)
      .putString(STATUS_KEY, "stopped")
      .apply()
  }

  fun setStatus(context: Context, status: String) {
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
      .edit()
      .putString(STATUS_KEY, status.take(40))
      .apply()
  }

  fun getStatus(context: Context): String =
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(STATUS_KEY, "stopped") ?: "stopped"

  private fun secretKey(): SecretKey {
    val keyStore = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
    val existing = keyStore.getKey(KEY_ALIAS, null) as? SecretKey
    if (existing != null) return existing

    val generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")
    generator.init(
      KeyGenParameterSpec.Builder(
        KEY_ALIAS,
        KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT,
      )
        .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
        .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
        .setRandomizedEncryptionRequired(true)
        .build(),
    )
    return generator.generateKey()
  }
}
