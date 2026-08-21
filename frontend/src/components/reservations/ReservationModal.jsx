import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import CustomSelect from '../common/CustomSelect';

const AREA_OPTIONS = [
  { value: 'Khu vực đọc báo in cổ điển', label: 'Khu vực đọc báo in cổ điển' },
  { value: 'Quầy Barista trực tiếp', label: 'Quầy Barista trực tiếp xem pha chế' },
  { value: 'Sân vườn thoáng mát', label: 'Sân vườn thoáng mát ngoài trời' },
  { value: 'Ban công tầng 2 ngắm phố', label: 'Ban công tầng 2 ngắm phố cổ' },
  { value: 'Phòng họp riêng VIP Salon', label: 'Phòng họp riêng VIP Salon' },
];

const TABLE_OPTIONS = [
  { value: '', label: '-- Tự động xếp bàn trống khi khách đến --' },
  { value: 'Bàn 01', label: 'Bàn 01 (Sảnh Báo In - 4 chỗ)' },
  { value: 'Bàn 02', label: 'Bàn 02 (Sảnh Báo In - 2 chỗ)' },
  { value: 'Bàn 03', label: 'Bàn 03 (Sảnh Báo In - 4 chỗ)' },
  { value: 'Bàn 04', label: 'Bàn 04 (Sảnh Báo In - 4 chỗ)' },
  { value: 'Bàn 05', label: 'Bàn 05 (Sảnh Báo In - 6 chỗ)' },
  { value: 'Bàn 06', label: 'Bàn 06 (Sảnh Báo In - 2 chỗ)' },
  { value: 'Bàn 07', label: 'Bàn 07 (Sảnh Báo In - 4 chỗ)' },
  { value: 'Bàn 08', label: 'Bàn 08 (Sảnh Báo In - 4 chỗ)' },
  { value: 'Quầy Bar 01', label: 'Quầy Bar 01 (Xem Barista pha chế)' },
  { value: 'Quầy Bar 02', label: 'Quầy Bar 02 (Xem Barista pha chế)' },
  { value: 'Bàn 09', label: 'Bàn 09 (Sân Vườn Di Sản - 4 chỗ)' },
  { value: 'Bàn 10', label: 'Bàn 10 (Sân Vườn Di Sản - 6 chỗ)' },
  { value: 'Bàn 11', label: 'Bàn 11 (Sân Vườn Di Sản - 4 chỗ)' },
  { value: 'Bàn 12', label: 'Bàn 12 (Sân Vườn Di Sản - 2 chỗ)' },
  { value: 'Bàn 13', label: 'Bàn 13 (Ban Công Tầng 2 - 2 chỗ)' },
  { value: 'Bàn 14', label: 'Bàn 14 (Ban Công Tầng 2 - 4 chỗ)' },
  { value: 'Bàn 15', label: 'Bàn 15 (Ban Công Tầng 2 - 4 chỗ)' },
  { value: 'Bàn 16', label: 'Bàn 16 (Ban Công Tầng 2 - 6 chỗ)' },
  { value: 'Phòng VIP 01', label: 'Phòng VIP 01 (VIP Salon - 8 chỗ)' },
  { value: 'Phòng VIP 02', label: 'Phòng VIP 02 (VIP Salon - 10 chỗ)' },
];

const STATUS_OPTIONS = [
  { value: 'Chờ xác nhận', label: 'Chờ xác nhận' },
  { value: 'Đã xác nhận', label: 'Đã xác nhận' },
  { value: 'Đã phục vụ', label: 'Đã phục vụ' },
  { value: 'Đã hủy', label: 'Đã hủy' },
];

export const ReservationModal = ({ isOpen, onClose, onSave, editingReservation }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    guests: 2,
    date: new Date().toISOString().split('T')[0],
    time: '18:30',
    area: 'Khu vực đọc báo in cổ điển',
    table_number: '',
    note: '',
    status: 'Chờ xác nhận'
  });

  useEffect(() => {
    if (editingReservation) {
      setFormData({
        ...editingReservation,
        table_number: editingReservation.table_number || ''
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        guests: 2,
        date: new Date().toISOString().split('T')[0],
        time: '18:30',
        area: 'Khu vực đọc báo in cổ điển',
        table_number: '',
        note: '',
        status: 'Chờ xác nhận'
      });
    }
  }, [editingReservation, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingReservation ? 'Biên Tập Phiếu Đặt Chỗ Thực Khách' : 'Ghi Danh Đặt Chỗ Thủ Công Mới'}
    >
      <form onSubmit={handleSubmit} className="space-y-5 font-body">
        
        {/* Name & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              Họ và Tên Thực Khách *
            </label>
            <input
              type="text"
              required
              placeholder="VD: Nguyễn Văn An"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white border border-[#124874] px-4 py-2.5 font-serif text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            />
          </div>

          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              Số Điện Thoại Liên Lạc *
            </label>
            <input
              type="tel"
              required
              placeholder="VD: 0908123456"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-white border border-[#124874] px-4 py-2.5 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            />
          </div>
        </div>

        {/* Email & Guests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              Thư Điện Tử (Email)
            </label>
            <input
              type="email"
              placeholder="an.nguyen@email.com"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white border border-[#124874] px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            />
          </div>

          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              Số Lượng Khách *
            </label>
            <input
              type="number"
              min="1"
              max="50"
              required
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value, 10) || 1 })}
              className="w-full bg-white border border-[#124874] px-4 py-2.5 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            />
          </div>
        </div>

        {/* Date, Time & Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              Ngày Đến *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-white border border-[#124874] px-3.5 py-2 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            />
          </div>

          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              Khung Giờ *
            </label>
            <input
              type="time"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full bg-white border border-[#124874] px-3.5 py-2 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            />
          </div>

          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              Trạng Thái Phiếu
            </label>
            <CustomSelect
              options={STATUS_OPTIONS}
              value={formData.status}
              onChange={(val) => setFormData({ ...formData, status: val })}
              className="w-full"
            />
          </div>
        </div>

        {/* Area & Specific Table Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              Khu Vực Bàn Thưởng Thức *
            </label>
            <CustomSelect
              options={AREA_OPTIONS}
              value={formData.area}
              onChange={(val) => setFormData({ ...formData, area: val })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              Chỉ Định Số Bàn Cụ Thể (Tùy chọn)
            </label>
            <CustomSelect
              options={TABLE_OPTIONS}
              value={formData.table_number || ''}
              onChange={(val) => setFormData({ ...formData, table_number: val })}
              className="w-full"
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
            Ghi Chú Yêu Cầu Của Thực Khách
          </label>
          <textarea
            rows="3"
            placeholder="VD: Cần bàn gần cửa sổ, chuẩn bị trước set trà Oolong kem phô mai..."
            value={formData.note || ''}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="w-full bg-white border border-[#124874] p-3 font-serif text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
          ></textarea>
        </div>

        {/* Modal Buttons */}
        <div className="pt-5 border-t border-[#124874] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="press-btn px-5 py-2.5 border border-[#124874] text-[#124874] font-cinzel text-xs font-bold hover:bg-gray-100 transition-colors"
          >
            HỦY BỎ
          </button>
          <button
            type="submit"
            style={{ backgroundColor: '#124874', color: '#ffffff' }}
            className="press-btn px-6 py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-md flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-floppy-disk"></i>
            <span>{editingReservation ? 'LƯU BIÊN TẬP' : 'XÁC NHẬN GHI DANH'}</span>
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default ReservationModal;
