import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

export const ModifierModal = ({ isOpen, onClose, product, onConfirm }) => {
  if (!product) return null;

  const basePriceNum = product.price_num || parseInt(String(product.price).replace(/[^0-9]/g, ''), 10) || 0;

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedSugar, setSelectedSugar] = useState('100%');
  const [selectedIce, setSelectedIce] = useState('100% Đá');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [specialNote, setSpecialNote] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Available Sizes
  const SIZES = [
    { id: 'S', label: 'Size S (350ml)', extra: 0 },
    { id: 'M', label: 'Size M (500ml)', extra: 0, default: true },
    { id: 'L', label: 'Size L (700ml)', extra: 10000 },
    { id: 'XL', label: 'Chai Thủy Tinh (500ml)', extra: 15000 },
  ];

  // Available Sugar levels
  const SUGAR_LEVELS = ['0%', '30%', '50%', '70%', '100%'];

  // Available Ice levels
  const ICE_LEVELS = ['0% Đá', '30% Đá', '50% Đá', '100% Đá', 'Uống Nóng (Hot)'];

  // Available Toppings
  const TOPPINGS = [
    { id: 'Trân châu đen', name: 'Trân châu đen dẻo', price: 5000, icon: 'fa-circle-dot' },
    { id: 'Macchiato', name: 'Kem Macchiato phô mai', price: 10000, icon: 'fa-cloud' },
    { id: 'Thạch củ năng', name: 'Thạch củ năng giòn', price: 7000, icon: 'fa-cube' },
    { id: 'Hạt sen Huế', name: 'Hạt sen Huế bùi ngọt', price: 8000, icon: 'fa-seedling' },
    { id: 'Shot Espresso', name: 'Shot Espresso đậm vị', price: 12000, icon: 'fa-fire-flame-curved' },
  ];

  // Reset state when opening a new product
  useEffect(() => {
    if (isOpen) {
      setSelectedSize('M');
      setSelectedSugar('100%');
      setSelectedIce('100% Đá');
      setSelectedToppings([]);
      setSpecialNote('');
      setQuantity(1);
    }
  }, [isOpen, product]);

  const toggleTopping = (topping) => {
    if (selectedToppings.some(t => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  // Calculate Unit Price
  const sizeExtra = SIZES.find(s => s.id === selectedSize)?.extra || 0;
  const toppingExtra = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const unitPrice = basePriceNum + sizeExtra + toppingExtra;
  const itemTotal = unitPrice * quantity;

  const handleAdd = () => {
    // Generate readable modifiers string
    const modifierParts = [];
    if (selectedSize) modifierParts.push(`Size ${selectedSize}`);
    if (selectedSugar !== '100%') modifierParts.push(`Đường ${selectedSugar}`);
    if (selectedIce !== '100% Đá') modifierParts.push(selectedIce);
    if (selectedToppings.length > 0) {
      modifierParts.push(`+${selectedToppings.map(t => t.id).join(', ')}`);
    }
    if (specialNote.trim()) {
      modifierParts.push(`(${specialNote.trim()})`);
    }

    const modifierSummary = modifierParts.join(' • ');

    onConfirm({
      productId: product.id,
      name: product.name,
      category: product.category,
      image: product.image,
      size: selectedSize,
      sugar: selectedSugar,
      ice: selectedIce,
      toppings: selectedToppings,
      note: specialNote.trim(),
      modifierSummary: modifierSummary || 'Tiêu chuẩn',
      unitPrice,
      quantity,
      total: itemTotal,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Tùy Biến Pha Chế: ${product.name}`}
    >
      <div className="space-y-5 font-body text-brand-dark">
        {/* Product Brief Banner */}
        <div className="flex items-center gap-3.5 p-3 bg-[#FAF7F2] border-2 border-[#124874] shadow-xs">
          <div className="w-14 h-14 border border-[#124874] bg-white overflow-hidden flex-shrink-0 flex items-center justify-center">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <i className="fa-solid fa-mug-hot text-[#124874] text-xl"></i>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-[#124874] text-white font-cinzel text-[9px] font-bold">
                #{product.id}
              </span>
              <span className="font-cinzel text-[10px] text-gray-500 font-bold uppercase">
                {product.category}
              </span>
            </div>
            <h4 className="font-serif font-bold text-base text-[#124874] leading-tight">
              {product.name}
            </h4>
            <p className="font-mono text-xs font-bold text-[#CF373D]">
              Giá cơ bản: {basePriceNum.toLocaleString('vi-VN')}đ
            </p>
          </div>
        </div>

        {/* 1. Size Selection */}
        <div>
          <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-2">
            1. Chọn Kích Cỡ (Size)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SIZES.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => setSelectedSize(size.id)}
                className={`p-2.5 border text-left transition-all cursor-pointer ${
                  selectedSize === size.id
                    ? 'border-[#124874] bg-[#124874] text-white shadow-xs font-bold'
                    : 'border-[#D8D1C5] bg-white hover:bg-[#FAF7F2] text-gray-800'
                }`}
              >
                <span className="font-cinzel text-xs block font-bold">{size.label}</span>
                <span className="font-mono text-[10px] block opacity-80 mt-0.5">
                  {size.extra > 0 ? `+${size.extra.toLocaleString('vi-VN')}đ` : '+0đ'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Sugar & Ice Levels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sugar */}
          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              2. Mức Đường
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SUGAR_LEVELS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSugar(s)}
                  className={`px-2.5 py-1.5 font-mono text-xs font-bold border transition-all cursor-pointer ${
                    selectedSugar === s
                      ? 'bg-[#CF373D] text-white border-[#CF373D]'
                      : 'bg-white text-gray-700 border-[#D8D1C5] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Ice */}
          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
              3. Mức Đá & Nhiệt Độ
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ICE_LEVELS.map((ice) => (
                <button
                  key={ice}
                  type="button"
                  onClick={() => setSelectedIce(ice)}
                  className={`px-2.5 py-1.5 font-cinzel text-xs font-bold border transition-all cursor-pointer ${
                    selectedIce === ice
                      ? 'bg-[#124874] text-white border-[#124874]'
                      : 'bg-white text-gray-700 border-[#D8D1C5] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {ice}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Toppings */}
        <div>
          <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-2">
            4. Thêm Topping Phụ Liệu (Tùy chọn)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TOPPINGS.map((top) => {
              const isSelected = selectedToppings.some(t => t.id === top.id);
              return (
                <button
                  key={top.id}
                  type="button"
                  onClick={() => toggleTopping(top)}
                  className={`p-2 border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#CF373D] bg-red-50/70 text-[#CF373D] font-bold'
                      : 'border-[#D8D1C5] bg-white hover:bg-[#FAF7F2] text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <i className={`fa-solid ${top.icon} text-xs ${isSelected ? 'text-[#CF373D]' : 'text-gray-400'}`}></i>
                    <span className="font-serif text-xs">{top.name}</span>
                  </div>
                  <span className="font-mono text-xs font-bold">
                    +{top.price.toLocaleString('vi-VN')}đ
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Special Note */}
        <div>
          <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
            Ghi Chú Riêng Cho Quầy Pha Chế
          </label>
          <input
            type="text"
            placeholder="VD: Không lấy sữa đặc, nhiều đá riêng, bọc mang về..."
            value={specialNote}
            onChange={(e) => setSpecialNote(e.target.value)}
            className="w-full bg-white border border-[#124874] px-3 py-2 font-serif text-xs focus:outline-none focus:ring-1 focus:ring-[#CF373D]"
          />
        </div>

        {/* Bottom Strip: Quantity & Action Button */}
        <div className="pt-4 border-t-2 border-[#124874] flex flex-wrap items-center justify-between gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-xs font-bold text-[#124874] uppercase">Số Lượng:</span>
            <div className="flex items-center border border-[#124874] bg-white">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[#124874] hover:bg-gray-100 cursor-pointer"
              >
                -
              </button>
              <span className="w-10 text-center font-mono font-bold text-sm text-[#124874]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[#124874] hover:bg-gray-100 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Total Button */}
          <button
            type="button"
            onClick={handleAdd}
            style={{ backgroundColor: '#124874', color: '#ffffff' }}
            className="press-btn px-6 py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-cart-plus"></i>
            <span>THÊM VÀO ĐƠN &bull; {itemTotal.toLocaleString('vi-VN')}đ</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModifierModal;
