import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeDB } from '@/lib/db';
import { sendTelegramAlert } from '@/lib/telegram';
import { getRequestContext } from '@cloudflare/next-on-pages';



export async function GET() {
  const db = getRuntimeDB();
  return NextResponse.json({
    success: true,
    leads: db.getLeads()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer_name, phone, interested_tour_id, interested_tour_name, notes, source = 'web_form' } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Vui lĂ²ng cung cáº¥p sá»‘ Ä‘iá»‡n thoáº¡i' }, { status: 400 });
    }

    const db = getRuntimeDB();
    const settings = db.getSettings();

    const leadId = `lead-${Date.now()}`;
    const newLead = db.addLead({
      id: leadId,
      customer_name: customer_name || 'KhĂ¡ch Äáº·t Tour Web',
      phone,
      interested_tour_id,
      interested_tour_name,
      source,
      status: 'new',
      notes,
      created_at: new Date().toISOString()
    });

    // Alert Telegram
    let env: any = {};
    try {
      env = (getRequestContext() as any)?.env || {};
    } catch (e) {}

    const botToken = env.TELEGRAM_BOT_TOKEN || settings.telegram_bot_token;
    const chatId = env.TELEGRAM_CHAT_ID || settings.telegram_chat_id;

    await sendTelegramAlert({
      botToken,
      chatId,
      message: `
đŸ¯ <b>CĂ“ KHĂCH Äáº¶T TOUR Tá»ª WEBSITE!</b>
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
đŸ‘¤ <b>Há» tĂªn:</b> ${customer_name || 'KhĂ¡ch vĂ£ng lai'}
đŸ“ <b>Sá»‘ Ä‘iá»‡n thoáº¡i:</b> <code>${phone}</code>
đŸ—ºï¸ <b>Tour quan tĂ¢m:</b> ${interested_tour_name || 'ChÆ°a chá»‰ Ä‘á»‹nh'}
đŸ“ <b>YĂªu cáº§u / Ghi chĂº:</b> ${notes || 'KhĂ´ng cĂ³'}
â° <b>Thá»i gian:</b> ${new Date().toLocaleString('vi-VN')}
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
đŸ‘‰ Má»Ÿ báº£ng Admin CRM Ä‘á»ƒ phĂ¢n cĂ´ng nhĂ¢n viĂªn chÄƒm sĂ³c ngay!
`
    });

    return NextResponse.json({
      success: true,
      lead: newLead,
      message: 'ÄÄƒng kĂ½ nháº­n tÆ° váº¥n thĂ nh cĂ´ng! ChuyĂªn viĂªn sáº½ liĂªn há»‡ láº¡i ngay.'
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, assigned_to, note } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Thiáº¿u ID hoáº·c Tráº¡ng thĂ¡i' }, { status: 400 });
    }

    const db = getRuntimeDB();
    const updated = db.updateLeadStatus(id, status, assigned_to, note);

    return NextResponse.json({
      success: true,
      lead: updated
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

