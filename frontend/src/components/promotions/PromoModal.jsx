import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import CustomSelect from '../common/CustomSelect';

export const PromoModal = ({ isOpen, onClose, onSave, editingPromo }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    discount: '',
    condition: '',
    status: 'Đang chạy'
  });

  useEffect(() => {
    if (editingPromo) {
      setFormData(editingPromo);
    } else {
      setFormData({
        code: '',
        name: '',
        discount: '',
        condition: '',
        status: 'Đang chạy'
      });
    }
  }, [editingPromo, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPromo ? 'Chỉnh Sửa Mã Khuyến Mãi' : 'Phát Hành Mã Ưu Đãi / Voucher Mới'}
    >
      <form onSubmit={handleSubmit} className="space-y-6 font-body">
        <div>
          <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
            Tên Chương Trình / Tựa Đề Ưu Đãi *
          </label>
          <input
            type="text"
            required
            placeholder="VD: Tri Ân Khách Hàng Thân Thiết"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white border border-[#124874] px-4 py-2.5 font-serif text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              Mã Khuyến Mãi (CODE) *
            </label>
            <input
              type="text"
              required
              placeholder="VD: BLEND20K hoặc SALE50"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full bg-white border border-[#124874] px-4 py-2.5 font-mono text-base font-bold tracking-wider text-[#CF373D] focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            />
          </div>

          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              Mức Giảm Giá (Chiết khấu) *
            </label>
            <input
              type="text"
              required
              placeholder="VD: 20% hoặc 25.000đ"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              className="w-full bg-white border border-[#124874] px-4 py-2.5 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            />
          </div>
        </div>

        <div>
          <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
            Điều Kiện Áp Dụng
          </label>
          <input
            type="text"
            placeholder="VD: Áp dụng đơn từ 150.000đ, không kèm khuyến mãi khác"
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            className="w-full bg-white border border-[#124874] px-4 py-2.5 font-serif text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
          />
        </div>

        <div>
          <CustomSelect
            label="Trạng Thái Hiệu Lực"
            value={formData.status}
            options={[
              { value: 'Đang chạy', label: 'Đang áp dụng (Active)', icon: 'fa-stamp' },
              { value: 'Đã kết thúc', label: 'Đã tạm dừng / Hết hạn', icon: 'fa-ban' },
            ]}
            onChange={(status) => setFormData({ ...formData, status })}
          />
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
            style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
            className="press-btn px-8 py-2.5 font-cinzel text-xs font-bold hover:bg-[#AB282D] transition-colors shadow-sm"
          >
            {editingPromo ? 'LƯU MÃ ƯU ĐÃI' : 'PHÁT HÀNH VOUCHER'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PromoModal;
