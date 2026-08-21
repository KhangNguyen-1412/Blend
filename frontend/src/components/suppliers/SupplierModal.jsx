import React, { useState, useEffect } from 'react';
import CustomSelect from '../common/CustomSelect';

const SUPPLIER_CATEGORIES = [
  { value: 'Hạt cà phê đặc sản', label: 'Hạt cà phê đặc sản (Arabica Cầu Đất, Robusta Gia Lai)', icon: 'fa-seedling' },
  { value: 'Sữa tươi & Chế phẩm', label: 'Sữa tươi & Chế phẩm (Sữa thanh trùng, Sữa hạt, Sữa đặc)', icon: 'fa-bottle-water' },
  { value: 'Trà & Thảo mộc', label: 'Trà & Thảo mộc (Trà Ô long Bảo Lộc, Trà đen Tây Bắc)', icon: 'fa-leaf' },
  { value: 'Siro & Topping', label: 'Siro & Topping (Monin, Torani, Hạt trân châu, Thạch)', icon: 'fa-flask' },
  { value: 'Bao bì & Ly tách', label: 'Bao bì & Ly tách (Ly giấy sinh thái, Ống hút bã mía)', icon: 'fa-box-open' },
  { value: 'Thiết bị & Phụ tùng', label: 'Thiết bị & Phụ tùng (Máy pha La Marzocco, Cối xay)', icon: 'fa-gears' },
];

const SUPPLIER_STATUSES = [
  { value: 'Đang hợp tác', label: 'Đang hợp tác (Active Vendor)', icon: 'fa-handshake' },
  { value: 'Tạm dừng', label: 'Tạm dừng nhập hàng (On Hold)', icon: 'fa-pause' },
  { value: 'Ngừng hợp tác', label: 'Ngừng hợp tác (Terminated)', icon: 'fa-ban' },
];

export const SupplierModal = ({ isOpen, onClose, onSave, editingSupplier }) => {
  const [form, setForm] = useState({
    name: '',
    code: '',
    category: 'Hạt cà phê đặc sản',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    status: 'Đang hợp tác',
    debt: '0đ',
    notes: ''
  });

  useEffect(() => {
    if (editingSupplier) {
      setForm({
        name: editingSupplier.name || '',
        code: editingSupplier.code || '',
        category: editingSupplier.category || 'Hạt cà phê đặc sản',
        contact_person: editingSupplier.contact_person || '',
        phone: editingSupplier.phone || '',
        email: editingSupplier.email || '',
        address: editingSupplier.address || '',
        status: editingSupplier.status || 'Đang hợp tác',
        debt: editingSupplier.debt || '0đ',
        notes: editingSupplier.notes || ''
      });
    } else {
      setForm({
        name: '',
        code: '',
        category: 'Hạt cà phê đặc sản',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
        status: 'Đang hợp tác',
        debt: '0đ',
        notes: ''
      });
    }
  }, [editingSupplier, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-body animate-auth-page">
      <div 
        className="editorial-card-press bg-[#FAF7F2] w-full max-w-2xl border-2 border-[#124874] shadow-[8px_8px_0px_rgba(18,72,116,0.95)] max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div 
          style={{ backgroundColor: '#124874', color: '#ffffff' }}
          className="p-4 border-b-2 border-[#0D3656] flex justify-between items-center flex-shrink-0"
        >
          <div>
            <span className="font-cinzel text-[10px] text-[#C59B27] tracking-widest uppercase font-bold block">
              DANH BỘ ĐỐI TÁC CUNG ỨNG VẬT TƯ
            </span>
            <h3 className="font-display text-xl font-bold tracking-tight text-white">
              {editingSupplier ? `Hiệu Chỉnh Đối Tác: ${editingSupplier.name}` : 'Thiết Lập Nhà Cung Cấp Mới'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-[#CF373D] text-white transition-colors cursor-pointer border border-white/20"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                Tên Nhà Cung Cấp / Nông Trại *
              </label>
              <input
                type="text"
                required
                placeholder="VD: Nông Trại Cà Phê Cầu Đất Farm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white border border-[#124874] px-3.5 py-2 font-serif text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
              />
            </div>

            <div>
              <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                Mã Định Danh Đối Tác
              </label>
              <input
                type="text"
                placeholder="VD: NCC-CAUDAT"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full bg-white border border-[#124874] px-3.5 py-2 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <CustomSelect
                label="Nhóm Vật Tư Cung Ứng *"
                value={form.category}
                options={SUPPLIER_CATEGORIES}
                onChange={(cat) => setForm({ ...form, category: cat })}
              />
            </div>

            <div>
              <CustomSelect
                label="Trạng Thái Hợp Tác *"
                value={form.status}
                options={SUPPLIER_STATUSES}
                onChange={(st) => setForm({ ...form, status: st })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                Người Đại Diện / Phụ Trách
              </label>
              <input
                type="text"
                placeholder="VD: Anh Tuấn (Kinh doanh)"
                value={form.contact_person}
                onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                className="w-full bg-white border border-[#124874] px-3.5 py-2 font-serif text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
              />
            </div>

            <div>
              <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                Số Điện Thoại Đặt Hàng *
              </label>
              <input
                type="text"
                required
                placeholder="0912 345 678"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-white border border-[#124874] px-3.5 py-2 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
              />
            </div>

            <div>
              <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                Công Nợ Hiện Tại (VNĐ)
              </label>
              <input
                type="text"
                placeholder="0đ"
                value={form.debt}
                onChange={(e) => setForm({ ...form, debt: e.target.value })}
                className="w-full bg-white border border-[#124874] px-3.5 py-2 font-mono text-sm text-[#CF373D] font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                Email Đặt Hàng &amp; Đối Soát
              </label>
              <input
                type="email"
                placeholder="order@caudatfarm.vn"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white border border-[#124874] px-3.5 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
              />
            </div>

            <div>
              <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                Địa Chỉ Nông Trại / Kho Xuất Hàng
              </label>
              <input
                type="text"
                placeholder="Thôn Trường An, Xã Xuân Trường, Đà Lạt"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-white border border-[#124874] px-3.5 py-2 font-serif text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
              />
            </div>
          </div>

          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
              Ghi Chú Phẩm Cấp Nông Sản &amp; Chu Kỳ Thanh Toán
            </label>
            <textarea
              rows="2"
              placeholder="VD: Cà phê sơ chế Honey/Washed độ cao 1500m. Thanh toán gối đầu 15 ngày."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-white border border-[#124874] px-3.5 py-2 font-serif text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-[#D8D1C5] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-white border border-[#D8D1C5] font-cinzel text-xs font-bold hover:bg-[#EDE7DC] transition-colors cursor-pointer"
            >
              HỦY BỎ
            </button>
            <button
              type="submit"
              style={{ backgroundColor: '#124874', color: '#ffffff' }}
              className="press-btn px-6 py-2 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-floppy-disk"></i> {editingSupplier ? 'LƯU HIỆU CHỈNH' : 'THIẾT LẬP ĐỐI TÁC'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierModal;
