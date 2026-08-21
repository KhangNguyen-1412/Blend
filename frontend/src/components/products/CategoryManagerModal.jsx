import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { categoriesApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const CategoryManagerModal = ({ isOpen, onClose, onCategoriesUpdated }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'fa-mug-hot',
    description: ''
  });
  const { addToast } = useToast();

  const ICON_PRESETS = [
    { id: 'fa-mug-hot', label: 'Tách Nóng' },
    { id: 'fa-glass-water', label: 'Ly Trà / Nước' },
    { id: 'fa-lemon', label: 'Trái Cây' },
    { id: 'fa-layer-group', label: 'Topping' },
    { id: 'fa-cake-candles', label: 'Bánh Ngọt' },
    { id: 'fa-blender', label: 'Đá Xay' },
    { id: 'fa-seedling', label: 'Thảo Mộc' },
    { id: 'fa-fire-flame-curved', label: 'Rang Đậm' },
    { id: 'fa-ice-cream', label: 'Kem / Gelato' },
    { id: 'fa-bottle-water', label: 'Ủ Lạnh / Chai' },
    { id: 'fa-cookie', label: 'Bánh Quy' },
    { id: 'fa-crown', label: 'Đặc Sản VIP' },
  ];

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoriesApi.getAll();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Lỗi tải danh mục', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      icon: 'fa-mug-hot',
      description: ''
    });
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      icon: cat.icon || 'fa-mug-hot',
      description: cat.description || ''
    });
  };

  const handleDelete = async (cat) => {
    if (cat.product_count > 0) {
      addToast(`Không thể xóa "${cat.name}" vì đang có ${cat.product_count} món đồ uống trực thuộc!`, 'error');
      return;
    }

    if (!window.confirm(`Xác nhận xóa hoàn toàn danh mục "${cat.name}" khỏi thực đơn?`)) return;

    try {
      const res = await categoriesApi.delete(cat.id);
      addToast(res.message, 'success');
      fetchCategories();
      if (onCategoriesUpdated) onCategoriesUpdated();
      if (editingId === cat.id) resetForm();
    } catch (err) {
      addToast(err.message || 'Lỗi khi xóa danh mục', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Vui lòng nhập tên danh mục', 'error');
      return;
    }

    try {
      if (editingId) {
        const res = await categoriesApi.update(editingId, formData);
        addToast(res.message, 'success');
      } else {
        const res = await categoriesApi.create(formData);
        addToast(res.message, 'success');
      }
      resetForm();
      fetchCategories();
      if (onCategoriesUpdated) onCategoriesUpdated();
    } catch (err) {
      addToast(err.message || 'Lỗi khi lưu danh mục', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sổ Quản Lý &amp; Thiết Lập Danh Mục Thực Đơn"
      maxWidth="max-w-5xl"
    >
      <div className="font-body text-[#161413] space-y-6">
        
        {/* Subtitle Banner */}
        <div className="border-b-2 border-[#124874] pb-3 flex justify-between items-center bg-[#FAF7F2] p-3 border">
          <div>
            <span className="font-cinzel text-[10px] tracking-widest text-[#6E675F] uppercase font-bold block">
              DANH BỘ PHÂN LOẠI &bull; CRUD CATEGORIES
            </span>
            <p className="font-serif italic text-xs text-gray-700">
              Quản lý toàn bộ các phân loại món đồ uống, phụ liệu và món ăn kèm của quán.
            </p>
          </div>
          <span className="ink-stamp stamp-cerulean text-[10px] font-bold">
            {categories.length} PHÂN LOẠI
          </span>
        </div>

        {/* 2-Column Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Category List (7 Cols) */}
          <div className="lg:col-span-7 bg-white border-2 border-[#124874] shadow-xs overflow-hidden flex flex-col">
            <div className="bg-[#124874] text-white px-4 py-2 text-xs font-cinzel tracking-wider uppercase font-bold flex justify-between items-center">
              <span>DANH SÁCH DANH MỤC HIỆN HÀNH</span>
              <span className="text-[#C59B27] font-mono text-[10px]">THỜI GIAN THỰC</span>
            </div>

            <div className="divide-y divide-[#D8D1C5] max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500 font-serif italic text-xs">
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i> Đang tải dữ liệu danh mục...
                </div>
              ) : categories.length === 0 ? (
                <div className="p-8 text-center text-gray-500 font-serif italic text-xs">
                  Chưa có danh mục nào được khởi tạo.
                </div>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`p-3.5 flex items-center justify-between transition-colors ${
                      editingId === cat.id ? 'bg-amber-50 border-l-4 border-l-[#CF373D]' : 'hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-xs bg-[#FAF7F2] border border-[#124874] text-[#124874] flex items-center justify-center flex-shrink-0 text-sm shadow-2xs">
                        <i className={`fa-solid ${cat.icon || 'fa-mug-hot'}`}></i>
                      </div>

                      <div className="truncate min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-[#124874] truncate">
                            {cat.name}
                          </h4>
                          <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#EDE7DC] border border-[#D8D1C5] text-gray-700 font-bold rounded-2xs flex-shrink-0">
                            {cat.product_count || 0} món
                          </span>
                        </div>
                        {cat.description && (
                          <p className="font-serif italic text-[11px] text-gray-500 truncate mt-0.5">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEdit(cat)}
                        className="press-btn px-2.5 py-1 bg-white text-[#124874] border border-[#124874]/30 hover:bg-[#124874] hover:text-white transition-colors text-xs font-cinzel font-bold"
                        title="Chỉnh sửa danh mục"
                      >
                        <i className="fa-solid fa-pen text-[10px] mr-1"></i> SỬA
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        className={`press-btn px-2.5 py-1 text-xs font-cinzel font-bold transition-colors ${
                          cat.product_count > 0
                            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed opacity-60'
                            : 'bg-white text-[#CF373D] border-[#CF373D] hover:bg-[#CF373D] hover:text-white'
                        }`}
                        title={
                          cat.product_count > 0
                            ? `Đang có ${cat.product_count} món trực thuộc, không thể xóa`
                            : 'Xóa danh mục này'
                        }
                      >
                        <i className="fa-solid fa-trash text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT: Create / Edit Form (5 Cols) */}
          <div className="lg:col-span-5 bg-[#FAF7F2] p-5 border-2 border-[#124874] shadow-xs">
            <div className="border-b border-[#124874] pb-2 mb-4 flex justify-between items-center">
              <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider flex items-center gap-1.5">
                <i className={`fa-solid ${editingId ? 'fa-pen-to-square' : 'fa-plus'} text-[#CF373D]`}></i>
                <span>{editingId ? 'CHỈNH SỬA PHÂN LOẠI' : 'THÊM MỚI PHÂN LOẠI'}</span>
              </span>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="font-serif italic text-xs text-[#CF373D] hover:underline"
                >
                  Hủy sửa (Tạo mới)
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-body">
              <div>
                <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                  Tên Danh Mục *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Trà Ủ Lạnh Cold Brew"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-[#124874] px-3.5 py-2 font-serif text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                />
              </div>

              {/* Icon Picker Grid */}
              <div>
                <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                  Biểu Tượng Vector (FontAwesome) *
                </label>
                <div className="grid grid-cols-4 gap-1.5 p-2 bg-white border border-[#124874]/30 max-h-36 overflow-y-auto">
                  {ICON_PRESETS.map((ic) => {
                    const isSelected = formData.icon === ic.id;
                    return (
                      <button
                        type="button"
                        key={ic.id}
                        onClick={() => setFormData({ ...formData, icon: ic.id })}
                        style={isSelected ? { backgroundColor: '#124874', color: '#ffffff' } : {}}
                        className={`p-2 border text-center transition-all flex flex-col items-center justify-center rounded-2xs ${
                          isSelected
                            ? 'border-[#0D3656] shadow-xs scale-105'
                            : 'bg-[#FCFAF6] text-gray-700 border-[#D8D1C5] hover:border-[#124874] hover:bg-[#FAF7F2]'
                        }`}
                        title={ic.label}
                      >
                        <i className={`fa-solid ${ic.id} text-base mb-1`}></i>
                        <span className="text-[8px] font-cinzel uppercase truncate w-full text-center">
                          {ic.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                  Mô Tả Danh Mục (Tùy chọn)
                </label>
                <textarea
                  rows="2"
                  placeholder="VD: Tuyển tập các dòng trà ủ lạnh 18 tiếng thơm mát..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white border border-[#124874] p-2.5 font-serif text-xs focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                ></textarea>
              </div>

              <button
                type="submit"
                style={{ backgroundColor: '#124874', color: '#ffffff' }}
                className="press-btn w-full py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                <i className={`fa-solid ${editingId ? 'fa-floppy-disk' : 'fa-plus'}`}></i>
                <span>{editingId ? 'CẬP NHẬT DANH MỤC' : 'LƯU DANH MỤC MỚI'}</span>
              </button>
            </form>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-4 border-t-2 border-[#124874]">
          <button
            type="button"
            onClick={onClose}
            className="press-btn px-6 py-2 bg-white text-[#161413] font-cinzel text-xs font-bold hover:bg-[#EDE7DC]"
          >
            ĐÓNG CỬA SỔ
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default CategoryManagerModal;
