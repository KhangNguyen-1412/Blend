import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';

export const ProductDetailModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onNavigateToBooking 
}) => {
  const [selectedSugar, setSelectedSugar] = useState('50%');
  const [selectedIce, setSelectedIce] = useState('100%');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const { addToast } = useToast();

  if (!isOpen || !product) return null;

  const TOPPING_OPTIONS = [
    { name: 'Kem Phô Mai Macchiato Béo Mặn', price: 10000 },
    { name: 'Trân Châu Đen Thủ Công Đường Nâu', price: 5000 },
    { name: 'Thạch Củ Năng Giòn Tươi', price: 7000 },
    { name: 'Hạt Sen Tươi Hầm Đường Phèn', price: 8000 },
  ];

  // Base price parse
  const basePriceNum = parseInt(product.price.replace(/\D/g, ''), 10) || 45000;
  const toppingTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const totalPrice = basePriceNum + toppingTotal;

  const toggleTopping = (topping) => {
    if (selectedToppings.some((t) => t.name === topping.name)) {
      setSelectedToppings(selectedToppings.filter((t) => t.name !== topping.name));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleBookmark = () => {
    addToast(`Đã ghi nhớ "${product.name}" vào sổ tay thưởng thức của bạn!`, 'success');
  };

  const handleBookTableWithProduct = () => {
    onClose();
    if (onNavigateToBooking) {
      onNavigateToBooking(product.name);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`HỒ SƠ TUYỂN PHẨM: #${product.id} &bull; ${product.name.toUpperCase()}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6 font-body text-[#161413]">
        
        {/* =========================================================================
            MASTHEAD TOP HEADER: NAME, ORIGIN & BADGES
            ========================================================================= */}
        <div className="border-b-2 border-[#124874] pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xs font-bold text-[#CF373D] uppercase tracking-wider">
                {product.categoryLabel}
              </span>
              <span className="text-[#D8D1C5]">&bull;</span>
              <span className="font-mono text-xs text-[#124874] font-bold">MÃ TUYỂN PHẨM: #{product.id}</span>
              <span className="ink-stamp stamp-jasper text-[8px] font-bold ml-1">{product.tag}</span>
            </div>
            
            <h2 className="font-display text-2xl sm:text-3xl font-black text-[#124874] tracking-tight">
              {product.name}
            </h2>

            <div className="flex items-center gap-1.5 text-xs font-serif text-[#6E675F]">
              <i className="fa-solid fa-location-dot text-[#CF373D]"></i>
              <span className="font-semibold text-[#161413]">{product.origin}</span>
            </div>
          </div>

          {/* Pricing Highlight Box */}
          <div className="bg-[#FAF7F2] p-3 sm:p-4 border-2 border-[#124874] text-right flex-shrink-0 shadow-[3px_3px_0px_rgba(18,72,116,0.95)]">
            <span className="font-cinzel text-[10px] text-[#6E675F] uppercase font-bold block">
              GIÁ NIÊM YẾT
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-black text-[#124874] block">
              {product.price}
            </span>
            <span className="font-serif italic text-[10px] text-gray-500 block mt-0.5">
              Đã bao gồm thuế &amp; phục vụ tại quầy
            </span>
          </div>
        </div>

        {/* =========================================================================
            MAIN 2-COLUMN BROADSHEET BODY
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN (7 Cols): The Story, Terroir & Tasting Profile */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Story Box */}
            <div className="bg-white p-5 border-2 border-[#124874] shadow-xs space-y-3">
              <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider block border-b border-[#D8D1C5] pb-1.5">
                I. HÀNH TRÌNH SÁNG TẠO &amp; NGUYÊN BẢN HƯƠNG VỊ
              </span>
              
              <p className="font-serif text-sm text-gray-800 leading-relaxed text-justify">
                <span className="float-left text-4xl font-display font-black text-[#124874] leading-none pr-2 pt-0.5">
                  {product.name.charAt(0)}
                </span>
                {product.desc}
              </p>

              {/* Tasting Notes Tags */}
              <div className="pt-2 border-t border-[#D8D1C5]">
                <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#6E675F] font-bold block mb-1.5">
                  CÁC TẦNG HƯƠNG CẢM QUAN (SENSORY NOTES):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.tastingNotes.map((note, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 bg-[#FCFAF6] border border-[#124874] text-[#124874] font-serif text-xs font-bold shadow-2xs"
                    >
                      &bull; {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Brewing Secrets Box */}
            <div className="bg-[#FAF7F2] p-5 border border-[#124874] space-y-3">
              <span className="font-cinzel text-xs font-bold text-[#CF373D] uppercase tracking-wider block border-b border-[#D8D1C5] pb-1.5">
                II. CHUẨN MỰC PHA CHẾ CỦA BARISTA
              </span>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-serif">
                <div className="bg-white p-2.5 border border-[#D8D1C5]">
                  <span className="font-cinzel text-[9px] font-bold text-[#124874] uppercase block">NHIỆT ĐỘ PHA</span>
                  <strong className="font-mono text-sm text-[#161413]">88°C - 92°C</strong>
                </div>
                <div className="bg-white p-2.5 border border-[#D8D1C5]">
                  <span className="font-cinzel text-[9px] font-bold text-[#124874] uppercase block">THỜI GIAN CHIẾT</span>
                  <strong className="font-mono text-sm text-[#161413]">12 - 18 Tiếng</strong>
                </div>
                <div className="bg-white p-2.5 border border-[#D8D1C5]">
                  <span className="font-cinzel text-[9px] font-bold text-[#124874] uppercase block">TỶ LỆ VÀNG</span>
                  <strong className="font-mono text-sm text-[#161413]">1 : 12 Mộc</strong>
                </div>
              </div>

              {/* Recommended Food Pairing */}
              <div className="p-3 bg-white border border-[#D8D1C5] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xs bg-[#124874] text-white flex items-center justify-center text-xs flex-shrink-0">
                  <i className="fa-solid fa-cookie-bite"></i>
                </div>
                <div>
                  <span className="font-cinzel text-[9px] text-[#6E675F] uppercase font-bold block">GỢI Ý KẾT HỢP DÙNG KÈM:</span>
                  <span className="font-serif text-xs font-bold text-[#124874]">Bánh Croissant Bơ Pháp hoặc Tiramisu Cà Phê Muối</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (5 Cols): Interactive Customization Barista & Ordering */}
          <div className="lg:col-span-5 space-y-5">
            
            <div className="bg-white p-5 border-2 border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.95)] space-y-4">
              <div className="border-b border-[#124874] pb-2 flex justify-between items-center">
                <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider">
                  III. TÙY BIẾN KHẨU VỊ TẠI QUẦY
                </span>
                <i className="fa-solid fa-sliders text-[#CF373D] text-xs"></i>
              </div>

              {/* 1. Sugar Level */}
              <div>
                <label className="block font-cinzel text-[11px] font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                  Mức Đường Mía Tự Nhiên:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['0%', '30%', '50%', '100%'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedSugar(lvl)}
                      style={selectedSugar === lvl ? { backgroundColor: '#124874', color: '#ffffff' } : {}}
                      className={`py-1.5 font-mono text-xs font-bold border transition-colors cursor-pointer ${
                        selectedSugar === lvl
                          ? 'border-[#124874]'
                          : 'bg-[#FAF7F2] text-[#161413] border-[#D8D1C5] hover:border-[#124874]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Ice Level */}
              <div>
                <label className="block font-cinzel text-[11px] font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                  Độ Lạnh &amp; Lượng Đá:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Không đá', '50% đá', '100% đá'].map((ice) => (
                    <button
                      key={ice}
                      type="button"
                      onClick={() => setSelectedIce(ice)}
                      style={selectedIce === ice ? { backgroundColor: '#124874', color: '#ffffff' } : {}}
                      className={`py-1.5 font-cinzel text-[10px] font-bold border transition-colors cursor-pointer ${
                        selectedIce === ice
                          ? 'border-[#124874]'
                          : 'bg-[#FAF7F2] text-[#161413] border-[#D8D1C5] hover:border-[#124874]'
                      }`}
                    >
                      {ice}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Extra Toppings */}
              <div>
                <label className="block font-cinzel text-[11px] font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                  Topping Làm Tươi Phối Thêm:
                </label>
                <div className="space-y-1.5">
                  {TOPPING_OPTIONS.map((top) => {
                    const isChecked = selectedToppings.some((t) => t.name === top.name);
                    return (
                      <div
                        key={top.name}
                        onClick={() => toggleTopping(top)}
                        className={`p-2 border text-xs font-serif flex items-center justify-between cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-[#FCFAF6] border-[#124874] font-bold'
                            : 'bg-white border-[#D8D1C5] text-gray-700 hover:border-[#124874]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="accent-[#124874] cursor-pointer"
                          />
                          <span>{top.name}</span>
                        </div>
                        <span className="font-mono text-[#CF373D] font-bold">
                          +{top.price.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Order Summary */}
              <div className="pt-3 border-t-2 border-[#124874] bg-[#FAF7F2] p-3 flex justify-between items-center">
                <div>
                  <span className="font-cinzel text-[9px] text-[#6E675F] uppercase font-bold block">
                    TỔNG TÍNH THƯỞNG THỨC:
                  </span>
                  <span className="font-serif text-[11px] text-gray-600">
                    Đường {selectedSugar} &bull; {selectedIce}
                  </span>
                </div>
                <span className="font-mono text-xl font-black text-[#CF373D]">
                  {totalPrice.toLocaleString('vi-VN')}đ
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* =========================================================================
            ACTION FOOTER: BOOK TABLE OR BOOKMARK
            ========================================================================= */}
        <div className="pt-5 border-t-2 border-[#124874] flex flex-col sm:flex-row justify-between items-center gap-3">
          
          <button
            type="button"
            onClick={onClose}
            className="press-btn w-full sm:w-auto px-5 py-2.5 border border-[#124874] text-[#124874] font-cinzel text-xs font-bold hover:bg-gray-100 transition-colors"
          >
            &larr; QUAY LẠI THỰC ĐƠN
          </button>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleBookmark}
              className="press-btn flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-[#124874] text-[#124874] font-cinzel text-xs font-bold hover:bg-[#124874] hover:text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <i className="fa-solid fa-heart text-[#CF373D]"></i>
              <span>LƯU YÊU THÍCH</span>
            </button>

            <button
              type="button"
              onClick={handleBookTableWithProduct}
              style={{ backgroundColor: '#124874', color: '#ffffff' }}
              className="press-btn flex-1 sm:flex-initial px-6 py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-calendar-check"></i>
              <span>ĐẶT CHỖ THƯỞNG THỨC NGAY</span>
            </button>
          </div>

        </div>

      </div>
    </Modal>
  );
};

export default ProductDetailModal;
