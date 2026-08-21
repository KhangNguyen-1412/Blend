import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import CustomSelect from '../common/CustomSelect';

export const CustomerModal = ({ isOpen, onClose, onSave, editingCustomer }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tier: 'Đồng',
    spent: '0đ'
  });

  useEffect(() => {
    if (editingCustomer) {
      setFormData(editingCustomer);
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        tier: 'Đồng',
        spent: '0đ'
      });
    }
  }, [editingCustomer, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCustomer ? 'Chỉnh Sửa Hồ Sơ Hội Viên' : 'Ghi Danh Khách Hàng / Hội Viên Mới'}
    >
      <form onSubmit={handleSubmit} className="space-y-6 font-body">
        <div>
          <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
            Họ và Tên Khách Hàng *
          </label>
          <input
            type="text"
            required
            placeholder="VD: Trần Thị B"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white border border-[#124874] px-4 py-2.5 font-serif text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              Số Điện Thoại Liên Lạc *
            </label>
            <input
              type="text"
              required
              placeholder="VD: 0901234567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-white border border-[#124874] px-4 py-2.5 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            />
          </div>

          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              Địa Chỉ Thư Điện Tử (Email)
            </label>
            <input
              type="email"
              placeholder="VD: tranb@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white border border-[#124874] px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <CustomSelect
              label="Hạng Hội Viên (Tier)"
              value={formData.tier}
              options={[
                { value: 'Đồng', label: 'Hạng Đồng (Bronze)', icon: 'fa-shield', badge: '0%' },
                { value: 'Bạc', label: 'Hạng Bạc (Silver)', icon: 'fa-medal', badge: '5%' },
                { value: 'Vàng', label: 'Hạng Vàng (Gold)', icon: 'fa-crown', badge: '10%' },
                { value: 'Kim Cương', label: 'Hạng Kim Cương (Diamond)', icon: 'fa-gem', badge: '15%' },
              ]}
              onChange={(tier) => setFormData({ ...formData, tier })}
            />
          </div>

          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              Tổng Tích Lũy Chi Tiêu
            </label>
            <input
              type="text"
              placeholder="VD: 1,500,000đ"
              value={formData.spent}
              onChange={(e) => setFormData({ ...formData, spent: e.target.value })}
              className="w-full bg-white border border-[#124874] px-4 py-2.5 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            />
          </div>
        </div>

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
            {editingCustomer ? 'LƯU HỒ SƠ' : 'GHI DANH HỘI VIÊN'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerModal;
