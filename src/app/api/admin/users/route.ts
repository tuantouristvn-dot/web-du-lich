import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeDB } from '@/lib/db';
import { sendTelegramAlert } from '@/lib/telegram';
import { getRequestContext } from '@cloudflare/next-on-pages';



// GET: Láº¥y danh sĂ¡ch táº¥t cáº£ users (Admin only)
export async function GET() {
  const db = getRuntimeDB();
  return NextResponse.json({
    success: true,
    users: db.getUsers(),
    pending: db.getPendingUsers()
  });
}

// POST: Duyá»‡t/Tá»« chá»‘i/KhĂ³a tĂ i khoáº£n (Admin only)
export async function POST(req: NextRequest) {
  try {
    const { userId, action, adminUsername, notes } = await req.json();
    // action: 'approve' | 'reject' | 'disable' | 'enable'

    if (!userId || !action) {
      return NextResponse.json({ error: 'Thiáº¿u thĂ´ng tin' }, { status: 400 });
    }

    const db = getRuntimeDB();
    let newStatus: 'active' | 'pending' | 'disabled';
    let actionLabel = '';

    switch (action) {
      case 'approve':
        newStatus = 'active';
        actionLabel = 'PHĂ DUYá»†T';
        break;
      case 'reject':
      case 'disable':
        newStatus = 'disabled';
        actionLabel = action === 'reject' ? 'Tá»ª CHá»I' : 'KHĂ“A';
        break;
      case 'enable':
        newStatus = 'active';
        actionLabel = 'Má» KHĂ“A';
        break;
      default:
        return NextResponse.json({ error: 'Action khĂ´ng há»£p lá»‡' }, { status: 400 });
    }

    const updatedUser = db.updateUserStatus(userId, newStatus, adminUsername, notes);
    if (!updatedUser) {
      return NextResponse.json({ error: 'KhĂ´ng tĂ¬m tháº¥y tĂ i khoáº£n' }, { status: 404 });
    }

    // Notify admin via Telegram
    let env: any = {};
    try { env = (getRequestContext() as any)?.env || {}; } catch (e) {}
    const settings = db.getSettings();
    await sendTelegramAlert({
      botToken: env.TELEGRAM_BOT_TOKEN || settings.telegram_bot_token,
      chatId: env.TELEGRAM_CHAT_ID || settings.telegram_chat_id,
      message: `âœ… <b>QUáº¢N LĂ TĂ€I KHOáº¢N: ${actionLabel}</b>\nđŸ‘¤ <b>NhĂ¢n viĂªn:</b> ${updatedUser.fullname}\nđŸ”‘ <b>Username:</b> ${updatedUser.username}\nđŸ“‹ <b>Ghi chĂº:</b> ${notes || 'KhĂ´ng cĂ³'}`
    });

    return NextResponse.json({
      success: true,
      user: { ...updatedUser, password: undefined },
      message: `ÄĂ£ ${actionLabel.toLowerCase()} tĂ i khoáº£n ${updatedUser.fullname} thĂ nh cĂ´ng!`
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

