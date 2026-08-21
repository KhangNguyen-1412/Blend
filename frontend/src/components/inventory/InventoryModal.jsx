import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import CustomSelect from '../common/CustomSelect';

export const InventoryModal = ({ isOpen, onClose, onSave, editingItem }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    unit: 'Kg',
    qty: 0,
    min: 5,
    status: 'ok'
  });

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({
        id: '',
        name: '',
        unit: 'Kg',
        qty: 10,
        min: 5,
        status: 'ok'
      });
    }
  }, [editingItem, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? 'Điều Chỉnh Định Mức Tồn Kho' : 'Khai Báo Nguyên Vật Liệu Mới'}
    >
      <form onSubmit={handleSubmit} className="space-y-6 font-body">
        <div>
          <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
            Tên Nguyên Vật Liệu *
          </label>
          <input
            type="text"
            required
            placeholder="VD: Trà Xanh Oolong Đặc Biệt"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white border border-[#124874] px-4 py-2.5 font-serif text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <CustomSelect
              label="Đơn Vị Tính *"
              value={formData.unit}
              options={[
                { value: 'Kg', label: 'Kilogram (Kg)', icon: 'fa-scale-balanced' },
                { value: 'Gram', label: 'Gram (g)', icon: 'fa-cubes-stacked' },
                { value: 'Lít', label: 'Lít (L)', icon: 'fa-bottle-water' },
                { value: 'Hộp', label: 'Hộp (Box)', icon: 'fa-box' },
                { value: 'Chai', label: 'Chai (Bottle)', icon: 'fa-wine-bottle' },
                { value: 'Gói', label: 'Gói (Pack)', icon: 'fa-bag-shopping' },
              ]}
              onChange={(unit) => setFormData({ ...formData, unit })}
            />
          </div>

          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              Số Lượng Thực Tế *
            </label>
            <input
              type="number"
              step="any"
              required
              value={formData.qty}
              onChange={(e) => setFormData({ ...formData, qty: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white border border-[#124874] px-4 py-2.5 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            />
          </div>

          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              Định Mức Cảnh Báo (Tối thiểu) *
            </label>
            <input
              type="number"
              step="any"
              required
              value={formData.min}
              onChange={(e) => setFormData({ ...formData, min: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white border border-[#124874] px-4 py-2.5 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            />
          </div>
        </div>

        <div className="p-4 bg-[#FAF7F2] border border-[#D8D1C5] text-xs font-serif text-[#6E675F] italic">
          <i className="fa-solid fa-info-circle text-[#124874] mr-1.5"></i>
          Khi lượng tồn kho thực tế giảm xuống dưới ngưỡng tối thiểu, hệ thống sẽ tự động đóng dấu đỏ <strong>CẢNH BÁO</strong> tại dải tin đầu trang.
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
            {editingItem ? 'LƯU SỔ KHO' : 'GHI NHẬN MỚI'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InventoryModal;
