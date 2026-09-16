'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, Shield, Search, Flame, Globe, User, ChevronDown, Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      {/* Top Bar - Thông tin liên hệ & Hỗ trợ khách hàng */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <Phone size={13} className="text-orange-400" />
              Hotline Tư Vấn: <a href="tel:0909888999" className="hover:text-orange-400 font-bold tracking-wider">0909 888 999</a>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <MessageSquare size={13} className="text-blue-400" />
              Zalo Hỗ Trợ 24/7: <a href="https://zalo.me/0909888999" target="_blank" rel="noreferrer" className="hover:text-blue-300 underline">0909 888 999</a>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-emerald-400 font-medium">
              <Shield size={13} />
              Cam kết 100% Khởi hành đúng hẹn
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-slate-300 cursor-pointer hover:text-white">
              <Globe size={13} />
              <span className="font-semibold text-[11px]">VI / EN</span>
            </div>
            <span className="text-slate-600">|</span>
            <Link 
              href="/auth" 
              className="flex items-center gap-1.5 bg-blue-600/80 hover:bg-blue-600 text-white px-2.5 py-0.5 rounded text-[11px] font-semibold transition"
            >
              <User size={12} /> Đăng Nhập Nội Bộ
            </Link>
          </div>
        </div>
      </div>

      {/* Main Bar - Logo, Tìm kiếm & Hotline */}
      <div className="container mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition">
            T
          </div>
          <div>
            <div className="text-2xl font-black text-blue-900 tracking-tight leading-none">
              TRAVEL<span className="text-orange-500">TA</span>
            </div>
            <div className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase mt-0.5">
              Chuyên Tour Ghép Cao Cấp
            </div>
          </div>
        </Link>

        {/* Search Bar - Phong cách travel.com.vn */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-6">
          <div className="relative w-full">
            <input 
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm kiếm điểm đến: Thái Lan, Hà Giang, Phú Quốc, Hàn Quốc..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-5 pr-12 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            <Link 
              href={`/tours?q=${encodeURIComponent(searchKeyword)}`}
              className="absolute right-1.5 top-1.5 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition shadow-sm"
            >
              <Search size={15} />
            </Link>
          </div>
        </div>

        {/* Hotline CTA Box */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200">
            <Phone size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Tư vấn đặt tour 24/7</div>
            <a href="tel:0909888999" className="text-base font-extrabold text-orange-600 hover:text-orange-700">
              0909 888 999
            </a>
          </div>
        </div>

        {/* Mobile menu trigger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-700 hover:text-blue-600"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Navigation Mega Menu - Chuẩn phân tầng Cấp 1, 2, 3 */}
      <nav className="bg-slate-50 border-t border-gray-200 hidden lg:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1 font-bold text-sm text-gray-700">
            <li>
              <Link href="/" className="inline-block px-4 py-3 hover:text-blue-600 hover:bg-white rounded-t transition">
                Trang Chủ
              </Link>
            </li>

            {/* Cấp 1: Tour Trong Nước */}
            <li className="relative group">
              <Link href="/tours?region=Trong nước" className="flex items-center gap-1 px-4 py-3 hover:text-blue-600 hover:bg-white rounded-t transition">
                Du Lịch Trong Nước <ChevronDown size={14} className="text-gray-400 group-hover:rotate-180 transition duration-200" />
              </Link>
              {/* Mega Menu Dropdown */}
              <div className="absolute top-full left-0 w-[580px] bg-white shadow-2xl rounded-b-xl border border-gray-100 p-6 hidden group-hover:grid grid-cols-3 gap-6 z-50">
                <div>
                  <div className="font-extrabold text-blue-900 border-b pb-2 mb-3 text-xs uppercase tracking-wider">Miền Bắc</div>
                  <ul className="space-y-2 text-xs font-normal text-gray-600">
                    <li><Link href="/tours?destination=Hà Giang" className="hover:text-orange-500 font-medium">Hà Giang - Mã Pí Lèng</Link></li>
                    <li><Link href="/tours?destination=Sa Pa" className="hover:text-orange-500 font-medium">Sa Pa - Fansipan</Link></li>
                    <li><Link href="/tours?destination=Hạ Long" className="hover:text-orange-500 font-medium">Vịnh Hạ Long Du Thuyền</Link></li>
                    <li><Link href="/tours?destination=Ninh Bình" className="hover:text-orange-500 font-medium">Ninh Bình - Tràng An</Link></li>
                  </ul>
                </div>
                <div>
                  <div className="font-extrabold text-blue-900 border-b pb-2 mb-3 text-xs uppercase tracking-wider">Miền Trung</div>
                  <ul className="space-y-2 text-xs font-normal text-gray-600">
                    <li><Link href="/tours?destination=Đà Nẵng" className="hover:text-orange-500 font-medium">Đà Nẵng - Bà Nà Hills</Link></li>
                    <li><Link href="/tours?destination=Hội An" className="hover:text-orange-500 font-medium">Phố Cổ Hội An</Link></li>
                    <li><Link href="/tours?destination=Nha Trang" className="hover:text-orange-500 font-medium">Nha Trang Biển Đảo</Link></li>
                    <li><Link href="/tours?destination=Quy Nhơn" className="hover:text-orange-500 font-medium">Quy Nhơn - Kỳ Co</Link></li>
                  </ul>
                </div>
                <div>
                  <div className="font-extrabold text-blue-900 border-b pb-2 mb-3 text-xs uppercase tracking-wider">Miền Nam & Đảo</div>
                  <ul className="space-y-2 text-xs font-normal text-gray-600">
                    <li><Link href="/tours?destination=Phú Quốc" className="hover:text-orange-500 font-medium">Phú Quốc Thiên Đường Đảo</Link></li>
                    <li><Link href="/tours?destination=Côn Đảo" className="hover:text-orange-500 font-medium">Côn Đảo Tâm Linh</Link></li>
                    <li><Link href="/tours?destination=Cần Thơ" className="hover:text-orange-500 font-medium">Cần Thơ - Chợ Nổi Cái Răng</Link></li>
                  </ul>
                </div>
              </div>
            </li>

            {/* Cấp 1: Tour Nước Ngoài */}
            <li className="relative group">
              <Link href="/tours?region=Quốc tế" className="flex items-center gap-1 px-4 py-3 hover:text-blue-600 hover:bg-white rounded-t transition">
                Du Lịch Nước Ngoài <ChevronDown size={14} className="text-gray-400 group-hover:rotate-180 transition duration-200" />
              </Link>
              {/* Mega Menu Dropdown */}
              <div className="absolute top-full left-0 w-[580px] bg-white shadow-2xl rounded-b-xl border border-gray-100 p-6 hidden group-hover:grid grid-cols-3 gap-6 z-50">
                <div>
                  <div className="font-extrabold text-blue-900 border-b pb-2 mb-3 text-xs uppercase tracking-wider">Đông Nam Á</div>
                  <ul className="space-y-2 text-xs font-normal text-gray-600">
                    <li><Link href="/tours?destination=Thái Lan" className="hover:text-orange-500 font-medium">Thái Lan (Bangkok - Pattaya)</Link></li>
                    <li><Link href="/tours?destination=Singapore" className="hover:text-orange-500 font-medium">Singapore - Malaysia</Link></li>
                    <li><Link href="/tours?destination=Bali" className="hover:text-orange-500 font-medium">Bali - Indonesia</Link></li>
                  </ul>
                </div>
                <div>
                  <div className="font-extrabold text-blue-900 border-b pb-2 mb-3 text-xs uppercase tracking-wider">Đông Bắc Á</div>
                  <ul className="space-y-2 text-xs font-normal text-gray-600">
                    <li><Link href="/tours?destination=Hàn Quốc" className="hover:text-orange-500 font-medium">Hàn Quốc (Seoul - Nami)</Link></li>
                    <li><Link href="/tours?destination=Nhật Bản" className="hover:text-orange-500 font-medium">Nhật Bản (Tokyo - Phú Sĩ)</Link></li>
                    <li><Link href="/tours?destination=Đài Loan" className="hover:text-orange-500 font-medium">Đài Loan (Đài Bắc - Cao Hùng)</Link></li>
                    <li><Link href="/tours?destination=Trung Quốc" className="hover:text-orange-500 font-medium">Trương Gia Giới - Phượng Hoàng</Link></li>
                  </ul>
                </div>
                <div>
                  <div className="font-extrabold text-blue-900 border-b pb-2 mb-3 text-xs uppercase tracking-wider">Âu - Úc - Mỹ</div>
                  <ul className="space-y-2 text-xs font-normal text-gray-600">
                    <li><Link href="/tours?region=Châu Âu" className="hover:text-orange-500 font-medium">Châu Âu: Pháp - Thụy Sĩ - Ý</Link></li>
                    <li><Link href="/tours?region=Châu Úc" className="hover:text-orange-500 font-medium">Úc: Sydney - Melbourne</Link></li>
                    <li><Link href="/tours?region=Châu Mỹ" className="hover:text-orange-500 font-medium">Hoa Kỳ: Bờ Đông - Bờ Tây</Link></li>
                  </ul>
                </div>
              </div>
            </li>

            {/* Tour Giờ Chót (Highlight) */}
            <li>
              <Link href="/tours?flash_sale=true" className="flex items-center gap-1.5 px-4 py-3 text-orange-600 hover:text-orange-700 hover:bg-white rounded-t transition">
                <Flame size={16} className="text-orange-500 fill-orange-500 animate-bounce" />
                Tour Giờ Chót Giá Sốc
              </Link>
            </li>

            <li>
              <Link href="/tours" className="inline-block px-4 py-3 hover:text-blue-600 hover:bg-white rounded-t transition">
                Tất Cả Tour Ghép
              </Link>
            </li>

            <li>
              <Link href="#seo-guide" className="inline-block px-4 py-3 hover:text-blue-600 hover:bg-white rounded-t transition">
                Cẩm Nang Du Lịch
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-6 space-y-4">
          <input 
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm tour ghép..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm"
          />
          <div className="space-y-2 font-bold text-gray-800 text-sm">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 border-b">Trang Chủ</Link>
            <Link href="/tours?region=Trong nước" onClick={() => setMobileMenuOpen(false)} className="block py-2 border-b text-blue-600">Tour Trong Nước</Link>
            <Link href="/tours?region=Quốc tế" onClick={() => setMobileMenuOpen(false)} className="block py-2 border-b text-blue-600">Tour Quốc Tế</Link>
            <Link href="/tours?flash_sale=true" onClick={() => setMobileMenuOpen(false)} className="block py-2 border-b text-orange-600 flex items-center gap-1">
              <Flame size={16} /> Tour Giờ Chót
            </Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700">Đăng nhập Đại Lý (Admin)</Link>
          </div>
        </div>
      )}
    </header>
  );
}
