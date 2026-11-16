# نمونهٔ صدای کاملاً آفلاین (بدون هیچ توکن/API)

شش فایل بالا با `scripts/content/offlineTts.mjs` در همان محیط ساخته شدند: eSpeak NG (WASM) + lamejs،
بدون اکانت، بدون کلید، بدون پرداخت، بدون تماس با هیچ سرویس خارجی. حجم هر کلیپ ~۸–۱۲ کیلوبایت.
کیفیت eSpeak رباتی ولی یکسان و قابلفهم است؛ برای صدای طبیعیتر همان اسکریپت از Piper (مدل ONNX عمومی)
استفاده میکند اگر مدل در دسترس باشد، وگرنه به eSpeak برمیگردد.

| فایل | زبان | جمله |
|---|---|---|
| en.mp3 | en | Hello, how are you today? |
| de.mp3 | de | Guten Morgen, wie geht es dir? |
| fr.mp3 | fr | Bonjour, comment ça va? |
| es.mp3 | es | Hola, ¿cómo estás? |
| tr.mp3 | tr | Merhaba, nasılsın? |
| ru.mp3 | ru | Привет, как дела? |
