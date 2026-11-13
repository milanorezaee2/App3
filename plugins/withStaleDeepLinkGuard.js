const { withMainActivity } = require('@expo/config-plugins');

/**
 * Android re-delivers a task's original launch intent when the app is reopened
 * from the launcher or Recents after the process was killed. When that task was
 * first opened from a chat notification (deep link `<scheme>:///conversations/...`),
 * every later cold start would therefore land on the chat screen instead of the
 * page the learner left. This drops the stale deep link before React Native reads
 * it; `ignoreChatLinks` additionally ignores chat deep links altogether (learner
 * apps always resume where they were).
 */
module.exports = function withStaleDeepLinkGuard(config, { ignoreChatLinks = false } = {}) {
  return withMainActivity(config, mod => {
    if (mod.modResults.language !== 'kt') return mod;
    let src = mod.modResults.contents;
    if (src.includes('sanitizeLaunchIntent')) return mod;

    const importAnchor = 'import android.os.Bundle';
    if (!src.includes('import android.content.Intent')) {
      src = src.replace(importAnchor, `import android.content.Intent\n${importAnchor}`);
    }

    const onCreateSignature = /override fun onCreate\(savedInstanceState: Bundle\?\) \{\n/;
    if (!onCreateSignature.test(src)) throw new Error('withStaleDeepLinkGuard: MainActivity.onCreate not found');
    src = src.replace(onCreateSignature, match => `${match}    sanitizeLaunchIntent(intent)\n`);

    const helpers = `
  override fun onNewIntent(intent: Intent) {
    sanitizeLaunchIntent(intent)
    super.onNewIntent(intent)
  }

  /** Clears deep links that must not steer navigation (see plugins/withStaleDeepLinkGuard.js). */
  private fun sanitizeLaunchIntent(intent: Intent?) {
    if (intent == null) return
    val data = intent.data ?: return
    val fromHistory = (intent.flags and Intent.FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY) != 0
    val chatLink = (data.path ?: "").startsWith("/conversations")
    if (fromHistory || (chatLink && ${ignoreChatLinks ? 'true' : 'false'})) {
      intent.data = null
      intent.action = Intent.ACTION_MAIN
      setIntent(intent)
    }
  }
`;
    // Insert the helpers right before the final closing brace of the class.
    const lastBrace = src.lastIndexOf('}');
    src = `${src.slice(0, lastBrace)}${helpers}}\n`;
    mod.modResults.contents = src;
    return mod;
  });
};
