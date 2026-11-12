import { Platform } from 'react-native';
import * as FileSystemLegacy from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

/** Saves text as a download (web) or opens the share sheet (native). */
export async function saveTextFile(fileName: string, content: string, mimeType: string): Promise<void> {
  if (Platform.OS === 'web') {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = fileName;
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    URL.revokeObjectURL(url);
    return;
  }
  const directory = FileSystemLegacy.cacheDirectory;
  if (!directory) throw new Error('فضای ذخیره‌سازی موقت در دسترس نیست.');
  const uri = `${directory}${fileName}`;
  await FileSystemLegacy.writeAsStringAsync(uri, content, { encoding: FileSystemLegacy.EncodingType.UTF8 });
  if (!(await Sharing.isAvailableAsync())) throw new Error('اشتراک‌گذاری فایل روی این دستگاه ممکن نیست.');
  await Sharing.shareAsync(uri, { mimeType, dialogTitle: 'ذخیرهٔ فایل' });
}
