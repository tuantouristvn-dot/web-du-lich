/**
 * Telegram Notification Helper
 * Bắn tin nhắn trực tiếp về Telegram cá nhân hoặc Group nhân viên ngay khi có lead mới hoặc tin nhắn chat
 */
export async function sendTelegramAlert({
  botToken,
  chatId,
  message
}: {
  botToken?: string;
  chatId?: string;
  message: string;
}): Promise<boolean> {
  if (!botToken || !chatId) {
    console.log('[Telegram Alert] Chưa cấu hình Token hoặc ChatID, bỏ qua.');
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const data: any = await res.json();
    if (!data.ok) {
      console.warn('[Telegram Alert Failed]:', data.description);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Telegram Alert Error]:', err);
    return false;
  }
}
