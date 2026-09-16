'use client';

import { useState, useEffect } from 'react';
import {
  Users, Database, Settings, RefreshCw, LogOut, BarChart3,
  Phone, MessageSquare, CheckCircle2, AlertCircle, Clock,
  Send, Shield, UserCheck, Compass, ChevronDown, Bell, UserPlus, X
} from 'lucide-react';
import { Tour, Lead, PartnerSheet, KnowledgeItem, BrandSettings, UserAccount, SessionUser } from '@/lib/types';
import { getRuntimeDB } from '@/lib/db';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: 'Mới', color: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Đã liên hệ', color: 'bg-yellow-100 text-yellow-700' },
  consulting: { label: 'Đang tư vấn', color: 'bg-orange-100 text-orange-700' },
  quoted: { label: 'Đã báo giá', color: 'bg-purple-100 text-purple-700' },
  won: { label: '✓ Chốt Tour', color: 'bg-green-100 text-green-700' },
  lost: { label: 'Bỏ qua', color: 'bg-red-100 text-red-700' },
};

function formatPrice(p: number) {
  return new Intl.NumberFormat('vi-VN').format(p) + '₫';
}

export default function AdminPortal() {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'tours' | 'knowledge' | 'users' | 'settings'>('dashboard');

  // Data states
  const [tours, setTours] = useState<Tour[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [partners, setPartners] = useState<PartnerSheet[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [settings, setSettings] = useState<BrandSettings | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [pendingUsers, setPendingUsers] = useState<UserAccount[]>([]);

  // Form states
  const [sheetUrl, setSheetUrl] = useState('');
  const [salesContact, setSalesContact] = useState('');
  const [salesRepName, setSalesRepName] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const [kbCategory, setKbCategory] = useState('Quy định chung');
  const [kbQuestion, setKbQuestion] = useState('');
  const [kbAnswer, setKbAnswer] = useState('');
  const [leadsFilter, setLeadsFilter] = useState('all');
  const [userActionMsg, setUserActionMsg] = useState('');
  const [telegramStatus, setTelegramStatus] = useState('');

  useEffect(() => {
    // Read session from localStorage
    const sessionStr = typeof window !== 'undefined' ? localStorage.getItem('ta_session') : null;
    if (!sessionStr) {
      window.location.href = '/auth';
      return;
    }
    try {
      const session: SessionUser = JSON.parse(sessionStr);
      setCurrentUser(session);

      // Load data
      const db = getRuntimeDB();
      setTours(db.getAllToursAdmin());
      setLeads(db.getLeads());
      setPartners(db.getPartners());
      setKnowledge(db.getKnowledge());
      setSettings(db.getSettings());

      // Load users if admin
      if (session.role === 'admin') {
        fetch('/api/admin/users').then(r => r.json()).then(data => {
          if (data.success) {
            setUsers(data.users || []);
            setPendingUsers(data.pending || []);
          }
        }).catch(() => {});
      }
    } catch {
      window.location.href = '/auth';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ta_session');
    window.location.href = '/auth';
  };

  const handleSyncSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setSyncMsg('Đang đồng bộ...');
    try {
      const res = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl, salesContact, salesRepName })
      });
      const data = await res.json();
      setSyncMsg(data.success ? `✅ ${data.message}` : `❌ ${data.error}`);
      if (data.success) {
        const db = getRuntimeDB();
        setTours(db.getAllToursAdmin());
        setPartners(db.getPartners());
        setSheetUrl(''); setSalesContact(''); setSalesRepName('');
      }
    } catch { setSyncMsg('❌ Lỗi kết nối'); }
    finally { setIsSyncing(false); }
  };

  const handleAddKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: kbCategory, question: kbQuestion, answer: kbAnswer })
      });
      const data = await res.json();
      if (data.success) {
        const db = getRuntimeDB(); setKnowledge(db.getKnowledge());
        setKbQuestion(''); setKbAnswer('');
        alert('✅ Đã lưu vào Bộ Nhớ AI!');
      }
    } catch {}
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) alert('✅ Đã lưu cài đặt!');
    } catch {}
  };

  const handleTestTelegram = async () => {
    setTelegramStatus('Đang gửi...');
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, action: 'test_telegram' })
      });
      const data = await res.json();
      setTelegramStatus(data.success ? '✅ Gửi thành công!' : '❌ Thất bại!');
    } catch { setTelegramStatus('❌ Lỗi kết nối'); }
  };

  const handleUserAction = async (userId: string, action: 'approve' | 'reject' | 'disable' | 'enable') => {
    setUserActionMsg('Đang xử lý...');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, adminUsername: currentUser?.username })
      });
      const data = await res.json();
      setUserActionMsg(data.success ? `✅ ${data.message}` : `❌ ${data.error}`);
      if (data.success) {
        // Reload users
        fetch('/api/admin/users').then(r => r.json()).then(d => {
          if (d.success) { setUsers(d.users || []); setPendingUsers(d.pending || []); }
        });
      }
    } catch { setUserActionMsg('❌ Lỗi kết nối'); }
  };

  const filteredLeads = leadsFilter === 'all' ? leads : leads.filter(l => l.status === leadsFilter);
  const todayLeads = leads.filter(l => l.created_at?.startsWith(new Date().toISOString().slice(0, 10)));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Đang tải hệ thống...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  const navSale = [
    { key: 'dashboard', label: 'Tổng Quan', icon: BarChart3 },
    { key: 'leads', label: 'Khách Hàng (CRM)', icon: Users, badge: leads.filter(l => l.status === 'new').length },
  ];

  const navAdmin = [
    { key: 'tours', label: 'Tour & Đối Tác', icon: Database },
    { key: 'knowledge', label: 'Bộ Nhớ AI', icon: MessageSquare },
    { key: 'users', label: 'Nhân Viên', icon: UserCheck, badge: pendingUsers.length },
    { key: 'settings', label: 'Cài Đặt Hệ Thống', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ========== SIDEBAR ========== */}
      <aside className="w-64 flex-shrink-0 bg-slate-900 flex flex-col h-full overflow-y-auto">
        {/* Logo */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Compass size={18} className="text-white" />
            </div>
            <div>
              <div className="text-white font-black text-sm leading-tight">TRAVEL TA</div>
              <div className="text-slate-500 text-[10px] font-medium">Hệ Thống Quản Trị</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-5">
          {/* Sale Section */}
          <div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-3 mb-2">
              Khu Vực Bán Hàng
            </div>
            <div className="space-y-0.5">
              {navSale.map(item => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === item.key ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon size={16} /> <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && item.badge > 0 ? (
                    <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{item.badge}</span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Section */}
          {currentUser.role === 'admin' && (
            <div>
              <div className="flex items-center gap-1.5 text-[10px] text-orange-400 font-black uppercase tracking-widest px-3 mb-2">
                <Shield size={10} /> Khu Vực Quản Trị
              </div>
              <div className="space-y-0.5">
                {navAdmin.map(item => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      activeTab === item.key ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <item.icon size={16} /> <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && item.badge > 0 ? (
                      <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{item.badge}</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* User info + Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-300 font-black text-sm">{currentUser.fullname[0]}</span>
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-bold truncate">{currentUser.fullname}</div>
              <div className={`text-[10px] font-bold ${currentUser.role === 'admin' ? 'text-orange-400' : 'text-green-400'}`}>
                {currentUser.role === 'admin' ? '👑 Quản Trị Viên' : '💼 Nhân Viên Sale'}
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-slate-400 hover:text-white text-xs p-2 rounded-lg hover:bg-slate-800 transition">
            <LogOut size={14} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="font-black text-gray-900 text-sm">
              {activeTab === 'dashboard' && '📊 Tổng Quan Hệ Thống'}
              {activeTab === 'leads' && '👥 Quản Lý Khách Hàng (CRM)'}
              {activeTab === 'tours' && '🗺️ Quản Lý Tour & Đối Tác'}
              {activeTab === 'knowledge' && '🧠 Bộ Nhớ AI (Đào Tạo)'}
              {activeTab === 'users' && '👤 Quản Lý Nhân Viên'}
              {activeTab === 'settings' && '⚙️ Cài Đặt Hệ Thống'}
            </h1>
            <p className="text-gray-400 text-[11px]">Hệ thống CRM & Tour Ghép chuyên nghiệp</p>
          </div>
          <div className="flex items-center gap-3">
            {pendingUsers.length > 0 && currentUser.role === 'admin' && (
              <button onClick={() => setActiveTab('users')} className="flex items-center gap-1.5 bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-100 transition">
                <Bell size={13} /> {pendingUsers.length} chờ duyệt
              </button>
            )}
            <a href="/" target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:text-blue-500 font-bold bg-blue-50 px-3 py-1.5 rounded-lg">
              Xem Website →
            </a>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ===== DASHBOARD ===== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Tổng Khách Hàng', value: leads.length, icon: Users, color: 'blue', sub: `${todayLeads.length} hôm nay` },
                  { label: 'Chờ Xử Lý', value: leads.filter(l => l.status === 'new').length, icon: AlertCircle, color: 'orange', sub: 'Cần liên hệ ngay' },
                  { label: 'Đã Chốt Tour', value: leads.filter(l => l.status === 'won').length, icon: CheckCircle2, color: 'green', sub: 'Thành công' },
                  { label: 'Tổng Tour', value: tours.length, icon: Database, color: 'purple', sub: `${partners.length} đối tác` },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className={`w-10 h-10 rounded-xl bg-${kpi.color}-50 flex items-center justify-center mb-3`}>
                      <kpi.icon size={20} className={`text-${kpi.color}-500`} />
                    </div>
                    <div className={`text-2xl font-black text-${kpi.color}-600`}>{kpi.value}</div>
                    <div className="text-xs font-bold text-gray-700 mt-1">{kpi.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{kpi.sub}</div>
                  </div>
                ))}
              </div>

              {/* Recent Leads */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-black text-gray-900 text-sm">Khách Hàng Gần Đây</h3>
                  <button onClick={() => setActiveTab('leads')} className="text-blue-600 text-xs font-bold hover:text-blue-500">Xem tất cả →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>{['Khách hàng', 'SĐT', 'Trạng thái', 'Nguồn', 'Thời gian'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {leads.slice(0, 5).map(lead => (
                        <tr key={lead.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-semibold text-gray-800">{lead.customer_name || 'Khách ẩn danh'}</td>
                          <td className="px-4 py-3 font-mono text-blue-600">{lead.phone}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${STATUS_LABELS[lead.status]?.color}`}>
                              {STATUS_LABELS[lead.status]?.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 capitalize">{lead.source}</td>
                          <td className="px-4 py-3 text-gray-400">{new Date(lead.created_at).toLocaleDateString('vi-VN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== CRM LEADS ===== */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              {/* Filter bar */}
              <div className="flex flex-wrap gap-2">
                {['all', ...Object.keys(STATUS_LABELS)].map(s => (
                  <button key={s} onClick={() => setLeadsFilter(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${leadsFilter === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                    {s === 'all' ? `Tất cả (${leads.length})` : `${STATUS_LABELS[s]?.label} (${leads.filter(l => l.status === s).length})`}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>{['Khách hàng', 'SĐT', 'Quan tâm', 'Nguồn', 'Trạng thái', 'Ghi chú', 'Ngày'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-gray-500 uppercase">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredLeads.map(lead => (
                        <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-4 py-3.5 font-bold text-gray-800">{lead.customer_name || '—'}</td>
                          <td className="px-4 py-3.5">
                            <a href={`tel:${lead.phone}`} className="font-mono text-blue-600 hover:text-blue-500 font-bold flex items-center gap-1">
                              <Phone size={11} /> {lead.phone}
                            </a>
                          </td>
                          <td className="px-4 py-3.5 text-gray-500 max-w-[160px] truncate">{lead.interested_tour_name || '—'}</td>
                          <td className="px-4 py-3.5">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold capitalize">{lead.source}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-black ${STATUS_LABELS[lead.status]?.color}`}>
                              {STATUS_LABELS[lead.status]?.label}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-gray-400 max-w-[120px] truncate">{lead.notes || '—'}</td>
                          <td className="px-4 py-3.5 text-gray-400 whitespace-nowrap">
                            {new Date(lead.created_at).toLocaleDateString('vi-VN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredLeads.length === 0 && (
                    <div className="text-center py-12 text-gray-400 text-sm">Không có khách hàng nào</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== TOURS & PARTNERS ===== */}
          {activeTab === 'tours' && (
            <div className="space-y-6">
              {/* Sync Form */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2"><RefreshCw size={16} className="text-blue-500" /> Đồng Bộ Google Sheet Mới</h3>
                <form onSubmit={handleSyncSheet} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Link Google Sheet *</label>
                      <input type="url" required value={sheetUrl} onChange={e => setSheetUrl(e.target.value)}
                        placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Tên Sale Đối Tác</label>
                      <input type="text" value={salesRepName} onChange={e => setSalesRepName(e.target.value)}
                        placeholder="Ms. Thu Hương"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Zalo / Hotline Sale</label>
                      <input type="text" value={salesContact} onChange={e => setSalesContact(e.target.value)}
                        placeholder="0933112233"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="flex items-end">
                      <button type="submit" disabled={isSyncing}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-2.5 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2 disabled:opacity-60">
                        {isSyncing ? <><span className="animate-spin">⟳</span> Đang đồng bộ...</> : <><RefreshCw size={14} /> Đồng Bộ Ngay</>}
                      </button>
                    </div>
                  </div>
                  {syncMsg && <p className={`text-xs font-semibold ${syncMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>{syncMsg}</p>}
                </form>
              </div>

              {/* Partners */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-black text-gray-900 text-sm">Đối Tác Lữ Hành ({partners.length})</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {partners.map(p => (
                    <div key={p.id} className="px-5 py-4 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-800 text-sm">{p.company_name}</div>
                        <div className="text-xs text-gray-500">{p.sales_rep_name} — {p.sales_contact}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{p.notes}</div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black ${p.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.status}
                        </span>
                        <div className="text-[10px] text-gray-400 mt-1">{p.last_synced || 'Chưa đồng bộ'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tours Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-black text-gray-900 text-sm">Danh Sách Tour ({tours.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>{['Mã Tour', 'Tên Tour', 'Điểm Đến', 'KH', 'Chỗ', 'Giá Bán', 'Giá TA', 'COM', 'Công Ty'].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left text-[10px] font-black text-gray-500 uppercase whitespace-nowrap">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {tours.map(t => (
                        <tr key={t.id} className="hover:bg-gray-50/50">
                          <td className="px-3 py-3 font-mono text-blue-600 font-bold">{t.tour_code}</td>
                          <td className="px-3 py-3 font-semibold text-gray-800 max-w-[200px]">
                            <span className="block truncate">{t.name}</span>
                          </td>
                          <td className="px-3 py-3 text-gray-600">{t.destination}</td>
                          <td className="px-3 py-3 text-gray-500">{new Date(t.departure_date).toLocaleDateString('vi-VN')}</td>
                          <td className="px-3 py-3">
                            <span className={`font-bold ${t.slots_left <= 3 ? 'text-red-500' : t.slots_left <= 8 ? 'text-orange-500' : 'text-green-600'}`}>
                              {t.slots_left}/{t.max_pax}
                            </span>
                          </td>
                          <td className="px-3 py-3 font-bold text-gray-800">{formatPrice(t.public_price)}</td>
                          <td className="px-3 py-3 text-gray-500">{formatPrice(t.ta_price)}</td>
                          <td className="px-3 py-3 font-bold text-green-600">{formatPrice(t.commission)}</td>
                          <td className="px-3 py-3 text-gray-400 text-[10px] max-w-[100px] truncate">{t.company_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== KNOWLEDGE BASE ===== */}
          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-black text-gray-900 mb-4">Nạp Câu Hỏi & Trả Lời Cho AI</h3>
                <form onSubmit={handleAddKnowledge} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Chủ Đề / Danh Mục</label>
                      <input type="text" value={kbCategory} onChange={e => setKbCategory(e.target.value)}
                        placeholder="Ví dụ: Giá trẻ em, Visa, Hủy tour..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Câu Hỏi Khách Thường Hỏi *</label>
                      <input type="text" required value={kbQuestion} onChange={e => setKbQuestion(e.target.value)}
                        placeholder="Tour Thái Lan có bao gồm ăn buffet Baiyoke 86 tầng không?"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Câu Trả Lời Mẫu (AI Sẽ Dùng) *</label>
                    <textarea rows={4} required value={kbAnswer} onChange={e => setKbAnswer(e.target.value)}
                      placeholder="Dạ thưa anh/chị, toàn bộ tour Thái Lan cao cấp bên em đều đã bao gồm..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none" />
                  </div>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-2.5 rounded-xl text-sm transition">
                    Lưu Vào Bộ Nhớ AI
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-black text-gray-900 text-sm">Kho Tri Thức ({knowledge.length} mục)</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {knowledge.map(item => (
                    <div key={item.id} className="px-5 py-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{item.category}</span>
                      </div>
                      <div className="font-bold text-sm text-gray-800 mb-1">Q: {item.question}</div>
                      <div className="text-xs text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.answer }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== USERS MANAGEMENT ===== */}
          {activeTab === 'users' && currentUser.role === 'admin' && (
            <div className="space-y-6">
              {userActionMsg && (
                <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${userActionMsg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {userActionMsg}
                </div>
              )}

              {/* Pending approvals */}
              {pendingUsers.length > 0 && (
                <div className="bg-white rounded-2xl border border-orange-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-orange-100 bg-orange-50">
                    <h3 className="font-black text-orange-800 text-sm flex items-center gap-2">
                      <Bell size={16} className="text-orange-500" /> Chờ Phê Duyệt ({pendingUsers.length})
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {pendingUsers.map(user => (
                      <div key={user.id} className="px-5 py-4 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-800">{user.fullname}</div>
                          <div className="text-xs text-gray-500">@{user.username} · {user.phone}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{user.created_at ? new Date(user.created_at).toLocaleString('vi-VN') : ''}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => handleUserAction(user.id, 'approve')}
                            className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-black rounded-xl transition flex items-center gap-1">
                            <CheckCircle2 size={12} /> Duyệt
                          </button>
                          <button onClick={() => handleUserAction(user.id, 'reject')}
                            className="px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-black rounded-xl transition flex items-center gap-1">
                            <X size={12} /> Từ Chối
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active staff */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-black text-gray-900 text-sm">Danh Sách Nhân Viên</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>{['Họ tên', 'Username', 'SĐT', 'Vai trò', 'Trạng thái', 'Hành động'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-[10px] font-black text-gray-500 uppercase">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.filter(u => u.status !== 'pending').map(user => (
                        <tr key={user.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-bold text-gray-800">{user.fullname}</td>
                          <td className="px-4 py-3 font-mono text-gray-500">@{user.username}</td>
                          <td className="px-4 py-3 text-gray-500">{user.phone || '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${user.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                              {user.role === 'admin' ? 'Quản Trị' : 'Nhân Viên'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {user.id !== currentUser.userId && (
                              <button
                                onClick={() => handleUserAction(user.id, user.status === 'active' ? 'disable' : 'enable')}
                                className={`px-3 py-1 rounded-lg text-[10px] font-black transition ${user.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                                {user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== SETTINGS ===== */}
          {activeTab === 'settings' && settings && currentUser.role === 'admin' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Brand Info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-black text-gray-900 mb-4 text-sm">Thông Tin Thương Hiệu</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Tên Thương Hiệu', key: 'brand_name', type: 'text' },
                      { label: 'Khẩu Hiệu (Slogan)', key: 'slogan', type: 'text' },
                      { label: 'Hotline Bán Tour', key: 'hotline', type: 'text' },
                      { label: 'Zalo OA / Link Zalo', key: 'zalo_oa', type: 'text' },
                      { label: 'Email Hỗ Trợ', key: 'email', type: 'email' },
                      { label: 'Địa Chỉ Văn Phòng', key: 'address', type: 'text' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">{field.label}</label>
                        <input
                          type={field.type}
                          value={(settings as any)[field.key] || ''}
                          onChange={e => setSettings({ ...settings, [field.key]: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-black text-gray-900 mb-4 text-sm">Mạng Xã Hội</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Facebook URL', key: 'facebook_url' },
                      { label: 'YouTube URL', key: 'youtube_url' },
                      { label: 'TikTok URL', key: 'tiktok_url' },
                      { label: 'Instagram URL', key: 'instagram_url' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">{field.label}</label>
                        <input
                          type="url"
                          value={(settings as any)[field.key] || ''}
                          onChange={e => setSettings({ ...settings, [field.key]: e.target.value })}
                          placeholder="https://..."
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Keys */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-black text-gray-900 mb-4 text-sm">🔐 Mã Bảo Mật (API Keys)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Gemini API Key (bắt buộc cho AI hoạt động)</label>
                      <input type="password" value={settings.gemini_api_key || ''} onChange={e => setSettings({ ...settings, gemini_api_key: e.target.value })}
                        placeholder="AIzaSy..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Telegram Bot Token</label>
                      <input type="password" value={settings.telegram_bot_token || ''} onChange={e => setSettings({ ...settings, telegram_bot_token: e.target.value })}
                        placeholder="123456:ABC..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Telegram Chat ID</label>
                      <input type="text" value={settings.telegram_chat_id || ''} onChange={e => setSettings({ ...settings, telegram_chat_id: e.target.value })}
                        placeholder="-100123456789"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <button type="button" onClick={handleTestTelegram}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                      <Send size={12} /> Gửi Tin Nhắn Test
                    </button>
                    {telegramStatus && <span className={`text-xs font-semibold ${telegramStatus.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>{telegramStatus}</span>}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-3 rounded-xl text-sm transition shadow-lg">
                    Lưu Tất Cả Cài Đặt
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
