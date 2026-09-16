'use client';

import { useState } from 'react';
import { X, CheckCircle, Phone, Calendar, User, Users } from 'lucide-react';
import { Tour } from '@/lib/types';

export default function BookingModal({
  tour,
  isOpen,
  onClose
}: {
  tour: Tour | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [guestCount, setGuestCount] = useState('2');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !tour) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName || 'Khách Đặt Tour Web',
          phone,
          interested_tour_id: tour.id,
          interested_tour_name: tour.name,
          notes: `Số lượng: ${guestCount} khách. Ngày đi dự kiến: ${new Date(tour.departure_date).toLocaleDateString('vi-VN')}. Ghi chú thêm: ${notes}`,
          source: 'web_form'
        })
      });

      if (res.ok) {
        setIsSuccess(true);
      }
    } catch (err) {
      alert('Có lỗi khi gửi thông tin, xin vui lòng thử lại hoặc gọi Hotline!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setCustomerName('');
    setPhone('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Đăng Ký Giữ Chỗ Tour Ghép</h3>
            <p className="text-xs text-blue-200 mt-0.5">Cam kết giá gốc - Không phụ thu bất ngờ</p>
          </div>
          <button onClick={handleClose} className="p-1 rounded-full text-blue-200 hover:text-white hover:bg-white/10 transition">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={36} />
              </div>
              <h4 className="text-xl font-bold text-gray-800">Đăng Ký Giữ Chỗ Thành Công!</h4>
              <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                Hệ thống đã chuyển thông tin của bạn đến Chuyên viên điều hành tour. Chúng tôi sẽ gọi lại xác nhận số chỗ và gửi chương trình chi tiết trong vòng <b>5 - 10 phút</b>.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Hoàn Tất
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tour Summary Banner */}
              <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 flex items-start gap-3">
                <div className="flex-1">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">{tour.tour_code} • {tour.region}</div>
                  <div className="font-bold text-gray-800 text-sm line-clamp-2 mt-0.5">{tour.name}</div>
                  <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <Calendar size={12} /> Khởi hành: {new Date(tour.departure_date).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="font-extrabold text-orange-600 text-sm">
                      {new Intl.NumberFormat('vi-VN').format(tour.public_price)} đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Input: Customer Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Họ và Tên của bạn</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Input: Phone Number (Mandatory) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Số Điện Thoại (Zalo) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại để nhận xác nhận chỗ..."
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Input: Guests */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Số lượng khách dự kiến</label>
                <div className="relative">
                  <Users size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">1 người lớn</option>
                    <option value="2">2 người lớn</option>
                    <option value="3">3 người (Gia đình)</option>
                    <option value="4">4 người (Nhóm bạn)</option>
                    <option value="5+">5 người trở lên</option>
                  </select>
                </div>
              </div>

              {/* Input: Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Yêu cầu đặc biệt (nếu có)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Yêu cầu phòng đơn, suất ăn riêng, ngày đón khác..."
                  className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting || !phone}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:bg-gray-300 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition"
              >
                {submitting ? 'Đang gửi thông tin...' : 'GỬI YÊU CẦU GIỮ CHỖ NGAY'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
