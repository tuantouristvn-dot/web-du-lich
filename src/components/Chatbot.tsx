'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Phone, MessageSquare, Bot, Sparkles, UserCheck } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  leadCaptured?: boolean;
}

const QUICK_PROMPTS = [
  '🔥 Tour Thái Lan 5N4Đ tuần này có chỗ không?',
  '🏔️ Tư vấn tour ghép Hà Giang đi thuyền Nho Quế',
  '👶 Chính sách giá vé tour cho trẻ em như thế nào?',
  '✈️ Tour Phú Quốc có bao gồm cano 4 đảo không?'
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      content: 'Kính chào Quý khách! Em là Trợ lý Tư vấn Trưởng của <b>TRAVEL TA</b>. Em có thể hỗ trợ anh/chị kiểm tra lịch khởi hành, số chỗ trống và báo giá tour ghép tuyến nào hôm nay ạ?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasNewMessage(false);
    }
  }, [messages, isOpen]);

  const handleSend = async (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend || isLoading) return;

    // Append user message
    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-8)
        })
      });

      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [
          ...prev,
          {
            role: 'ai',
            content: data.reply,
            leadCaptured: data.leadCaptured
          }
        ]);
        if (!isOpen) setHasNewMessage(true);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content: 'Dạ, hiện tại đường truyền đang bận một chút. Quý khách vui lòng gọi ngay Hotline <b>0909 888 999</b> hoặc nhắn Zalo để em phục vụ chu đáo nhất ạ!'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button with Ping Indicator */}
      {!isOpen && (
        <div className="relative">
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500 text-[9px] text-white font-bold items-center justify-center">1</span>
          </span>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-tr from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 group transition duration-300 hover:scale-105 border-2 border-white/20"
          >
            <Bot size={26} className="group-hover:rotate-12 transition duration-200" />
            <span className="hidden md:inline font-bold text-sm pr-2">Tư Vấn Tour AI 24/7</span>
          </button>
        </div>
      )}

      {/* Main Chatbox Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[410px] h-[580px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Bot size={22} className="text-orange-400" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-blue-900 rounded-full"></span>
              </div>
              <div>
                <div className="font-bold text-sm flex items-center gap-1.5">
                  Trợ Lý Tour Chuyên Nghiệp <Sparkles size={13} className="text-yellow-400" />
                </div>
                <div className="text-[11px] text-blue-200">Trí tuệ nhân tạo Gemini phục vụ 24/7</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3 text-sm">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-none shadow-sm'
                  }`}
                  dangerouslySetInnerHTML={{ __html: m.content }}
                />

                {m.leadCaptured && (
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <UserCheck size={12} /> Đã gửi số điện thoại cho Chuyên viên tư vấn!
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-gray-400 bg-white p-3 rounded-2xl rounded-bl-none border w-28">
                <span className="animate-pulse">Đang tư vấn</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="bg-white px-3 py-2 border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar text-xs">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-3 py-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 rounded-full border border-gray-200 text-gray-700 transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Direct Hotline / Zalo Fallback Bar */}
          <div className="bg-slate-100 px-3 py-1.5 flex items-center justify-between text-[11px] text-gray-600 border-t border-gray-200">
            <span>Cần gặp sếp/quản trị viên?</span>
            <div className="flex items-center gap-3">
              <a href="tel:0909888999" className="flex items-center gap-1 font-bold text-orange-600 hover:underline">
                <Phone size={11} /> 0909 888 999
              </a>
              <span>|</span>
              <a href="https://zalo.me/0909888999" target="_blank" rel="noreferrer" className="flex items-center gap-1 font-bold text-blue-600 hover:underline">
                <MessageSquare size={11} /> Nhắn Zalo
              </a>
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-gray-200 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Nhập câu hỏi hoặc để lại Số điện thoại..."
              className="flex-1 bg-gray-50 border border-gray-300 rounded-full px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2.5 rounded-full shadow-md transition"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
