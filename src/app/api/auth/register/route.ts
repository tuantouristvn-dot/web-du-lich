import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeDB } from '@/lib/db';
import { sendTelegramAlert } from '@/lib/telegram';
import { getRequestContext } from '@cloudflare/next-on-pages';



export async function POST(req: NextRequest) {
  try {
    const { username, password, fullname, phone } = await req.json();

    if (!username || !password || !fullname || !phone) {
      return NextResponse.json({ error: 'Vui lĂ²ng Ä‘iá»n Ä‘áº§y Ä‘á»§ thĂ´ng tin Ä‘Äƒng kĂ½' }, { status: 400 });
    }
    if (username.length < 4) {
      return NextResponse.json({ error: 'TĂªn Ä‘Äƒng nháº­p pháº£i cĂ³ Ă­t nháº¥t 4 kĂ½ tá»±' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Máº­t kháº©u pháº£i cĂ³ Ă­t nháº¥t 6 kĂ½ tá»±' }, { status: 400 });
    }

    const db = getRuntimeDB();
    const existing = db.getUserByUsername(username.trim());
    if (existing) {
      return NextResponse.json({ error: 'TĂªn Ä‘Äƒng nháº­p nĂ y Ä‘Ă£ tá»“n táº¡i. Vui lĂ²ng chá»n tĂªn khĂ¡c!' }, { status: 409 });
    }

    const newUser = db.addUser({
      id: `user-${Date.now()}`,
      username: username.trim().toLowerCase(),
      password,
      role: 'staff',
      fullname: fullname.trim(),
      phone: phone.trim(),
      status: 'pending',
      created_at: new Date().toISOString()
    });

    // Notify Admin via Telegram
    let env: any = {};
    try { env = (getRequestContext() as any)?.env || {}; } catch (e) {}
    const settings = db.getSettings();
    const botToken = env.TELEGRAM_BOT_TOKEN || settings.telegram_bot_token;
    const chatId = env.TELEGRAM_CHAT_ID || settings.telegram_chat_id;

    await sendTelegramAlert({
      botToken, chatId,
      message: `đŸ”” <b>YĂU Cáº¦U ÄÄ‚NG KĂ TĂ€I KHOáº¢N Má»I!</b>\nâ”â”â”â”â”â”â”â”â”â”â”â”â”â”â”\nđŸ‘¤ <b>Há» tĂªn:</b> ${fullname}\nđŸ“± <b>SÄT:</b> <code>${phone}</code>\nđŸ”‘ <b>Username:</b> <code>${username}</code>\nâ° <b>Thá»i gian:</b> ${new Date().toLocaleString('vi-VN')}\nâ”â”â”â”â”â”â”â”â”â”â”â”â”â”â”\nđŸ‘‰ VĂ o trang Quáº£n Trá»‹ â†’ Quáº£n lĂ½ NhĂ¢n viĂªn Ä‘á»ƒ duyá»‡t hoáº·c tá»« chá»‘i!`
    });

    return NextResponse.json({
      success: true,
      message: 'ÄÄƒng kĂ½ thĂ nh cĂ´ng! TĂ i khoáº£n cá»§a báº¡n Ä‘ang chá» Quáº£n trá»‹ viĂªn phĂª duyá»‡t. ChĂºng tĂ´i sáº½ thĂ´ng bĂ¡o qua Ä‘iá»‡n thoáº¡i khi Ä‘Æ°á»£c duyá»‡t!'
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lá»—i Ä‘Äƒng kĂ½' }, { status: 500 });
  }
}

