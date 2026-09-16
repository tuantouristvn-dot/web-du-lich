'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Compass, LogIn, UserPlus, KeyRound, Eye, EyeOff, Phone, User, Lock, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import { SessionUser } from '@/lib/types';

type AuthTab = 'login' | 'register' | 'forgot';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [successData, setSuccessData] = useState<SessionUser | null>(null);

  // Login form
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regFullname, setRegFullname] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await res.json();
      if (data.success) {
        // Save session to localStorage
        localStorage.setItem('ta_session', JSON.stringify(data.user));
        setSuccessData(data.user);
        // Redirect to admin after short delay
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Lỗi kết nối. Vui lòng thử lại!' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: regUsername, password: regPassword, fullname: regFullname, phone: regPhone })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setRegFullname(''); setRegPhone(''); setRegUsername(''); setRegPassword(''); setRegConfirm('');
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Lỗi kết nối. Vui lòng thử lại!' });
    } finally {
      setIsLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 text-center shadow-2xl max-w-sm w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Đăng Nhập Thành Công!</h2>
          <p className="text-gray-500 text-sm">Xin chào <strong className="text-blue-600">{successData.fullname}</strong></p>
          <p className="text-xs text-gray-400 mt-1">Đang chuyển hướng đến hệ thống...</p>
          <div className="mt-6 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition text-sm font-medium">
          <ChevronLeft size={18} /> Về trang chủ
        </Link>
        <div className="flex items-center gap-2 text-white font-black text-lg">
          <Compass size={22} className="text-orange-400" />
          TRAVEL TA
        </div>
      </div>

      {/* Main Card */}
      <div className="flex-1 flex items-center justify-center p-4 pb-12">
        <div className="w-full max-w-md">
          {/* Logo area */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur rounded-2xl mb-4">
              <Compass size={32} className="text-orange-400" />
            </div>
            <h1 className="text-3xl font-black text-white">Cổng Nội Bộ</h1>
            <p className="text-blue-200 text-sm mt-1">Hệ thống quản lý Tour Ghép chuyên nghiệp</p>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-white/10 backdrop-blur rounded-2xl p-1 mb-6">
            {([
              { key: 'login', label: 'Đăng Nhập', icon: LogIn },
              { key: 'register', label: 'Đăng Ký', icon: UserPlus },
              { key: 'forgot', label: 'Quên MK', icon: KeyRound },
            ] as { key: AuthTab; label: string; icon: any }[]).map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setMessage(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-800 shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-4 p-4 rounded-xl text-sm font-medium flex items-start gap-2 ${
              message.type === 'success'
                ? 'bg-green-500/20 text-green-100 border border-green-500/30'
                : 'bg-red-500/20 text-red-100 border border-red-500/30'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" /> : <span className="text-lg leading-none flex-shrink-0">⚠️</span>}
              {message.text}
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">

            {/* LOGIN TAB */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <h2 className="text-white font-black text-xl mb-1">Chào Mừng Trở Lại!</h2>
                  <p className="text-blue-200 text-xs">Nhập thông tin đăng nhập để tiếp tục</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-blue-200 mb-1.5 uppercase tracking-wider">Tên đăng nhập</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300" />
                      <input
                        type="text"
                        required
                        value={loginUsername}
                        onChange={e => setLoginUsername(e.target.value)}
                        placeholder="admin hoặc username của bạn"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-orange-400 focus:bg-white/20 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-blue-200 mb-1.5 uppercase tracking-wider">Mật khẩu</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-orange-400 focus:bg-white/20 transition"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 text-white font-black rounded-xl transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <><span className="animate-spin">⟳</span> Đang xử lý...</>
                  ) : (
                    <><LogIn size={18} /> Đăng Nhập</>
                  )}
                </button>

                <div className="text-center">
                  <button type="button" onClick={() => setActiveTab('forgot')} className="text-blue-300 hover:text-white text-xs transition">
                    Quên mật khẩu? →
                  </button>
                </div>
              </form>
            )}

            {/* REGISTER TAB */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <h2 className="text-white font-black text-xl mb-1">Đăng Ký Tài Khoản</h2>
                  <p className="text-blue-200 text-xs">Sau khi đăng ký, chờ Quản trị viên phê duyệt</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-blue-200 mb-1 uppercase tracking-wider">Họ và Tên *</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                      <input
                        type="text" required value={regFullname} onChange={e => setRegFullname(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-orange-400 transition"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-blue-200 mb-1 uppercase tracking-wider">Số Điện Thoại *</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                      <input
                        type="tel" required value={regPhone} onChange={e => setRegPhone(e.target.value)}
                        placeholder="0909 888 999"
                        className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-orange-400 transition"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-blue-200 mb-1 uppercase tracking-wider">Tên Đăng Nhập *</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                      <input
                        type="text" required value={regUsername} onChange={e => setRegUsername(e.target.value.toLowerCase())}
                        placeholder="sales_abc (tối thiểu 4 ký tự)"
                        className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-orange-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-blue-200 mb-1 uppercase tracking-wider">Mật Khẩu *</label>
                    <input
                      type="password" required value={regPassword} onChange={e => setRegPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-orange-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-blue-200 mb-1 uppercase tracking-wider">Xác Nhận MK *</label>
                    <input
                      type="password" required value={regConfirm} onChange={e => setRegConfirm(e.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-orange-400 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? <><span className="animate-spin">⟳</span> Đang gửi...</> : <><UserPlus size={18} /> Gửi Yêu Cầu Đăng Ký</>}
                </button>

                <p className="text-blue-300/70 text-[11px] text-center leading-relaxed">
                  Tài khoản sẽ được phê duyệt bởi Quản trị viên. Bạn sẽ được thông báo qua điện thoại sau khi được duyệt.
                </p>
              </form>
            )}

            {/* FORGOT PASSWORD TAB */}
            {activeTab === 'forgot' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-white font-black text-xl mb-1">Quên Mật Khẩu?</h2>
                  <p className="text-blue-200 text-xs">Liên hệ trực tiếp Quản trị viên để được reset mật khẩu</p>
                </div>

                <div className="bg-white/10 rounded-2xl p-5 space-y-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/30 flex items-center justify-center flex-shrink-0">
                      <Phone size={18} className="text-orange-300" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Gọi điện / Zalo</p>
                      <p className="text-blue-200 text-xs mt-0.5">Liên hệ Admin qua hotline hoặc Zalo nội bộ để được reset mật khẩu trong vòng 5 phút</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/30 flex items-center justify-center flex-shrink-0">
                      <KeyRound size={18} className="text-blue-300" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Admin đặt lại mật khẩu</p>
                      <p className="text-blue-200 text-xs mt-0.5">Admin vào <strong className="text-white">Trang Quản Trị → Quản lý Nhân viên</strong> để cập nhật mật khẩu mới cho bạn</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-blue-200 text-xs text-center leading-relaxed">
                    💡 <strong className="text-white">Lý do thiết kế này:</strong> Hệ thống nội bộ không lưu email, nên Admin reset mật khẩu trực tiếp là cách nhanh nhất và an toàn nhất!
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('login')}
                  className="w-full py-3 border border-white/20 text-white/80 hover:text-white hover:bg-white/10 font-bold rounded-xl transition text-sm flex items-center justify-center gap-2"
                >
                  <ArrowRight size={16} className="rotate-180" /> Quay lại Đăng Nhập
                </button>
              </div>
            )}
          </div>

          <p className="text-center text-blue-300/60 text-xs mt-6">
            Hệ thống nội bộ — chỉ dành cho nhân viên được phép
          </p>
        </div>
      </div>
    </div>
  );
}
