#!/usr/bin/env bash
# Installs the freshly built learner APK on the emulator, launches it and fails
# if the app crashes or renders no accessible text.
set -Eeuo pipefail

apk_path="${1:-MiloLanguages.apk}"
package="com.devicecontrol.companion"
activity="${package}/.MainActivity"

echo "Installing ${apk_path}"
adb install -r "${apk_path}"

echo "Launching ${activity}"
adb shell am start -W -n "${activity}"

sleep 25

echo '--- resumed activity ---'
adb shell dumpsys activity activities \
  | grep -E 'mResumedActivity|topResumedActivity' \
  | tail -n 3 || echo '(no resumed activity line)'

adb shell uiautomator dump /sdcard/window.xml >/dev/null 2>&1 || true
adb pull /sdcard/window.xml /tmp/window.xml >/dev/null 2>&1 || true

python3 - <<'PY'
import xml.etree.ElementTree as ET

try:
    root = ET.parse('/tmp/window.xml').getroot()
except Exception:
    print('no UI hierarchy available')
    raise SystemExit(0)

texts = []
for node in root.iter():
    for name in ('text', 'content-desc'):
        value = node.attrib.get(name, '').strip()
        if value and value not in texts:
            texts.append(value)
print('UI TEXT:', ' | '.join(texts)[:600] or '(none)')
if not texts:
    raise SystemExit('The app rendered no accessible text - it most likely crashed on start.')
PY

adb exec-out screencap -p > /tmp/milo-screen.png || true

if adb logcat -d | grep -E 'FATAL EXCEPTION|Unable to load script'; then
  echo 'The app logged a crash during start.'
  adb logcat -d -t 400 | grep -E 'FATAL EXCEPTION|AndroidRuntime' | tail -n 40 || true
  exit 1
fi

echo 'The app started without a crash.'
