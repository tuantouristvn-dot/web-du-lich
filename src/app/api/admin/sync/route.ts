import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { parseTravelGoogleSheet } from '@/lib/gemini';
import { getRuntimeDB } from '@/lib/db';
import { sendTelegramAlert } from '@/lib/telegram';



function extractSheetId(url: string): string {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : url.trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sheetUrl, salesContact = '', salesRepName = '' } = body;

    if (!sheetUrl) {
      return NextResponse.json({ error: 'Vui lĂ²ng cung cáº¥p link Google Sheet' }, { status: 400 });
    }

    let env: any = {};
    try {
      env = (getRequestContext() as any)?.env || {};
    } catch (e) {}

    const db = getRuntimeDB();
    const settings = db.getSettings();
    const geminiApiKey = env.GEMINI_API_KEY || settings.gemini_api_key || process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({ error: 'ChÆ°a cáº¥u hĂ¬nh GEMINI_API_KEY trong há»‡ thá»‘ng' }, { status: 500 });
    }

    const sheetId = extractSheetId(sheetUrl);
    // Fetch public Google Sheet CSV
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    const res = await fetch(csvUrl);

    if (!res.ok) {
      return NextResponse.json({
        error: 'KhĂ´ng thá»ƒ táº£i Google Sheet. HĂ£y kiá»ƒm tra xem file Ä‘Ă£ báº­t quyá»n "Báº¥t ká»³ ai cĂ³ liĂªn káº¿t Ä‘á»u cĂ³ thá»ƒ xem (Anyone with the link can view)" chÆ°a.'
      }, { status: 400 });
    }

    const csvData = await res.text();

    // Use Gemini with Fallback Rotation to parse the sheet
    const parsedData = await parseTravelGoogleSheet({
      csvData,
      apiKey: geminiApiKey
    });

    // 1. Save / Update Partner Company in DB
    const partnerId = `sheet-${sheetId.slice(0, 12)}`;
    db.addPartner({
      id: partnerId,
      sheet_url: sheetUrl,
      company_name: parsedData.company_name || 'CĂ´ng ty Lá»¯ HĂ nh Äá»‘i TĂ¡c',
      sales_rep_name: salesRepName,
      sales_contact: salesContact,
      notes: `Äá»“ng bá»™ thá»§ cĂ´ng ngĂ y ${new Date().toLocaleDateString('vi-VN')}`,
      last_synced: new Date().toLocaleString('vi-VN'),
      status: 'SUCCESS'
    });

    // 2. Add / Update Tours in DB
    let addedCount = 0;
    if (parsedData.tours && Array.isArray(parsedData.tours)) {
      for (const t of parsedData.tours) {
        db.addTour({
          id: `tour-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          sheet_id: partnerId,
          tour_code: t.tour_code || `TG-${Math.floor(1000 + Math.random() * 9000)}`,
          name: t.name,
          slug: t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          region: t.region || 'Trong nÆ°á»›c',
          destination: t.destination || 'Viá»‡t Nam',
          departure_date: t.departure_date,
          duration_days: t.duration_days || 4,
          max_pax: t.max_pax || 25,
          slots_left: t.slots_left || 8,
          public_price: t.public_price,
          ta_price: t.ta_price || Math.round(t.public_price * 0.88),
          commission: t.commission || (t.public_price - (t.ta_price || Math.round(t.public_price * 0.88))),
          program_link: t.program_link || '',
          tour_details: t.tour_details || '',
          transportation: t.transportation || 'MĂ¡y bay / Ă” tĂ´',
          hotel_star: t.hotel_star || 4,
          image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
          is_flash_sale: 0,
          is_featured: 1,
          company_name: parsedData.company_name,
          sales_contact: salesContact
        });
        addedCount++;
      }
    }

    // 3. Send Telegram Alert to Admin
    const botToken = env.TELEGRAM_BOT_TOKEN || settings.telegram_bot_token;
    const chatId = env.TELEGRAM_CHAT_ID || settings.telegram_chat_id;
    await sendTelegramAlert({
      botToken,
      chatId,
      message: `âœ… <b>Äá»’NG Bá»˜ GOOGLE SHEET THĂ€NH CĂ”NG!</b>\nÄá»‘i tĂ¡c: <b>${parsedData.company_name}</b>\nSá»‘ tour náº¡p má»›i: <b>${addedCount} tour</b>`
    });

    return NextResponse.json({
      success: true,
      company_name: parsedData.company_name,
      added_tours: addedCount,
      message: `ÄĂ£ Ä‘á»“ng bá»™ thĂ nh cĂ´ng ${addedCount} tour tá»« ${parsedData.company_name}!`
    });

  } catch (err: any) {
    console.error('[Admin Sync Error]:', err);
    return NextResponse.json({ error: err.message || 'Lá»—i khi Ä‘á»“ng bá»™ Google Sheet' }, { status: 500 });
  }
}

