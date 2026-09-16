import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Award, Clock, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* 4 Trụ cột cam kết */}
      <div className="container mx-auto px-4 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-lg">
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="font-bold text-white text-sm mb-1">100% Khởi Hành Đúng Hẹn</div>
              <div className="text-xs text-slate-400 leading-relaxed">Cam kết ghép đoàn chất lượng, không hủy tour phút chót.</div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="p-3 bg-orange-600/20 text-orange-400 rounded-lg">
              <Award size={26} />
            </div>
            <div>
              <div className="font-bold text-white text-sm mb-1">Giá Luôn Tốt Nhất</div>
              <div className="text-xs text-slate-400 leading-relaxed">Trực tiếp kết nối mạng lưới lữ hành gốc, không qua trung gian.</div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-lg">
              <Clock size={26} />
            </div>
            <div>
              <div className="font-bold text-white text-sm mb-1">Tư Vấn AI 24/7</div>
              <div className="text-xs text-slate-400 leading-relaxed">Trợ lý AI trả lời tức thì, đúng lịch trình, báo giá chính xác.</div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="p-3 bg-purple-600/20 text-purple-400 rounded-lg">
              <HeartHandshake size={26} />
            </div>
            <div>
              <div className="font-bold text-white text-sm mb-1">Bảo Hiểm Toàn Diện</div>
              <div className="text-xs text-slate-400 leading-relaxed">Mọi chuyến đi đều được bảo hiểm du lịch lên tới 210 triệu đồng.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-sm">
        {/* Cột 1: Thông tin thương hiệu */}
        <div className="lg:col-span-2 space-y-4">
          <div className="text-2xl font-black text-white tracking-tight">
            TRAVEL<span className="text-orange-500">TA</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Hệ thống đặt tour du lịch ghép hàng đầu Việt Nam. Nền tảng chuyên phân phối các tour ghép trọn gói trong nước và quốc tế chất lượng chuẩn sao, dịch vụ tận tâm.
          </p>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <span>Tầng 5, Tòa nhà Du Lịch, Quận 1, TP. Hồ Chí Minh</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={15} className="text-orange-500 flex-shrink-0" />
              <span>Hotline Bán Tour: <a href="tel:0909888999" className="text-white font-bold hover:underline">0909 888 999</a></span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={15} className="text-orange-500 flex-shrink-0" />
              <span>Email: dat-tour@travelta.vn</span>
            </div>
          </div>
        </div>

        {/* Cột 2: Tour Trong Nước */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-2">
            Tour Trong Nước
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><Link href="/tours?destination=Hà Giang" className="hover:text-white transition">Tour Hà Giang ghép 3N2Đ</Link></li>
            <li><Link href="/tours?destination=Đà Nẵng" className="hover:text-white transition">Tour Đà Nẵng - Bà Nà 4N3Đ</Link></li>
            <li><Link href="/tours?destination=Phú Quốc" className="hover:text-white transition">Tour Phú Quốc 4 Đảo 3N2Đ</Link></li>
            <li><Link href="/tours?destination=Sa Pa" className="hover:text-white transition">Tour Sa Pa Fansipan 2N1Đ</Link></li>
            <li><Link href="/tours?destination=Quy Nhơn" className="hover:text-white transition">Tour Quy Nhơn - Phú Yên</Link></li>
          </ul>
        </div>

        {/* Cột 3: Tour Quốc Tế */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
            Tour Nước Ngoài
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><Link href="/tours?destination=Thái Lan" className="hover:text-white transition">Tour Thái Lan 5N4Đ Giá Tốt</Link></li>
            <li><Link href="/tours?destination=Singapore" className="hover:text-white transition">Tour Singapore - Malaysia</Link></li>
            <li><Link href="/tours?destination=Hàn Quốc" className="hover:text-white transition">Tour Hàn Quốc Mùa Hoa 5N4Đ</Link></li>
            <li><Link href="/tours?destination=Nhật Bản" className="hover:text-white transition">Tour Nhật Bản Cung Đường Vàng</Link></li>
            <li><Link href="/tours?region=Châu Âu" className="hover:text-white transition">Tour Châu Âu 3 Nước Pháp - Ý</Link></li>
          </ul>
        </div>

        {/* Cột 4: Kết Nối Mạng Xã Hội */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
            Kênh Kết Nối
          </h4>
          <div className="flex gap-2.5 mb-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-lg bg-red-600/30 text-red-400 flex items-center justify-center hover:bg-red-600 hover:text-white transition">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-lg bg-pink-600/30 text-pink-400 flex items-center justify-center hover:bg-pink-600 hover:text-white transition">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Hỗ trợ đặt cọc trực tuyến linh hoạt: Chuyển khoản ngân hàng, Quét mã VietQR 24/7.
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto px-4 pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>&copy; {new Date().getFullYear()} TRAVEL TA. Tất cả các quyền được bảo lưu. Thiết kế tối ưu chuẩn SEO & AI Crawler.</div>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-slate-400">Điều khoản sử dụng</Link>
          <span>•</span>
          <Link href="#" className="hover:text-slate-400">Chính sách bảo mật</Link>
          <span>•</span>
          <Link href="/admin" className="hover:text-slate-400 font-semibold text-blue-400">Đăng nhập Quản Trị</Link>
        </div>
      </div>
    </footer>
  );
}
