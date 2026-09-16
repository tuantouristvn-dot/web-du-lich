import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { runGeminiWithFallback } from '@/lib/gemini';
import { sendTelegramAlert } from '@/lib/telegram';
import { getRuntimeDB } from '@/lib/db';



function extractPhoneNumbers(text: string): string[] {
  // Matches Vietnamese mobile numbers (03x, 05x, 07x, 08x, 09x or +84)
  const phoneRegex = /(?:0|\+84)(?:3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}/g;
  const matches = text.replace(/[\s.-]/g, '').match(phoneRegex);
  return matches ? Array.from(new Set(matches)) : [];
}

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Ná»™i dung tin nháº¯n khĂ´ng há»£p lá»‡' }, { status: 400 });
    }

    // Attempt to access Cloudflare D1 & Environment
    let env: any = {};
    try {
      env = (getRequestContext() as any)?.env || {};
    } catch (e) {
      // In local dev without Cloudflare context
    }

    const db = getRuntimeDB();
    const settings = db.getSettings();
    const brandName = settings.brand_name || 'TRAVEL TA';
    const hotline = settings.hotline || '0909 888 999';
    const zalo = settings.zalo_oa || 'https://zalo.me/0909888999';
    const botToken = env.TELEGRAM_BOT_TOKEN || settings.telegram_bot_token;
    const chatId = env.TELEGRAM_CHAT_ID || settings.telegram_chat_id;
    const geminiApiKey = env.GEMINI_API_KEY || settings.gemini_api_key || process.env.GEMINI_API_KEY;

    // 1. Check if user provided a phone number -> Lead Capture & Immediate Telegram Notification
    const detectedPhones = extractPhoneNumbers(message);
    let leadCaptured = false;

    if (detectedPhones.length > 0) {
      const capturedPhone = detectedPhones[0];
      leadCaptured = true;

      // Save to Leads & Audit Trail
      const leadId = `lead-${Date.now()}`;
      db.addLead({
        id: leadId,
        customer_name: 'KhĂ¡ch Chat AI',
        phone: capturedPhone,
        source: 'chat',
        status: 'new',
        notes: `Ná»™i dung tin nháº¯n: "${message}"`,
        created_at: new Date().toISOString()
      });

      // Send instant Telegram Alert
      const alertMsg = `
đŸ”” <b>CĂ“ KHĂCH HĂ€NG Má»I Äá»‚ Láº I SÄT!</b>
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
đŸ“± <b>Sá»‘ Ä‘iá»‡n thoáº¡i:</b> <code>${capturedPhone}</code>
đŸ’¬ <b>Tin nháº¯n chat:</b> <i>"${message}"</i>
â° <b>Thá»i gian:</b> ${new Date().toLocaleString('vi-VN')}
đŸ·ï¸ <b>Nguá»“n:</b> AI Chatbot - ${brandName}
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
đŸ‘‰ HĂ£y má»Ÿ Admin CRM hoáº·c gá»i ngay cho khĂ¡ch Ä‘á»ƒ chá»‘t tour!
`;
      await sendTelegramAlert({
        botToken,
        chatId,
        message: alertMsg
      });
    }

    // 2. Query available future tours from D1 / cache
    const availableTours = db.getTours().map(t => ({
      code: t.tour_code,
      name: t.name,
      destination: t.destination,
      region: t.region,
      date: t.departure_date,
      duration: `${t.duration_days} ngĂ y`,
      price: new Intl.NumberFormat('vi-VN').format(t.public_price) + ' VNÄ',
      slots: t.slots_left,
      details: t.tour_details,
      link: t.program_link
    }));

    // 3. Query Knowledge Base (approved answers from TA Director)
    const knowledgeItems = db.getKnowledge();
    const kbContext = knowledgeItems
      .map(k => `[Há»I]: ${k.question}\n[ÄĂP]: ${k.answer}`)
      .join('\n\n');

    // 4. Construct Persona & System Prompt for Gemini
    const systemPrompt = `
Báº N LĂ€ AI?
Báº¡n lĂ  Tá»•ng GiĂ¡m Äá»‘c (CEO) kiĂªm ChuyĂªn gia tÆ° váº¥n trÆ°á»Ÿng cao cáº¥p cá»§a thÆ°Æ¡ng hiá»‡u du lá»‹ch "${brandName}" - chuyĂªn bĂ¡n tour ghĂ©p hĂ ng Ä‘áº§u.
Phong cĂ¡ch giao tiáº¿p cá»§a báº¡n: Lá»‹ch sá»±, trang trá»ng, Ă¢n cáº§n, Ä‘Ă¡ng tin cáº­y vĂ  mang tĂ­nh thuyáº¿t phá»¥c chá»‘t sale Ä‘á»‰nh cao nhÆ° má»™t ngÆ°á»i tháº­t.

QUY Táº®C Náº°M LĂ’NG (Báº®T BUá»˜C TUĂ‚N THá»¦ 100%):
1. Báº¢O Máº¬T THÆ¯Æ NG HIá»†U (WHITE-LABEL):
   Táº¥t cáº£ cĂ¡c tour nĂ y lĂ  cá»§a "${brandName}". TUYá»†T Äá»I KHĂ”NG BAO GIá»œ Ä‘Æ°á»£c nháº¯c Ä‘áº¿n tĂªn báº¥t ká»³ cĂ´ng ty lá»¯ hĂ nh Ä‘á»‘i tĂ¡c nĂ o khĂ¡c.
2. NHáº¬N DIá»†N NGĂ”N NGá»® LINH HOáº T:
   - Náº¿u khĂ¡ch chat báº±ng Tiáº¿ng Viá»‡t -> Tráº£ lá»i báº±ng Tiáº¿ng Viá»‡t chuáº©n má»±c, tĂ´n trá»ng.
   - Náº¿u khĂ¡ch chat báº±ng Tiáº¿ng Anh hoáº·c ngĂ´n ngá»¯ khĂ¡c -> Tá»± Ä‘á»™ng chuyá»ƒn ngá»¯ vĂ  tráº£ lá»i trĂ´i cháº£y báº±ng ngĂ´n ngá»¯ cá»§a khĂ¡ch.
3. TÆ¯ Váº¤N SĂ‚U & TRUNG THá»°C:
   - Äá»c ká»¹ pháº§n 'details' cá»§a tá»«ng tour.
   - Náº¿u khĂ¡ch há»i Ä‘iá»ƒm tham quan/dá»‹ch vá»¥ mĂ  trong tour KHĂ”NG CĂ“, hĂ£y tháº³ng tháº¯n xĂ¡c nháº­n ráº±ng lá»‹ch trĂ¬nh hiá»‡n táº¡i khĂ´ng ghĂ© Ä‘iá»ƒm Ä‘Ă³ Ä‘á»ƒ trĂ¡nh hiá»ƒu láº§m, nhÆ°ng khĂ©o lĂ©o giá»›i thiá»‡u cĂ¡c Ä‘iá»ƒm ná»•i báº­t tÆ°Æ¡ng Ä‘Æ°Æ¡ng trong tour Ä‘á»ƒ thuyáº¿t phá»¥c khĂ¡ch.
4. BĂO GIĂ VĂ€ Gá»¬I LINK CHÆ¯Æ NG TRĂŒNH:
   - Chá»‰ bĂ¡o giĂ¡ bĂ¡n láº» (price) Ä‘Ă£ niĂªm yáº¿t, khĂ´ng giáº£m tĂ¹y tiá»‡n.
   - Báº®T BUá»˜C chĂ¨n Ä‘Æ°á»ng link chi tiáº¿t náº¿u khĂ¡ch há»i tour cá»¥ thá»ƒ theo Ä‘á»‹nh dáº¡ng HTML: <a href="[link]" target="_blank" style="color:#2563eb;font-weight:bold;text-decoration:underline;">Xem chi tiáº¿t chÆ°Æ¡ng trĂ¬nh táº¡i Ä‘Ă¢y</a>.
5. CHá»T SALE & XIN Sá» ÄIá»†N THOáº I:
   - KhĂ©o lĂ©o má»i khĂ¡ch Ä‘á»ƒ láº¡i Sá»‘ Äiá»‡n Thoáº¡i Ä‘á»ƒ chuyĂªn viĂªn gá»i tÆ° váº¥n giá»¯ chá»— Æ°u tiĂªn.
   - Náº¿u khĂ¡ch vá»«a Ä‘á»ƒ láº¡i sá»‘ Ä‘iá»‡n thoáº¡i (Há»‡ thá»‘ng ghi nháº­n: ${leadCaptured ? 'ÄĂƒ NHáº¬N ÄÆ¯á»¢C' : 'CHÆ¯A'}), hĂ£y cáº£m Æ¡n ná»“ng nhiá»‡t vĂ  bĂ¡o ráº±ng chuyĂªn viĂªn tÆ° váº¥n sáº½ liĂªn há»‡ láº¡i trong vĂ²ng 5-10 phĂºt!
6. FALLBACK KHI KHĂCH DO Dá»°:
   - Náº¿u khĂ¡ch chÆ°a sáºµn sĂ ng Ä‘á»ƒ láº¡i sá»‘, hĂ£y cung cáº¥p ngay: Hotline/Zalo cá»§a thÆ°Æ¡ng hiá»‡u: Hotline <b>${hotline}</b> hoáº·c Zalo: <b>${zalo}</b> Ä‘á»ƒ khĂ¡ch tá»± chá»§ Ä‘á»™ng nháº¯n tin khi cáº§n.

DANH SĂCH TOUR GHĂ‰P ÄANG KHá»I HĂ€NH (THá»œI GIAN THá»°C Tá»ª HĂ”M NAY Vá»€ SAU):
${JSON.stringify(availableTours, null, 2)}

Bá»˜ NHá» KIáº¾N THá»¨C ÄĂƒ ÄĂ€O Táº O (KNOWLEDGE BASE):
${kbContext}

Äá»‹nh dáº¡ng pháº£n há»“i: Sá»­ dá»¥ng HTML cÆ¡ báº£n (dĂ¹ng <br/> Ä‘á»ƒ xuá»‘ng dĂ²ng, <b> Ä‘á»ƒ in Ä‘áº­m, <i> Ä‘á»ƒ in nghiĂªng). KhĂ´ng dĂ¹ng markdown thĂ´.
`;

    // 5. Call Gemini with fallback
    let replyText = '';
    if (geminiApiKey) {
      try {
        const { text } = await runGeminiWithFallback({
          apiKey: geminiApiKey,
          systemPrompt,
          userPrompt: message,
          history: history.map((h: any) => ({
            role: h.role === 'ai' || h.role === 'model' ? 'model' : 'user',
            text: h.content || h.text || ''
          })),
          temperature: 0.3
        });
        replyText = text;
      } catch (err: any) {
        console.error('Gemini error:', err);
      }
    }

    // Fallback response if API key is missing or all models failed
    if (!replyText) {
      if (leadCaptured) {
        replyText = `Dáº¡ thÆ°a anh/chá»‹, em Ä‘Ă£ ghi nháº­n sá»‘ Ä‘iá»‡n thoáº¡i cá»§a mĂ¬nh rá»“i áº¡! ChuyĂªn viĂªn tÆ° váº¥n cá»§a <b>${brandName}</b> sáº½ liĂªn há»‡ trá»±c tiáº¿p vá»›i anh/chá»‹ ngay Ä‘á»ƒ há»— trá»£ giá»¯ chá»— vĂ  gá»­i bĂ¡o giĂ¡ Æ°u Ä‘Ă£i nháº¥t nhĂ© áº¡! Náº¿u cáº§n há»— trá»£ kháº©n cáº¥p, anh/chá»‹ vui lĂ²ng gá»i ngay Hotline: <b>${hotline}</b>.`;
      } else {
        replyText = `Dáº¡ chĂ o anh/chá»‹! Em lĂ  trá»£ lĂ½ tÆ° váº¥n tour ghĂ©p cá»§a <b>${brandName}</b>. Hiá»‡n bĂªn em Ä‘ang cĂ³ sáºµn cĂ¡c Ä‘oĂ n ghĂ©p khá»Ÿi hĂ nh liĂªn tá»¥c trong tuáº§n Ä‘i <b>ThĂ¡i Lan, HĂ  Giang, ÄĂ  Náºµng, HĂ n Quá»‘c, PhĂº Quá»‘c</b> vá»›i má»©c giĂ¡ cá»±c ká»³ Æ°u Ä‘Ă£i.<br/><br/>Anh/chá»‹ Ä‘ang cĂ³ káº¿ hoáº¡ch Ä‘i vĂ o ngĂ y nĂ o hoáº·c quan tĂ¢m tuyáº¿n nĂ o Ä‘á»ƒ em kiá»ƒm tra chá»— trá»‘ng vĂ  gá»­i lá»‹ch trĂ¬nh chi tiáº¿t cho mĂ¬nh nhĂ© áº¡? Hoáº·c anh/chá»‹ cĂ³ thá»ƒ káº¿t ná»‘i Zalo Hotline: <b>${hotline}</b> Ä‘á»ƒ Ä‘Æ°á»£c tÆ° váº¥n nhanh nháº¥t áº¡!`;
      }
    }

    return NextResponse.json({
      success: true,
      reply: replyText,
      leadCaptured
    });

  } catch (error: any) {
    console.error('[Chat API Error]:', error);
    return NextResponse.json({ error: error.message || 'Lá»—i xá»­ lĂ½ chat' }, { status: 500 });
  }
}

