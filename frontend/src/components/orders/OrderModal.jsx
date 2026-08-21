import React, { useState } from 'react';
import Modal from '../common/Modal';
import CustomSelect from '../common/CustomSelect';

export const OrderModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customer: '',
    total: '',
    payment: 'Tiền mặt',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ customer: '', total: '', payment: 'Tiền mặt', notes: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lập Phiếu Đơn Hàng & Điều Phối Mới">
      <form onSubmit={handleSubmit} className="space-y-6 font-body">
        <div>
          <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
            Tên Khách Hàng / Đơn Vị Nhận *
          </label>
          <input
            type="text"
            required
            placeholder="VD: Nguyễn Văn A"
            value={formData.customer}
            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            className="w-full bg-white border border-[#124874] px-4 py-2.5 font-serif text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              Tổng Tiền (VNĐ) *
            </label>
            <input
              type="text"
              required
              placeholder="VD: 75000"
              value={formData.total}
              onChange={(e) => setFormData({ ...formData, total: e.target.value })}
              className="w-full bg-white border border-[#124874] px-4 py-2.5 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            />
          </div>

          <div>
            <CustomSelect
              label="Phương Thức Thanh Toán"
              value={formData.payment}
              options={[
                { value: 'Tiền mặt', label: 'Tiền mặt (Cash)', icon: 'fa-money-bill-wave' },
                { value: 'Chuyển khoản QR', label: 'Chuyển khoản QR / VietQR', icon: 'fa-qrcode' },
                { value: 'MoMo', label: 'Ví Điện Tử MoMo', icon: 'fa-wallet' },
                { value: 'ZaloPay', label: 'Ví Điện Tử ZaloPay', icon: 'fa-wallet' },
                { value: 'Thẻ Tín Dụng', label: 'Thẻ Tín Dụng (Visa/Master)', icon: 'fa-credit-card' },
              ]}
              onChange={(payment) => setFormData({ ...formData, payment })}
            />
          </div>
        </div>

        <div>
          <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
            Ghi Chú Pha Chế &amp; Phục Vụ
          </label>
          <textarea
            rows="3"
            placeholder="VD: Ít đá, 70% đường, giao trước 11h trưa..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-white border border-[#124874] p-3 font-serif text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t-2 border-[#124874]">
          <button
            type="button"
            onClick={onClose}
            className="press-btn px-6 py-2.5 bg-white text-[#161413] font-cinzel text-xs font-bold hover:bg-[#EDE7DC]"
          >
            HỦY BỎ
          </button>
          <button
            type="submit"
            style={{ backgroundColor: '#124874', color: '#ffffff' }}
            className="press-btn px-8 py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-sm"
          >
            LẬP ĐƠN HÀNG
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default OrderModal;
