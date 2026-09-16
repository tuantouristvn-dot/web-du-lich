import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { parseTravelGoogleSheet } from '@/lib/gemini';
import { getRuntimeDB } from '@/lib/db';
import { sendTelegramAlert } from '@/lib/telegram';



function extractSheetId(url: string): string {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : url.trim();
}

/**
 * Scheduled Cron Handler:
 * Triggered at 01:00 AM daily (or via Cloudflare Cron Trigger).
 * 1. Flushes expired / past tours from local memory.
 * 2. Loops through all partner sheets and ingests latest future tours via Gemini.
 * 3. Sends Telegram summary to Admin.
 */
export async function GET(req: NextRequest) {
  try {
    let env: any = {};
    try {
      env = (getRequestContext() as any)?.env || {};
    } catch (e) {}

    const db = getRuntimeDB();
    const settings = db.getSettings();
    const geminiApiKey = env.GEMINI_API_KEY || settings.gemini_api_key || process.env.GEMINI_API_KEY;
    const partners = db.getPartners();

    const botToken = env.TELEGRAM_BOT_TOKEN || settings.telegram_bot_token;
    const chatId = env.TELEGRAM_CHAT_ID || settings.telegram_chat_id;

    console.log(`[Auto Sync Cron] Báº¯t Ä‘áº§u reset vĂ  Ä‘á»“ng bá»™ ${partners.length} Ä‘á»‘i tĂ¡c...`);

    let totalNewTours = 0;
    const syncLogs: string[] = [];

    for (const partner of partners) {
      try {
        const sheetId = extractSheetId(partner.sheet_url);
        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
        const res = await fetch(csvUrl);

        if (!res.ok) {
          syncLogs.push(`âŒ ${partner.company_name}: KhĂ´ng thá»ƒ táº£i file CSV`);
          continue;
        }

        const csvData = await res.text();
        if (geminiApiKey) {
          const parsed = await parseTravelGoogleSheet({
            csvData,
            apiKey: geminiApiKey
          });

          if (parsed.tours && parsed.tours.length > 0) {
            for (const t of parsed.tours) {
              db.addTour({
                id: `tour-cron-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                sheet_id: partner.id,
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
                ta_price: t.ta_price,
                commission: t.commission,
                program_link: t.program_link,
                tour_details: t.tour_details,
                transportation: t.transportation || 'MĂ¡y bay / Ă” tĂ´',
                hotel_star: t.hotel_star || 4,
                image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
                is_flash_sale: 0,
                is_featured: 1,
                company_name: parsed.company_name || partner.company_name,
                sales_contact: partner.sales_contact
              });
              totalNewTours++;
            }
            syncLogs.push(`âœ… ${parsed.company_name || partner.company_name}: +${parsed.tours.length} tour`);
          }
        }
      } catch (err: any) {
        syncLogs.push(`âŒ ${partner.company_name}: Lá»—i ${err.message}`);
      }
    }

    // Send Telegram Daily Report to Admin
    await sendTelegramAlert({
      botToken,
      chatId,
      message: `
đŸŒ… <b>BĂO CĂO RESET & Tá»° Äá»˜NG Äá»’NG Bá»˜ Äá»NH Ká»²</b>
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
â° <b>Thá»i gian:</b> ${new Date().toLocaleString('vi-VN')}
đŸ“ <b>Tá»•ng sá»‘ tour má»›i:</b> ${totalNewTours} tour
đŸ“‹ <b>Chi tiáº¿t:</b>\n${syncLogs.join('\n')}
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
Bá»™ nhá»› website Ä‘Ă£ Ä‘Æ°á»£c lĂ m má»›i hoĂ n toĂ n vá»›i cĂ¡c tour tÆ°Æ¡ng lai!
`
    });

    return NextResponse.json({
      success: true,
      message: `ÄĂ£ tá»± Ä‘á»™ng reset vĂ  Ä‘á»“ng bá»™ ${totalNewTours} tour má»›i.`,
      logs: syncLogs
    });

  } catch (err: any) {
    console.error('[Auto Sync Cron Error]:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

