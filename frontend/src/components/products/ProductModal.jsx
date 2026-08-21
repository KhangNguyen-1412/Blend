import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import CustomSelect from '../common/CustomSelect';

export const ProductModal = ({ isOpen, onClose, onSave, editingProduct, availableCategories = [] }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'Cà phê',
    price: '',
    variants: '',
    status: 'Còn hàng',
    image: ''
  });

  const IMAGE_PRESETS = [
    {
      name: 'Cà phê Phin Sữa Đá',
      category: 'Cà phê',
      url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Cà phê Muối Béo Ngậy',
      category: 'Cà phê',
      url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Espresso Ristretto',
      category: 'Cà phê',
      url: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Cold Brew Ủ Lạnh',
      category: 'Cà phê',
      url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Trà Sữa Oolong Trân Châu',
      category: 'Trà sữa',
      url: 'https://images.unsplash.com/photo-1558857563-b37cfb95a8e0?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Trà Sen Vàng Macchiato',
      category: 'Trà sữa',
      url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Trà Đào Cam Sả Tươi',
      category: 'Trà trái cây',
      url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Trà Dâu Tây Nhiệt Đới',
      category: 'Trà trái cây',
      url: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Bánh Croissant Bơ Pháp',
      category: 'Bánh ngọt',
      url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Bánh Tiramisu Hoàng Gia',
      category: 'Bánh ngọt',
      url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Dung lượng tệp ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, image: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const categoryOptions = availableCategories.length > 0 
    ? availableCategories.map(c => ({
        value: c.name,
        label: c.name,
        icon: c.icon || 'fa-mug-hot'
      }))
    : [
        { value: 'Cà phê', label: 'Cà phê Rang Xay', icon: 'fa-mug-hot' },
        { value: 'Trà sữa', label: 'Trà Sữa Thủ Công', icon: 'fa-glass-water' },
        { value: 'Trà trái cây', label: 'Trà Trái Cây Tươi', icon: 'fa-lemon' },
        { value: 'Topping', label: 'Topping & Phụ Liệu', icon: 'fa-layer-group' },
        { value: 'Bánh ngọt', label: 'Bánh Ngọt & Điểm Tâm', icon: 'fa-cake-candles' },
      ];

  // Structured Variant State
  const [selectedSizes, setSelectedSizes] = useState(['M', 'L']);
  const [enableSugar, setEnableSugar] = useState(true);
  const [enableIce, setEnableIce] = useState(true);
  const [enableHot, setEnableHot] = useState(true);
  const [selectedToppings, setSelectedToppings] = useState(['Trân châu', 'Macchiato']);
  const [customVariantNote, setCustomVariantNote] = useState('');

  // Available Sizes with clean FontAwesome symbols
  const AVAILABLE_SIZES = [
    { id: 'S', label: 'Size S', desc: 'Nhỏ (350ml)', diff: '0đ' },
    { id: 'M', label: 'Size M', desc: 'Chuẩn (500ml)', diff: '0đ' },
    { id: 'L', label: 'Size L', desc: 'Lớn (700ml)', diff: '+10.000đ' },
    { id: 'XL', label: 'Chai Thủy Tinh', desc: 'Đóng chai (500ml)', diff: '+15.000đ' },
  ];

  const AVAILABLE_TOPPINGS = [
    { id: 'Trân châu', label: 'Trân châu đen (+5k)', icon: 'fa-circle-dot' },
    { id: 'Macchiato', label: 'Macchiato Kem Phô Mai (+10k)', icon: 'fa-cloud' },
    { id: 'Thạch củ năng', label: 'Thạch củ năng (+7k)', icon: 'fa-cube' },
    { id: 'Hạt sen', label: 'Hạt sen Huế (+8k)', icon: 'fa-seedling' },
    { id: 'Sương sáo', label: 'Sương sáo (+5k)', icon: 'fa-gem' },
    { id: 'Espresso', label: 'Shot Espresso (+12k)', icon: 'fa-fire-flame-curved' },
  ];

  // Helper to compile structured state into clean summary string
  const compileVariantString = (sizes, sugar, ice, hot, toppings, note) => {
    const parts = [];
    if (sizes.length > 0) {
      parts.push(`${sizes.length} Size (${sizes.join('/')})`);
    }
    const tempOpts = [];
    if (sugar) tempOpts.push('Đường 0-100%');
    if (ice) tempOpts.push('Đá 0-100%');
    if (hot) tempOpts.push('Uống nóng');
    if (tempOpts.length > 0) {
      parts.push(tempOpts.join(', '));
    }
    if (toppings.length > 0) {
      parts.push(`Topping (${toppings.join(', ')})`);
    }
    if (note && note.trim()) {
      parts.push(note.trim());
    }
    return parts.join(' • ');
  };

  // Sync to formData whenever structured options change
  useEffect(() => {
    const compiled = compileVariantString(
      selectedSizes,
      enableSugar,
      enableIce,
      enableHot,
      selectedToppings,
      customVariantNote
    );
    setFormData((prev) => ({ ...prev, variants: compiled }));
  }, [selectedSizes, enableSugar, enableIce, enableHot, selectedToppings, customVariantNote]);

  // Load existing product or default
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        id: editingProduct.id || '',
        name: editingProduct.name || '',
        category: editingProduct.category || 'Cà phê',
        price: editingProduct.price || '',
        variants: editingProduct.variants || '',
        status: editingProduct.status || 'Còn hàng',
        image: editingProduct.image || ''
      });
      const str = editingProduct.variants || '';
      const hasS = str.includes('S');
      const hasM = str.includes('M') || str.includes('2 Size') || str.includes('3 Size');
      const hasL = str.includes('L') || str.includes('3 Size');
      const hasXL = str.includes('XL') || str.includes('Chai');
      const matchedSizes = [];
      if (hasS) matchedSizes.push('S');
      if (hasM) matchedSizes.push('M');
      if (hasL) matchedSizes.push('L');
      if (hasXL) matchedSizes.push('XL');
      setSelectedSizes(matchedSizes.length > 0 ? matchedSizes : ['M', 'L']);
      setEnableSugar(str.includes('đường') || str.includes('Đường') || str.includes('Chọn'));
      setEnableIce(str.includes('đá') || str.includes('Đá') || str.includes('Chọn'));
      setEnableHot(str.includes('nóng') || str.includes('Nóng'));
    } else {
      setFormData({
        id: '',
        name: '',
        category: 'Cà phê',
        price: '',
        variants: '2 Size (M/L) • Đường 0-100%, Đá 0-100% • Topping (Trân châu, Macchiato)',
        status: 'Còn hàng',
        image: ''
      });
      setSelectedSizes(['M', 'L']);
      setEnableSugar(true);
      setEnableIce(true);
      setEnableHot(true);
      setSelectedToppings(['Trân châu', 'Macchiato']);
      setCustomVariantNote('');
    }
  }, [editingProduct, isOpen]);

  // Quick 1-Click Category Preset Handlers
  const applyPreset = (type) => {
    if (type === 'coffee') {
      setSelectedSizes(['M', 'L']);
      setEnableSugar(true);
      setEnableIce(true);
      setEnableHot(true);
      setSelectedToppings(['Espresso', 'Macchiato']);
      setCustomVariantNote('');
    } else if (type === 'milktea') {
      setSelectedSizes(['S', 'M', 'L']);
      setEnableSugar(true);
      setEnableIce(true);
      setEnableHot(false);
      setSelectedToppings(['Trân châu', 'Thạch củ năng', 'Macchiato']);
      setCustomVariantNote('');
    } else if (type === 'fruit_tea') {
      setSelectedSizes(['M', 'L']);
      setEnableSugar(true);
      setEnableIce(true);
      setEnableHot(false);
      setSelectedToppings(['Thạch củ năng', 'Hạt sen']);
      setCustomVariantNote('');
    } else if (type === 'bakery') {
      setSelectedSizes([]);
      setEnableSugar(false);
      setEnableIce(false);
      setEnableHot(false);
      setSelectedToppings([]);
      setCustomVariantNote('Khẩu phần chuẩn 1 chiếc');
    }
  };

  const toggleSize = (sizeId) => {
    if (selectedSizes.includes(sizeId)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== sizeId));
    } else {
      setSelectedSizes([...selectedSizes, sizeId]);
    }
  };

  const toggleTopping = (topId) => {
    if (selectedToppings.includes(topId)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== topId));
    } else {
      setSelectedToppings([...selectedToppings, topId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProduct ? 'Chỉnh Sửa Món Thực Đơn' : 'Khai Báo Món Mới Vào Thực Đơn'}
      maxWidth="max-w-5xl"
    >
      <form onSubmit={handleSubmit} className="font-body flex flex-col justify-between">
        
        {/* =========================================================================
            LAPTOP HORIZONTAL LANDSCAPE GRID (2 CỘT TẬP TRUNG TẦM NHÌN NGANG)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* CỘT TRÁI (45% / 5 Cols): THÔNG TIN CƠ BẢN CỦA MÓN */}
          <div className="lg:col-span-5 space-y-4 bg-[#FAF7F2] p-4 sm:p-5 border border-[#D8D1C5]">
            <div className="border-b border-[#124874] pb-2 flex items-center justify-between">
              <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider">
                I. THÔNG TIN ĐỊNH DANH MÓN
              </span>
              <span className="ink-stamp stamp-cerulean text-[9px] font-bold">
                MENU ITEM
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {!editingProduct && (
                <div className="sm:col-span-1">
                  <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                    Mã Món
                  </label>
                  <input
                    type="text"
                    placeholder="P07"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full bg-white border border-[#124874] px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                  />
                </div>
              )}

              <div className={editingProduct ? 'sm:col-span-3' : 'sm:col-span-2'}>
                <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                  Tên Món Đồ Uống *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Trà Xanh Macchiato"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-[#124874] px-3 py-2 font-serif text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                />
              </div>
            </div>

            {/* Category CustomSelect with FontAwesome Icons */}
            <div>
              <CustomSelect
                label="Danh Mục Thực Đơn *"
                value={formData.category}
                options={categoryOptions}
                onChange={(cat) => {
                  setFormData({ ...formData, category: cat });
                  if (cat.includes('Cà phê')) applyPreset('coffee');
                  else if (cat.includes('Trà sữa')) applyPreset('milktea');
                  else if (cat.includes('Trà trái cây') || cat.includes('Trái cây')) applyPreset('fruit_tea');
                  else if (cat.includes('Bánh')) applyPreset('bakery');
                }}
              />
            </div>

            {/* Product Image Section */}
            <div className="p-3.5 bg-white border border-[#124874] space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#D8D1C5] pb-2">
                <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider">
                  <i className="fa-solid fa-camera-retro mr-1.5 text-[#CF373D]"></i> Hình Ảnh Món Đồ Uống
                </label>
                {formData.image && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="text-[11px] font-cinzel font-bold text-[#CF373D] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <i className="fa-solid fa-trash-can"></i> Gỡ ảnh
                  </button>
                )}
              </div>

              {/* Preview Box & Upload Action */}
              <div className="flex gap-3 items-start">
                <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-[#124874] bg-[#FAF7F2] relative overflow-hidden flex-shrink-0 flex items-center justify-center shadow-xs">
                  {formData.image ? (
                    <img 
                      src={formData.image} 
                      alt="Ảnh món" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-center p-2 text-gray-400">
                      <i className="fa-solid fa-image text-2xl block mb-1 text-[#124874]/30"></i>
                      <span className="font-cinzel text-[8px] uppercase tracking-wider block font-bold text-[#6E675F]">Chưa có ảnh</span>
                    </div>
                  )}
                  {formData.image && (
                    <span className="absolute bottom-0 inset-x-0 bg-[#124874]/90 text-white font-cinzel text-[7px] text-center py-0.5 uppercase tracking-widest font-bold">
                      ẢNH MÓN
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <label className="press-btn w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#124874] text-[#124874] font-cinzel text-xs font-bold hover:bg-[#124874] hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <i className="fa-solid fa-cloud-arrow-up text-[#CF373D]"></i> TẢI ẢNH TỪ THIẾT BỊ
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageFileChange} 
                    />
                  </label>

                  <input
                    type="url"
                    placeholder="Hoặc dán URL hình ảnh..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-white border border-[#124874] px-2.5 py-1.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#CF373D]"
                  />
                  
                  <p className="font-serif italic text-[10px] text-gray-500 leading-tight">
                    Hỗ trợ PNG, JPG, WebP (&lt;5MB) hoặc đường dẫn ảnh mạng.
                  </p>
                </div>
              </div>

              {/* Quick Image Presets Strip */}
              <div className="pt-2 border-t border-[#D8D1C5]">
                <span className="font-cinzel text-[9px] uppercase tracking-wider text-[#6E675F] block mb-1.5 font-bold">
                  ẢNH MẪU ĐẶC SẢN CÓ SẴN (BẤM ĐỂ CHỌN NHANH):
                </span>
                <div className="grid grid-cols-5 gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: preset.url })}
                      className={`relative group aspect-square border overflow-hidden cursor-pointer transition-all ${
                        formData.image === preset.url
                          ? 'border-[#CF373D] ring-2 ring-[#CF373D]'
                          : 'border-[#124874]/40 hover:border-[#124874]'
                      }`}
                      title={preset.name}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Input */}
            <div>
              <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                Giá Bán Niêm Yết *
              </label>
              <input
                type="text"
                required
                placeholder="VD: 45000 hoặc Từ 45.000đ"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-white border border-[#124874] px-3.5 py-2 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
              />
            </div>

            {/* Status CustomSelect with FontAwesome Icons */}
            <div>
              <CustomSelect
                label="Trạng Thái Phục Vụ"
                value={formData.status}
                options={[
                  { value: 'Còn hàng', label: 'Còn hàng (Phục vụ bình thường)', icon: 'fa-circle-check' },
                  { value: 'Hết hàng', label: 'Hết hàng (Tạm dừng phục vụ)', icon: 'fa-circle-xmark' },
                ]}
                onChange={(status) => setFormData({ ...formData, status })}
              />
            </div>

            {/* Live Result Preview */}
            <div className="pt-2 border-t border-[#D8D1C5]">
              <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#6E675F] block mb-1 font-bold">
                XEM TRƯỚC HÓA ĐƠN &amp; THỰC ĐƠN:
              </span>
              <div className="font-serif italic text-xs text-[#124874] font-bold bg-white p-2.5 border border-[#124874]/40 shadow-2xs leading-relaxed">
                {formData.variants || 'Chưa chọn biến thể nào (Khẩu phần mặc định)'}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (55% / 7 Cols): BỘ THIẾT LẬP BIẾN THỂ PHỤC VỤ */}
          <div className="lg:col-span-7 space-y-4 bg-white p-4 sm:p-5 border-2 border-[#124874] shadow-xs">
            
            {/* Presets Header Strip */}
            <div className="border-b border-[#124874] pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-cinzel text-[10px] tracking-widest text-[#6E675F] uppercase font-bold block">
                  II. CẤU HÌNH BIẾN THỂ &amp; PHỤ LIỆU
                </span>
                <h4 className="font-serif font-bold text-sm text-[#124874]">
                  Tùy Chọn Kích Cỡ, Đường/Đá &amp; Topping
                </h4>
              </div>

              {/* Quick 1-Click Preset Buttons with FontAwesome Icons */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPreset('coffee')}
                  className="px-2 py-1 bg-[#FAF7F2] border border-[#124874]/40 text-[10px] font-cinzel font-bold text-[#124874] hover:bg-[#124874] hover:text-white transition-colors flex items-center gap-1"
                  title="Áp dụng mẫu Cà phê chuẩn"
                >
                  <i className="fa-solid fa-mug-hot text-[9px]"></i> Cà Phê
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('milktea')}
                  className="px-2 py-1 bg-[#FAF7F2] border border-[#124874]/40 text-[10px] font-cinzel font-bold text-[#124874] hover:bg-[#124874] hover:text-white transition-colors flex items-center gap-1"
                  title="Áp dụng mẫu Trà Sữa"
                >
                  <i className="fa-solid fa-glass-water text-[9px]"></i> Trà Sữa
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('fruit_tea')}
                  className="px-2 py-1 bg-[#FAF7F2] border border-[#124874]/40 text-[10px] font-cinzel font-bold text-[#124874] hover:bg-[#124874] hover:text-white transition-colors flex items-center gap-1"
                  title="Áp dụng mẫu Trà Trái Cây"
                >
                  <i className="fa-solid fa-lemon text-[9px]"></i> Trà Trái Cây
                </button>
              </div>
            </div>

            {/* 1. KÍCH CỠ PHỤC VỤ (SIZES) */}
            <div>
              <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-2">
                <i className="fa-solid fa-expand mr-1 text-[#CF373D]"></i> 1. Kích Cỡ Phục Vụ (Sizes):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AVAILABLE_SIZES.map((size) => {
                  const isChecked = selectedSizes.includes(size.id);
                  return (
                    <button
                      type="button"
                      key={size.id}
                      onClick={() => toggleSize(size.id)}
                      style={isChecked ? { backgroundColor: '#124874', color: '#ffffff', borderColor: '#0D3656' } : {}}
                      className={`p-2 border text-left transition-all flex flex-col justify-between ${
                        isChecked
                          ? 'shadow-xs font-bold'
                          : 'bg-[#FAF7F2] text-gray-700 border-[#D8D1C5] hover:border-[#124874]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold font-serif text-xs">{size.label}</span>
                        <i className={`fa-solid ${isChecked ? 'fa-square-check text-[#C59B27]' : 'fa-square text-gray-300'} text-xs`}></i>
                      </div>
                      <span className="text-[9px] font-mono block mt-0.5 opacity-85 truncate">
                        {size.desc} ({size.diff})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. ĐƯỜNG & ĐÁ & NÓNG */}
            <div className="pt-2 border-t border-dashed border-[#D8D1C5]">
              <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-2">
                <i className="fa-solid fa-sliders mr-1 text-[#CF373D]"></i> 2. Tùy Chọn Độ Ngọt &amp; Lượng Đá:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <label className="flex items-center gap-2 p-2 bg-[#FAF7F2] border border-[#D8D1C5] cursor-pointer hover:border-[#124874]">
                  <input
                    type="checkbox"
                    checked={enableSugar}
                    onChange={(e) => setEnableSugar(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#124874]"
                  />
                  <div className="text-[11px]">
                    <span className="font-bold text-[#124874] block">Tùy chỉnh Đường</span>
                    <span className="text-gray-500 text-[9px]">0% &mdash; 100%</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-[#FAF7F2] border border-[#D8D1C5] cursor-pointer hover:border-[#124874]">
                  <input
                    type="checkbox"
                    checked={enableIce}
                    onChange={(e) => setEnableIce(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#124874]"
                  />
                  <div className="text-[11px]">
                    <span className="font-bold text-[#124874] block">Tùy chỉnh Đá</span>
                    <span className="text-gray-500 text-[9px]">Không đá &mdash; 100%</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-[#FAF7F2] border border-[#D8D1C5] cursor-pointer hover:border-[#124874]">
                  <input
                    type="checkbox"
                    checked={enableHot}
                    onChange={(e) => setEnableHot(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#124874]"
                  />
                  <div className="text-[11px]">
                    <span className="font-bold text-[#124874] block">Uống Nóng</span>
                    <span className="text-gray-500 text-[9px]">Pha ly nóng ấm</span>
                  </div>
                </label>
              </div>
            </div>

            {/* 3. TOPPING ĐI KÈM */}
            <div className="pt-2 border-t border-dashed border-[#D8D1C5]">
              <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-2">
                <i className="fa-solid fa-layer-group mr-1 text-[#CF373D]"></i> 3. Topping Có Thể Thêm (Add-ons):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AVAILABLE_TOPPINGS.map((top) => {
                  const isChecked = selectedToppings.includes(top.id);
                  return (
                    <button
                      type="button"
                      key={top.id}
                      onClick={() => toggleTopping(top.id)}
                      style={isChecked ? { backgroundColor: '#CF373D', color: '#ffffff', borderColor: '#AB282D' } : {}}
                      className={`px-2.5 py-1.5 border text-xs font-serif transition-all flex items-center justify-between ${
                        isChecked
                          ? 'shadow-xs font-bold'
                          : 'bg-[#FAF7F2] text-gray-700 border-[#D8D1C5] hover:border-[#CF373D]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <i className={`fa-solid ${top.icon} text-[10px]`}></i>
                        <span className="truncate text-[11px]">{top.label}</span>
                      </div>
                      <i className={`fa-solid ${isChecked ? 'fa-check' : 'fa-plus'} text-[9px]`}></i>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            BOTTOM FIXED ACTION BAR
            ========================================================================= */}
        <div className="flex justify-end gap-3 pt-5 mt-5 border-t-2 border-[#124874]">
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
            {editingProduct ? 'LƯU CHỈNH SỬA' : 'TẠO MÓN MỚI'}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default ProductModal;
