import React, { useState } from 'react';
import Modal from '../common/Modal';
import { productsApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const BaristaStockToggleModal = ({ isOpen, onClose, products = [], onProductUpdated }) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const { addToast } = useToast();

  if (!isOpen) return null;

  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  const filtered = products.filter((p) => {
    const matchCat = selectedCat === 'all' || p.category === selectedCat;
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleToggleStatus = async (product) => {
    const newStatus = product.status === 'Hết hàng' ? 'Còn hàng' : 'Hết hàng';
    try {
      setUpdatingId(product.id);
      const res = await productsApi.update(product.id, {
        ...product,
        status: newStatus
      });
      if (res.success) {
        addToast(`Đã chuyển món "${product.name}" sang trạng thái "${newStatus}"`, 'success');
        if (onProductUpdated) onProductUpdated();
      }
    } catch (err) {
      addToast(err.message || 'Lỗi khi cập nhật trạng thái món', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="BÁO HẾT HÀNG TỨC THÌ TẠI QUẦY BAR &bull; STOCK TOGGLE"
    >
      <div className="space-y-4 font-body text-brand-dark max-h-[75vh] overflow-y-auto pr-1">
        
        <p className="font-serif italic text-xs text-gray-600">
          Khi quầy pha chế hết nguyên liệu đột xuất, bấm nút chuyển sang <strong className="text-[#CF373D]">"HẾT HÀNG"</strong> để màn hình Thu Ngân POS và Thực Đơn khách hàng lập tức khóa món này.
        </p>

        {/* Filter & Search */}
        <div className="p-3 bg-[#FAF7F2] border-2 border-[#124874] flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setSelectedCat('all')}
              className={`px-2.5 py-1 font-cinzel text-xs font-bold border transition-all cursor-pointer ${
                selectedCat === 'all'
                  ? 'bg-[#124874] text-white border-[#124874]'
                  : 'bg-white text-[#124874] border-[#D8D1C5] hover:bg-[#FAF7F2]'
              }`}
            >
              TẤT CẢ ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`px-2.5 py-1 font-cinzel text-xs font-bold border transition-all cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-[#124874] text-white border-[#124874]'
                    : 'bg-white text-[#124874] border-[#D8D1C5] hover:bg-[#FAF7F2]'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-56">
            <input
              type="text"
              placeholder="Tìm nhanh món..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#124874] pl-8 pr-3 py-1 font-serif text-xs focus:outline-none focus:ring-1 focus:ring-[#CF373D]"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-2 text-gray-400 text-xs"></i>
          </div>
        </div>

        {/* Products Stock List */}
        <div className="divide-y divide-gray-200 border border-[#124874] bg-white">
          {filtered.map((p) => {
            const isOutOfStock = p.status === 'Hết hàng';
            const isBusy = updatingId === p.id;
            return (
              <div
                key={p.id}
                className="p-3 flex items-center justify-between gap-3 hover:bg-[#FAF7F2] transition-colors"
              >
                {/* Product Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-[#124874] bg-[#FAF7F2] overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <i className="fa-solid fa-mug-hot text-[#124874] text-sm"></i>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="font-serif text-sm text-[#124874]">{p.name}</strong>
                      <span className="font-mono text-[10px] text-gray-500">#{p.id}</span>
                    </div>
                    <p className="font-serif italic text-xs text-gray-500">
                      {p.category} &bull; <strong className="font-mono text-gray-700">{p.price}</strong>
                    </p>
                  </div>
                </div>

                {/* Status Toggle Switch */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-0.5 font-cinzel text-[10px] font-bold border ${
                    isOutOfStock
                      ? 'bg-red-50 text-[#CF373D] border-[#CF373D]'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  }`}>
                    {isOutOfStock ? 'TẠM HẾT HÀNG' : 'ĐANG PHỤC VỤ'}
                  </span>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleToggleStatus(p)}
                    className={`press-btn px-3 py-1.5 font-cinzel text-xs font-bold transition-all cursor-pointer ${
                      isOutOfStock
                        ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                        : 'bg-[#CF373D] text-white hover:bg-red-800'
                    }`}
                  >
                    {isBusy ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : isOutOfStock ? (
                      <span>BẬT CÒN HÀNG</span>
                    ) : (
                      <span>BÁO HẾT HÀNG</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex justify-end pt-3 border-t border-[#124874]">
          <button
            type="button"
            onClick={onClose}
            className="press-btn px-6 py-2 bg-[#124874] text-white font-cinzel text-xs font-bold hover:bg-[#CF373D] cursor-pointer"
          >
            ĐÓNG CỬA SỔ
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default BaristaStockToggleModal;
