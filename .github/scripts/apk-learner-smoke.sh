#!/usr/bin/env bash
# Smoke test on a fresh Android emulator. This checks rendering and navigation,
# not audible speech quality or real-device compatibility.
set -Eeuo pipefail
apk_path="${1:-MiloLanguages.apk}"
package='com.devicecontrol.companion'
phase='setup'
trap 'code=$?; if (( code != 0 )); then echo "::error title=Android smoke test failed::Phase: $phase (exit $code)"; adb logcat -d -t 500 | grep -E "FATAL EXCEPTION|AndroidRuntime|ReactNativeJS|Unable to load script" | tail -80 || true; fi' EXIT

capture_screen() {
  adb shell uiautomator dump /sdcard/milo-window.xml >/dev/null
  adb pull /sdcard/milo-window.xml /tmp/window.xml >/dev/null
}
wait_for_text() {
  local expected="$1"
  for attempt in 1 2 3 4 5 6; do
    sleep 5
    if capture_screen && python3 - "$expected" <<'PY'
import sys, xml.etree.ElementTree as ET
root = ET.parse('/tmp/window.xml').getroot()
values = [node.attrib.get(key, '') for node in root.iter() for key in ('text', 'content-desc')]
if not any(sys.argv[1] in value for value in values):
    raise SystemExit(1)
print('Visible:', sys.argv[1])
PY
    then return 0; fi
  done
  python3 - <<'PY' || true
import xml.etree.ElementTree as ET
root = ET.parse('/tmp/window.xml').getroot()
values = [node.attrib.get(key, '') for node in root.iter() for key in ('text', 'content-desc') if node.attrib.get(key, '')]
print('::error title=Expected screen not found::' + ' | '.join(values)[:1300])
PY
  return 1
}

phase='install APK'
adb install -r "$apk_path"
adb logcat -c
phase='launch app'
adb shell am start -W -n "$package/.MainActivity"
wait_for_text 'English'
wait_for_text 'Русский'

phase='open English lesson'
adb shell am start -W -a android.intent.action.VIEW -d 'companionenglish:///course/lesson?id=foundation-introducing-yourself&fromStart=1' "$package"
wait_for_text 'معرفی خود'
wait_for_text 'Hello, my name is Sara.'

phase='open Russian lesson'
adb shell am start -W -a android.intent.action.VIEW -d 'companionenglish:///learn/ru/lesson?id=ru-l1-greetings' "$package"
wait_for_text 'سلام و خداحافظی'

phase='inspect app errors'
adb exec-out screencap -p > /tmp/milo-screen.png || true
if adb logcat -d | grep -E 'FATAL EXCEPTION|Unable to load script'; then
  echo 'A native crash or bundle load error occurred.'
  exit 1
fi
echo 'Android emulator: app opened; English and Russian lesson screens rendered. TTS audibility not verified.'
