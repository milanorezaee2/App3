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
phase='launch learner login screen'
adb shell am start -W -n "$package/.MainActivity"
wait_for_text 'ورود به حساب'
wait_for_text 'ارسال کد ورود به ایمیل'
python3 - <<'PY2'
import xml.etree.ElementTree as ET
root = ET.parse('/tmp/window.xml').getroot()
if not any(node.attrib.get('package') == 'com.devicecontrol.companion' for node in root.iter()):
    raise SystemExit('Learner package is not visible.')
PY2

phase='inspect app errors'
if adb logcat -d | grep -E 'FATAL EXCEPTION|Unable to load script'; then
  echo 'A native crash or bundle load error occurred.'
  exit 1
fi
echo 'Android emulator: learner OTP login screen rendered without a native crash. Authenticated routes and mailbox delivery are covered separately because CI has no test mailbox.'
