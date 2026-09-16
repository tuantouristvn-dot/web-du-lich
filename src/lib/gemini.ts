import { GoogleGenAI } from '@google/genai';

// Modern Gemini model rotation list (from newest/most capable down to fastest/cheapest fallback)
export const GEMINI_MODELS = [
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash'
];

/**
 * Executes a Gemini prompt with automatic model fallback & rotation
 */
export async function runGeminiWithFallback({
  apiKey,
  systemPrompt,
  userPrompt,
  history = [],
  temperature = 0.2
}: {
  apiKey: string;
  systemPrompt: string;
  userPrompt: string;
  history?: Array<{ role: 'user' | 'model' | 'ai'; text: string }>;
  temperature?: number;
}): Promise<{ text: string; modelUsed: string }> {
  if (!apiKey) {
    throw new Error('Chưa cấu hình GEMINI_API_KEY!');
  }

  const ai = new GoogleGenAI({ apiKey });
  let lastError: any = null;

  for (const model of GEMINI_MODELS) {
    try {
      const contents: any[] = [];
      
      // Inject System Prompt as initial instruction
      if (systemPrompt) {
        contents.push({ role: 'user', parts: [{ text: `[HƯỚNG DẪN HỆ THỐNG]:\n${systemPrompt}` }] });
        contents.push({ role: 'model', parts: [{ text: 'Tôi đã hiểu và tuyệt đối tuân thủ tất cả hướng dẫn.' }] });
      }

      // Add conversation history
      for (const h of history) {
        contents.push({
          role: h.role === 'ai' ? 'model' : h.role,
          parts: [{ text: h.text }]
        });
      }

      // Current user message
      contents.push({ role: 'user', parts: [{ text: userPrompt }] });

      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          temperature
        }
      });

      if (response && response.text) {
        return {
          text: response.text,
          modelUsed: model
        };
      }
    } catch (err: any) {
      console.warn(`[Gemini Rotation] Model ${model} gặp lỗi hoặc hết Quota:`, err?.message || err);
      lastError = err;
      // Continue to next model in the fallback chain
    }
  }

  throw new Error(`Tất cả các phiên bản Gemini đều thất bại. Lỗi cuối: ${lastError?.message || lastError}`);
}

/**
 * Intelligent Google Sheet Parser for Travel Tour Operators
 */
export async function parseTravelGoogleSheet({
  csvData,
  apiKey
}: {
  csvData: string;
  apiKey: string;
}): Promise<{
  company_name: string;
  tours: Array<{
    tour_code: string;
    name: string;
    region: string;
    destination: string;
    departure_date: string;
    duration_days: number;
    max_pax: number;
    slots_left: number;
    public_price: number;
    ta_price: number;
    commission: number;
    program_link: string;
    tour_details: string;
    transportation: string;
    hotel_star: number;
  }>;
}> {
  const todayStr = new Date().toISOString().split('T')[0];

  const systemPrompt = `
Bạn là chuyên gia phân tích dữ liệu du lịch hàng đầu thế giới (Top Travel Data Analyst).
Bạn nhận được dữ liệu CSV từ bảng tính Google Sheets của một công ty lữ hành đối tác chuyên bán tour ghép.
Mỗi công ty có cách trình bày bảng tính khác nhau: tên cột có thể viết tắt (vd: "Tên tour", "Mã", "Khởi hành", "NL", "Trẻ em", "Giá lẻ", "Giá đại lý", "Com", "Hoa hồng", "Link CT", "Chương trình", "Số chỗ", "Còn").

NHIỆM VỤ CỦA BẠN:
1. Đọc và nhận diện TÊN CÔNG TY LỮ HÀNH (thường ở dòng tiêu đề đầu tiên hoặc góc trên bảng tính).
2. Lọc và chỉ trích xuất những TOUR CÓ NGÀY KHỞI HÀNH TỪ HÔM NAY (${todayStr}) TRỞ VỀ TƯƠNG LAI. Bỏ qua hoàn toàn các ngày trong quá khứ!
3. Tính toán hoặc trích xuất chính xác:
   - public_price (giá bán lẻ cho khách, số nguyên)
   - ta_price (giá nội bộ cho đại lý, số nguyên)
   - commission (hoa hồng = public_price - ta_price, hoặc lấy từ cột Com, số nguyên)
4. Tóm tắt 'tour_details' gồm các điểm nhấn chính trong lịch trình để Chatbot sau này tra cứu tư vấn cho khách.

QUY CÁCH ĐẦU RA:
BẮT BUỘC TRẢ VỀ DUY NHẤT 1 ĐOẠN MÃ JSON HỢP LỆ THEO ĐÚNG CẤU TRÚC SAU (KHÔNG DÙNG BACKTICKS MARKDOWN, BẮT ĐẦU BẰNG { VÀ KẾT THÚC BẰNG }):
{
  "company_name": "Tên công ty lữ hành đối tác",
  "tours": [
    {
      "tour_code": "Mã tour (hoặc tự tạo nếu không có)",
      "name": "Tên đầy đủ của tour ghép",
      "region": "Trong nước / Đông Nam Á / Châu Á / Châu Âu / Châu Mỹ / Châu Úc",
      "destination": "Tỉnh thành hoặc Quốc gia",
      "departure_date": "YYYY-MM-DD",
      "duration_days": 4,
      "max_pax": 25,
      "slots_left": 5,
      "public_price": 6990000,
      "ta_price": 6190000,
      "commission": 800000,
      "program_link": "URL link chương trình chi tiết nếu có",
      "tour_details": "Tóm tắt các điểm tham quan chính, khách sạn, bữa ăn, dịch vụ bao gồm",
      "transportation": "Máy bay / Ô tô / Tàu hỏa",
      "hotel_star": 4
    }
  ]
}
`;

  const { text } = await runGeminiWithFallback({
    apiKey,
    systemPrompt,
    userPrompt: `Dữ liệu CSV Bảng Tính:\n${csvData}`,
    temperature: 0.1
  });

  // Clean any accidental markdown wrappers
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
  if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();

  return JSON.parse(cleaned);
}
