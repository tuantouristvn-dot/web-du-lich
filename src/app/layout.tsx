import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Travel TA - Chuyên cung cấp Tour Ghép Hàng Đầu',
  description: 'Nền tảng đặt tour ghép du lịch hàng đầu Việt Nam. Tích hợp AI tư vấn tự động.',
  keywords: 'tour ghép, du lịch trong nước, du lịch quốc tế, tour giá rẻ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className + " bg-gray-50 flex flex-col min-h-screen text-gray-800"}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
