import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { productsApi, categoriesApi, promotionsApi, customersApi, ordersApi } from '../services/api';
import { firestoreOrders } from '../services/firestoreService';
import ModifierModal from '../components/cashier/ModifierModal';
import ReceiptModal from '../components/cashier/ReceiptModal';
import ShiftSummaryModal from '../components/cashier/ShiftSummaryModal';

export const CashierView = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  // Master Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Cart & Order State
  const [cart, setCart] = useState([]);
  const [servingType, setServingType] = useState('Tại bàn');
  const [tableNumber, setTableNumber] = useState('Bàn 01');
  const [orderNotes, setOrderNotes] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');
  const [cashGiven, setCashGiven] = useState('');

  // Held Orders (Đơn lưu tạm để phục vụ khách khác trước)
  const [heldOrders, setHeldOrders] = useState([]);
  const [isHeldOrdersOpen, setIsHeldOrdersOpen] = useState(false);

  // Shift & Metrics State
  const [shiftStartTime] = useState(() => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
  const [completedShiftOrders, setCompletedShiftOrders] = useState([]);

  // Modals
  const [selectedProductForModifier, setSelectedProductForModifier] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [currentReceiptData, setCurrentReceiptData] = useState(null);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, promoRes, custRes] = await Promise.all([
        productsApi.getAll(),
        categoriesApi.getAll(),
        promotionsApi.getAll(),
        customersApi.getAll(),
      ]);

      if (prodRes.success) setProducts(prodRes.data || []);
      if (catRes.success) setCategories(catRes.data || []);
      if (promoRes.success) setPromotions(promoRes.data || []);
      if (custRes.success) setCustomers(custRes.data || []);
    } catch (err) {
      addToast(err.message || 'Lỗi đồng bộ dữ liệu quầy thu ngân', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchCategory = activeCategory === 'all' || p.category.toLowerCase().includes(activeCategory.toLowerCase());
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.variants && p.variants.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });

  // Handle adding item from ModifierModal
  const handleConfirmModifier = (itemData) => {
    // Check if identical item (same id, size, sugar, ice, toppings) is in cart
    const existingIndex = cart.findIndex(
      (c) =>
        c.productId === itemData.productId &&
        c.size === itemData.size &&
        c.sugar === itemData.sugar &&
        c.ice === itemData.ice &&
        c.modifierSummary === itemData.modifierSummary
    );

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += itemData.quantity;
      updatedCart[existingIndex].total = updatedCart[existingIndex].quantity * updatedCart[existingIndex].unitPrice;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...itemData, cartId: `cart_${Date.now()}_${Math.random()}` }]);
    }

    addToast(`Đã thêm "${itemData.name}" vào phiếu gọi món`, 'info');
  };

  // Quick click on product card
  const handleProductCardClick = (product) => {
    if (product.status === 'Hết hàng') {
      addToast(`Món "${product.name}" hiện đang tạm hết hàng!`, 'warning');
      return;
    }
    setSelectedProductForModifier(product);
  };

  // Quantity changes in cart
  const updateCartItemQuantity = (cartId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0
              ? { ...item, quantity: newQty, total: newQty * item.unitPrice }
              : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeCartItem = (cartId) => {
    setCart(cart.filter((i) => i.cartId !== cartId));
  };

  // Financial Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.total || 0), 0);

  // Customer Loyalty Discount
  let loyaltyDiscountRate = 0;
  if (selectedCustomer?.tier === 'Bạc') loyaltyDiscountRate = 0.05;
  else if (selectedCustomer?.tier === 'Vàng') loyaltyDiscountRate = 0.10;
  else if (selectedCustomer?.tier === 'Kim Cương') loyaltyDiscountRate = 0.15;
  const loyaltyDiscount = Math.round(subtotal * loyaltyDiscountRate);

  // Promo Voucher Discount
  let promoDiscount = 0;
  if (selectedPromo) {
    const rawDisc = selectedPromo.discount || '';
    if (rawDisc.includes('%')) {
      const percent = parseInt(rawDisc.replace(/[^0-9]/g, ''), 10) || 0;
      promoDiscount = Math.round(subtotal * (percent / 100));
    } else {
      promoDiscount = parseInt(rawDisc.replace(/[^0-9]/g, ''), 10) || 0;
    }
  }

  const totalDiscount = loyaltyDiscount + promoDiscount;
  const grandTotal = Math.max(0, subtotal - totalDiscount);

  // Cash Calculation
  const cashGivenNum = cashGiven ? parseInt(String(cashGiven).replace(/[^0-9]/g, ''), 10) || 0 : 0;
  const changeDue = Math.max(0, cashGivenNum - grandTotal);

  // Apply manual promo code
  const handleApplyPromoCode = (e) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    const found = promotions.find(
      (p) => p.code.toUpperCase() === promoCodeInput.trim().toUpperCase() && p.status === 'Đang chạy'
    );
    if (found) {
      setSelectedPromo(found);
      addToast(`Đã áp dụng mã ưu đãi "${found.code}" (${found.discount})!`, 'success');
      setPromoCodeInput('');
    } else {
      addToast(`Mã ưu đãi "${promoCodeInput}" không hợp lệ hoặc đã hết hạn.`, 'error');
    }
  };

  // Hold current order (Lưu tạm đơn)
  const handleHoldOrder = () => {
    if (cart.length === 0) {
      addToast('Giỏ hàng trống, không thể lưu tạm đơn.', 'warning');
      return;
    }
    const newHold = {
      holdId: `HOLD-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      cart,
      servingType,
      tableNumber,
      selectedCustomer,
      selectedPromo,
      orderNotes,
      subtotal,
      grandTotal,
    };
    setHeldOrders([...heldOrders, newHold]);
    resetOrderForm();
    addToast(`Đã lưu tạm đơn ${newHold.holdId} (${newHold.servingType})!`, 'success');
  };

  // Restore held order
  const handleRestoreHoldOrder = (holdItem) => {
    setCart(holdItem.cart);
    setServingType(holdItem.servingType);
    setTableNumber(holdItem.tableNumber);
    setSelectedCustomer(holdItem.selectedCustomer);
    setSelectedPromo(holdItem.selectedPromo);
    setOrderNotes(holdItem.orderNotes);
    setHeldOrders(heldOrders.filter((h) => h.holdId !== holdItem.holdId));
    setIsHeldOrdersOpen(false);
    addToast(`Đã khôi phục đơn ${holdItem.holdId} vào màn hình thanh toán!`, 'info');
  };

  const resetOrderForm = () => {
    setCart([]);
    setOrderNotes('');
    setSelectedCustomer(null);
    setSelectedPromo(null);
    setPaymentMethod('Tiền mặt');
    setCashGiven('');
  };

  // Process & Finalize Order (Thanh toán & In hóa đơn)
  const handleCheckout = async () => {
    if (cart.length === 0) {
      addToast('Vui lòng chọn ít nhất 1 món đồ uống vào phiếu gọi món!', 'warning');
      return;
    }

    if (paymentMethod === 'Tiền mặt' && cashGivenNum > 0 && cashGivenNum < grandTotal) {
      addToast('Tiền khách đưa chưa đủ để thanh toán tổng hóa đơn!', 'error');
      return;
    }

    const orderId = `ORD-${Date.now().toString().slice(-4)}`;
    const customerDisplayName = selectedCustomer 
      ? selectedCustomer.name 
      : servingType === 'Tại bàn' 
      ? `Khách ${tableNumber}` 
      : 'Khách Vãng Lai';

    const orderPayload = {
      id: orderId,
      customer: customerDisplayName,
      customerTier: selectedCustomer?.tier,
      total: `${grandTotal.toLocaleString('vi-VN')}đ`,
      total_num: grandTotal,
      subtotal,
      discount: promoDiscount,
      loyaltyDiscount,
      grandTotal,
      servingType,
      tableNumber: servingType === 'Tại bàn' ? tableNumber : '',
      payment: paymentMethod,
      cashGiven: cashGivenNum || grandTotal,
      changeDue,
      notes: orderNotes,
      status: 'Đang pha chế',
      items: cart,
      cashier: user?.name || 'Thu Ngân',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    try {
      // 1. Create order in SQLite Backend API
      await ordersApi.create(orderPayload);

      // 2. Realtime sync to Cloud Firestore
      await firestoreOrders.create(orderPayload);

      // 3. Record order to current shift metrics
      setCompletedShiftOrders((prev) => [orderPayload, ...prev]);

      // 4. Open broadsheet thermal receipt modal
      setCurrentReceiptData(orderPayload);
      setIsReceiptModalOpen(true);

      addToast(`Thanh toán thành công đơn hàng #${orderId}!`, 'success');
      resetOrderForm();
    } catch (err) {
      addToast(err.message || 'Lỗi khi xử lý thanh toán đơn hàng', 'error');
    }
  };

  const cashierName = user?.name || 'Thu Ngân Ca 1';

  return (
    <div className="font-body animate-editorial-in text-brand-dark space-y-4">
      
      {/* -----------------------------------------------------------------------
          HEADER: BÀN LÀM VIỆC CA THU NGÂN & TRẠM ĐIỀU PHỐI (CASHIER STATION MASTHEAD)
          ----------------------------------------------------------------------- */}
      <div className="editorial-paper bg-[#FCFAF6] p-4 sm:p-5 border-2 border-[#124874] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Left: Station Identity & Live Timer */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#124874] text-white flex items-center justify-center text-xl shadow-xs border-2 border-white">
            <i className="fa-solid fa-cash-register"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider">
                TRẠM THU NGÂN &bull; POS DESK
              </span>
              <span className="ink-stamp stamp-green text-[8px] font-bold">CA HOẠT ĐỘNG</span>
            </div>
            <h2 className="font-serif font-bold text-lg text-brand-dark leading-snug">
              {cashierName} <span className="font-mono text-xs text-[#CF373D] font-bold">(@{user?.username || 'cashier'})</span>
            </h2>
            <p className="font-serif italic text-xs text-gray-500">
              Giờ mở ca: <strong className="font-mono text-gray-800">{shiftStartTime}</strong> &bull; Đã xuất: <strong className="font-mono text-[#124874]">{completedShiftOrders.length} hóa đơn</strong>
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Held Orders Button */}
          <button
            type="button"
            onClick={() => setIsHeldOrdersOpen(!isHeldOrdersOpen)}
            className="press-btn px-3.5 py-2 bg-white text-[#124874] border border-[#124874] font-cinzel text-xs font-bold hover:bg-[#FAF7F2] transition-colors flex items-center gap-1.5 cursor-pointer relative"
          >
            <i className="fa-solid fa-clock-rotate-left text-[#CF373D]"></i>
            <span>ĐƠN TẠM GIỮ</span>
            {heldOrders.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#CF373D] text-white font-mono text-[10px] flex items-center justify-center font-bold">
                {heldOrders.length}
              </span>
            )}
          </button>

          {/* End Shift / Drawer Handover Button */}
          <button
            type="button"
            onClick={() => setIsShiftModalOpen(true)}
            className="press-btn px-4 py-2 bg-[#124874] text-white font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-file-invoice-dollar text-amber-300"></i>
            <span>BÀN GIAO &bull; KẾT CA</span>
          </button>
        </div>
      </div>

      {/* Held Orders Quick Drawer */}
      {isHeldOrdersOpen && (
        <div className="editorial-paper bg-amber-50 p-4 border-2 border-amber-400 space-y-3">
          <div className="flex justify-between items-center border-b border-amber-300 pb-2">
            <span className="font-cinzel text-xs font-bold text-amber-900 uppercase tracking-wider">
              DANH SÁCH ĐƠN HÀNG ĐANG LƯU TẠM ({heldOrders.length})
            </span>
            <button 
              type="button" 
              onClick={() => setIsHeldOrdersOpen(false)}
              className="text-amber-900 hover:text-red-600 text-xs font-bold font-cinzel cursor-pointer"
            >
              ĐÓNG [X]
            </button>
          </div>
          {heldOrders.length === 0 ? (
            <p className="font-serif italic text-xs text-amber-800 text-center py-2">
              Hiện không có đơn hàng nào được lưu tạm.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {heldOrders.map((h) => (
                <div key={h.holdId} className="bg-white p-3 border border-amber-300 shadow-2xs space-y-2">
                  <div className="flex justify-between items-start text-xs">
                    <strong className="text-[#124874] font-mono">{h.holdId}</strong>
                    <span className="font-mono text-gray-500 text-[11px]">{h.time}</span>
                  </div>
                  <p className="font-serif text-xs text-gray-800">
                    {h.servingType} {h.tableNumber ? `(${h.tableNumber})` : ''} &bull; {h.cart.length} món
                  </p>
                  <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                    <span className="font-mono font-bold text-xs text-[#CF373D]">
                      {h.grandTotal.toLocaleString('vi-VN')}đ
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRestoreHoldOrder(h)}
                      className="press-btn px-2.5 py-1 bg-[#124874] text-white font-cinzel text-[10px] font-bold hover:bg-[#CF373D] cursor-pointer"
                    >
                      MỞ LẠI
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* -----------------------------------------------------------------------
          MAIN SPLIT WORKSPACE:
          LEFT (7 Cols): FAST PRODUCT CATALOG & SEARCH
          RIGHT (5 Cols): ORDER CART & INSTANT CHECKOUT PANEL
          ----------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* =====================================================================
            LEFT COLUMN (7 COLS / 58%): FAST MENU CATALOG
            ===================================================================== */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Category Tabs & Search Bar */}
          <div className="editorial-paper bg-white p-4 border-2 border-[#124874] shadow-xs space-y-3">
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm nhanh tên món, mã (VD: Cà phê muối, P01, Trà sen vàng...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#124874] pl-9 pr-4 py-2.5 font-serif text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-gray-400 text-sm"></i>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 text-xs font-mono font-bold cursor-pointer"
                >
                  XÓA
                </button>
              )}
            </div>

            {/* Category Pills Strip */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 font-cinzel text-xs font-bold border transition-all cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-[#124874] text-white border-[#124874] shadow-2xs font-black'
                    : 'bg-white text-[#124874] border-[#D8D1C5] hover:bg-[#FAF7F2]'
                }`}
              >
                <i className="fa-solid fa-list mr-1"></i> TẤT CẢ ({products.length})
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-3 py-1.5 font-cinzel text-xs font-bold border transition-all cursor-pointer ${
                    activeCategory === cat.name
                      ? 'bg-[#124874] text-white border-[#124874] shadow-2xs font-black'
                      : 'bg-white text-[#124874] border-[#D8D1C5] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <i className={`fa-solid ${cat.icon || 'fa-mug-hot'} mr-1 text-[11px]`}></i>
                  {cat.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="text-center p-12 bg-white border-2 border-[#124874] editorial-paper">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-[#124874] mb-2"></i>
              <p className="font-serif italic text-gray-600">Đang đồng bộ thực đơn quầy thu ngân...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center p-12 bg-white border-2 border-[#124874] editorial-paper">
              <i className="fa-regular fa-folder-open text-4xl text-gray-300 mb-2"></i>
              <p className="font-serif text-gray-600">Không tìm thấy món nào phù hợp với từ khóa.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.status === 'Hết hàng';
                return (
                  <div
                    key={product.id}
                    onClick={() => handleProductCardClick(product)}
                    className={`editorial-card-press bg-white border-2 transition-all p-3 flex flex-col justify-between group cursor-pointer shadow-xs ${
                      isOutOfStock
                        ? 'border-gray-300 opacity-60'
                        : 'border-[#124874] hover:border-[#CF373D] hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Product Thumbnail Banner */}
                      <div className="w-full h-24 sm:h-28 bg-[#FAF7F2] border border-[#124874]/30 overflow-hidden relative flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <i className="fa-solid fa-mug-hot text-2xl text-[#124874]/40"></i>
                        )}
                        {isOutOfStock && (
                          <span className="absolute inset-0 bg-gray-900/70 text-white font-cinzel text-[10px] font-bold flex items-center justify-center uppercase tracking-wider">
                            HẾT HÀNG
                          </span>
                        )}
                      </div>

                      {/* Title & Code */}
                      <div>
                        <div className="flex justify-between items-center text-[10px] text-gray-500 font-cinzel mb-0.5">
                          <span className="font-mono text-[#CF373D] font-bold">#{product.id}</span>
                          <span className="truncate max-w-[100px]">{product.category}</span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-[#124874] group-hover:text-[#CF373D] transition-colors leading-tight line-clamp-2">
                          {product.name}
                        </h4>
                      </div>
                    </div>

                    {/* Price & Add Indicator */}
                    <div className="mt-2 pt-2 border-t border-[#D8D1C5] flex items-center justify-between">
                      <span className="font-mono text-sm font-black text-[#124874]">
                        {product.price}
                      </span>
                      <button
                        type="button"
                        disabled={isOutOfStock}
                        className="w-7 h-7 bg-[#FAF7F2] border border-[#124874] text-[#124874] group-hover:bg-[#124874] group-hover:text-white transition-colors flex items-center justify-center text-xs font-bold cursor-pointer"
                        title="Tùy biến & Thêm"
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* =====================================================================
            RIGHT COLUMN (5 COLS / 42%): LIVE CART & FAST CHECKOUT
            ===================================================================== */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="editorial-paper bg-white border-2 border-[#124874] shadow-md p-4 sm:p-5 space-y-4">
            
            {/* Header: Serving Mode & Table Selection */}
            <div className="border-b-2 border-[#124874] pb-3 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider">
                  PHIẾU GỌI MÓN &bull; CURRENT ORDER
                </span>
                <span className="font-mono text-xs font-bold text-[#CF373D]">
                  {cart.length} món
                </span>
              </div>

              {/* Serving Type Selector (Tại bàn / Mang về / Giao hàng) */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'Tại bàn', icon: 'fa-mug-saucer', label: 'TẠI BÀN' },
                  { id: 'Mang về', icon: 'fa-bag-shopping', label: 'MANG VỀ' },
                  { id: 'Giao hàng', icon: 'fa-motorcycle', label: 'GIAO HÀNG' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setServingType(st.id)}
                    className={`py-1.5 px-2 border text-center font-cinzel text-xs font-bold transition-all cursor-pointer ${
                      servingType === st.id
                        ? 'bg-[#124874] text-white border-[#124874] shadow-2xs'
                        : 'bg-[#FAF7F2] text-gray-700 border-[#D8D1C5] hover:bg-white'
                    }`}
                  >
                    <i className={`fa-solid ${st.icon} mr-1 text-[10px]`}></i>
                    <span>{st.label}</span>
                  </button>
                ))}
              </div>

              {/* Table Selector (If Dine-in) */}
              {servingType === 'Tại bàn' && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-cinzel text-xs font-bold text-[#124874] whitespace-nowrap">
                    VỊ TRÍ BÀN:
                  </span>
                  <select
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="flex-1 bg-[#FAF7F2] border border-[#124874] px-2.5 py-1 text-xs font-serif font-bold focus:outline-none focus:ring-1 focus:ring-[#CF373D]"
                  >
                    {Array.from({ length: 16 }, (_, i) => `Bàn ${String(i + 1).padStart(2, '0')}`).map((tbl) => (
                      <option key={tbl} value={tbl}>{tbl} (Khu vực chính)</option>
                    ))}
                    <option value="Sân Vườn">Khu Vực Sân Vườn</option>
                    <option value="Ban Công Tầng 2">Ban Công Tầng 2 (Vintage)</option>
                    <option value="Phòng Đọc Báo">Phòng Đọc Báo In VIP</option>
                  </select>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-200 pr-1 space-y-2">
              {cart.length === 0 ? (
                <div className="py-8 text-center text-gray-400 space-y-1">
                  <i className="fa-solid fa-basket-shopping text-3xl text-gray-300"></i>
                  <p className="font-serif italic text-xs">Chưa có món nào được thêm vào phiếu.</p>
                  <p className="font-cinzel text-[10px] text-gray-400">BẤM MÓN BÊN TRÁI ĐỂ CHỌN</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartId} className="pt-2 first:pt-0 flex items-start justify-between gap-2 text-xs">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <strong className="font-serif text-sm text-[#124874] leading-tight">
                          {item.name}
                        </strong>
                        <span className="font-mono text-[10px] text-[#CF373D] font-bold">
                          {item.unitPrice.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <p className="font-serif italic text-[11px] text-gray-600 mt-0.5">
                        {item.modifierSummary}
                      </p>
                    </div>

                    {/* Quantity Controls & Line Total */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center border border-[#124874] bg-white">
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(item.cartId, -1)}
                          className="w-5 h-5 flex items-center justify-center text-xs font-bold text-[#124874] hover:bg-gray-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono font-bold text-xs">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(item.cartId, 1)}
                          className="w-5 h-5 flex items-center justify-center text-xs font-bold text-[#124874] hover:bg-gray-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono font-bold text-xs text-gray-900 w-16 text-right">
                        {(item.total || 0).toLocaleString('vi-VN')}đ
                      </span>

                      <button
                        type="button"
                        onClick={() => removeCartItem(item.cartId)}
                        className="text-gray-400 hover:text-[#CF373D] cursor-pointer pl-1"
                        title="Xóa món"
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Customer Loyalty & Promo Strip */}
            <div className="pt-3 border-t border-dashed border-[#124874] space-y-2 text-xs">
              
              {/* Member Selection */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-cinzel text-[10px] font-bold text-[#124874] uppercase">
                    <i className="fa-solid fa-id-card mr-1 text-[#CF373D]"></i> HỘI VIÊN TÍCH ĐIỂM
                  </label>
                  {selectedCustomer && (
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(null)}
                      className="text-[10px] text-[#CF373D] hover:underline cursor-pointer"
                    >
                      Bỏ chọn
                    </button>
                  )}
                </div>
                <select
                  value={selectedCustomer ? selectedCustomer.id : ''}
                  onChange={(e) => {
                    const cust = customers.find((c) => String(c.id) === e.target.value);
                    setSelectedCustomer(cust || null);
                  }}
                  className="w-full bg-[#FAF7F2] border border-[#124874] px-2.5 py-1.5 font-serif text-xs focus:outline-none focus:ring-1 focus:ring-[#CF373D]"
                >
                  <option value="">-- Khách vãng lai (Không tích điểm) --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - SĐT: {c.phone} (Hạng {c.tier})
                    </option>
                  ))}
                </select>
              </div>

              {/* Promo Code Input */}
              <div>
                <form onSubmit={handleApplyPromoCode} className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Mã voucher / khuyến mãi..."
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="flex-1 bg-[#FAF7F2] border border-[#124874] px-2.5 py-1 font-mono text-xs uppercase focus:outline-none focus:ring-1 focus:ring-[#CF373D]"
                  />
                  <button
                    type="submit"
                    className="press-btn px-3 py-1 bg-[#124874] text-white font-cinzel text-[10px] font-bold hover:bg-[#CF373D] cursor-pointer"
                  >
                    ÁP DỤNG
                  </button>
                </form>

                {selectedPromo && (
                  <div className="mt-1 flex items-center justify-between bg-red-50 p-1.5 border border-[#CF373D] text-[11px] text-[#CF373D]">
                    <span>
                      <i className="fa-solid fa-tag mr-1"></i> Mã <strong>{selectedPromo.code}</strong> (-{selectedPromo.discount})
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedPromo(null)}
                      className="font-bold underline cursor-pointer"
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>

              {/* Barista Kitchen Note */}
              <div>
                <input
                  type="text"
                  placeholder="Ghi chú toàn đơn cho quầy pha chế..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#124874] px-2.5 py-1 font-serif text-xs focus:outline-none focus:ring-1 focus:ring-[#CF373D]"
                />
              </div>
            </div>

            {/* Financial Summary Box */}
            <div className="pt-3 border-t-2 border-[#124874] space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính ({cart.reduce((s, i) => s + i.quantity, 0)} món):</span>
                <span>{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>

              {loyaltyDiscount > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Hội viên {selectedCustomer?.tier} ({loyaltyDiscountRate * 100}%):</span>
                  <span>-{loyaltyDiscount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}

              {promoDiscount > 0 && (
                <div className="flex justify-between text-[#CF373D] font-bold">
                  <span>Voucher giảm giá:</span>
                  <span>-{promoDiscount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}

              {/* Grand Total */}
              <div className="pt-2 border-t border-[#124874] flex justify-between items-center">
                <span className="font-cinzel text-sm font-black text-[#124874] tracking-wider uppercase">
                  TỔNG THANH TOÁN:
                </span>
                <span className="font-mono text-xl font-black text-[#CF373D]">
                  {grandTotal.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            {/* Payment Methods Selection */}
            <div className="space-y-2 pt-2 border-t border-dashed border-[#124874]">
              <span className="font-cinzel text-[10px] font-bold text-[#124874] uppercase block">
                PHƯƠNG THỨC THANH TOÁN:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'Tiền mặt', label: 'TIỀN MẶT', icon: 'fa-money-bill-wave' },
                  { id: 'Chuyển khoản VietQR', label: 'VIETQR', icon: 'fa-qrcode' },
                  { id: 'Thẻ ngân hàng', label: 'THẺ POS', icon: 'fa-credit-card' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(pm.id);
                      if (pm.id === 'Chuyển khoản VietQR' && grandTotal > 0) {
                        setIsQrModalOpen(true);
                      }
                    }}
                    className={`py-2 px-2 border text-center font-cinzel text-[11px] font-bold transition-all cursor-pointer ${
                      paymentMethod === pm.id
                        ? 'bg-[#124874] text-white border-[#124874] shadow-xs'
                        : 'bg-[#FAF7F2] text-gray-700 border-[#D8D1C5] hover:bg-white'
                    }`}
                  >
                    <i className={`fa-solid ${pm.icon} block text-sm mb-0.5`}></i>
                    <span>{pm.label}</span>
                  </button>
                ))}
              </div>

              {/* Cash Given & Change Due Calculator */}
              {paymentMethod === 'Tiền mặt' && (
                <div className="bg-[#FAF7F2] p-3 border border-[#124874] space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-cinzel font-bold text-[#124874]">TIỀN KHÁCH ĐƯA:</span>
                    <input
                      type="text"
                      placeholder={grandTotal.toLocaleString('vi-VN')}
                      value={cashGiven}
                      onChange={(e) => setCashGiven(e.target.value)}
                      className="w-32 bg-white border border-[#124874] px-2.5 py-1 text-right font-mono font-bold text-sm text-[#124874] focus:outline-none focus:ring-1 focus:ring-[#CF373D]"
                    />
                  </div>

                  {/* Quick Cash Buttons */}
                  <div className="flex flex-wrap gap-1 justify-end">
                    {[
                      { label: 'Đúng số tiền', val: grandTotal },
                      { label: '50k', val: 50000 },
                      { label: '100k', val: 100000 },
                      { label: '200k', val: 200000 },
                      { label: '500k', val: 500000 },
                    ].map((btn, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCashGiven(btn.val.toString())}
                        className="px-2 py-0.5 bg-white border border-[#D8D1C5] font-mono text-[10px] font-bold text-gray-700 hover:border-[#124874] cursor-pointer"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Change Due Highlight */}
                  <div className="pt-1.5 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-cinzel font-bold text-gray-700">TIỀN THỐI LẠI:</span>
                    <span className="font-mono text-sm font-bold text-[#CF373D]">
                      {changeDue.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Master Action Buttons */}
            <div className="space-y-2 pt-2 border-t-2 border-[#124874]">
              {/* Primary Checkout Button */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={cart.length === 0}
                style={{ backgroundColor: cart.length === 0 ? '#94a3b8' : '#CF373D', color: '#ffffff' }}
                className={`press-btn w-full py-3 font-cinzel text-sm font-bold tracking-wider transition-all shadow-md flex items-center justify-center gap-2 ${
                  cart.length === 0 ? 'cursor-not-allowed opacity-60' : 'hover:bg-[#124874] cursor-pointer'
                }`}
              >
                <i className="fa-solid fa-print text-base"></i>
                <span>THANH TOÁN &bull; IN HÓA ĐƠN ({grandTotal.toLocaleString('vi-VN')}đ)</span>
              </button>

              {/* Secondary Buttons: Hold Order & Clear Cart */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleHoldOrder}
                  disabled={cart.length === 0}
                  className="press-btn py-2 bg-white border border-[#124874] text-[#124874] font-cinzel text-xs font-bold hover:bg-[#FAF7F2] transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <i className="fa-solid fa-pause text-amber-600"></i>
                  <span>LƯU TẠM ĐƠN</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (cart.length > 0 && window.confirm('Xác nhận xóa trắng toàn bộ phiếu gọi món?')) {
                      resetOrderForm();
                    }
                  }}
                  disabled={cart.length === 0}
                  className="press-btn py-2 bg-white border border-[#CF373D] text-[#CF373D] font-cinzel text-xs font-bold hover:bg-red-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <i className="fa-solid fa-trash-can"></i>
                  <span>HỦY PHIẾU</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* -----------------------------------------------------------------------
          POPUP MODALS:
          1. MODIFIER MODAL (KÍCH CỠ / ĐƯỜNG / ĐÁ / TOPPING)
          2. RECEIPT MODAL (IN HÓA ĐƠN BÁO IN)
          3. SHIFT SUMMARY MODAL (TỔNG KẾT & BÀN GIAO CA)
          4. VIETQR POPUP (QUÉT MÃ THANH TOÁN NGÂN HÀNG)
          ----------------------------------------------------------------------- */}
      <ModifierModal
        isOpen={Boolean(selectedProductForModifier)}
        onClose={() => setSelectedProductForModifier(null)}
        product={selectedProductForModifier}
        onConfirm={handleConfirmModifier}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        orderData={currentReceiptData}
        cashierName={cashierName}
        onNewOrder={() => {
          setIsReceiptModalOpen(false);
          setCurrentReceiptData(null);
        }}
      />

      <ShiftSummaryModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        cashierUser={user}
        ordersInShift={completedShiftOrders}
        onEndShift={(summary) => {
          addToast(`Đã đóng ca trực và chốt doanh thu ${summary.totalShiftRevenue.toLocaleString('vi-VN')}đ`, 'success');
        }}
      />

      {/* VietQR Dynamic Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white p-6 border-4 border-[#124874] max-w-sm w-full space-y-4 text-center font-body shadow-2xl animate-fade-in">
            <div className="border-b-2 border-[#124874] pb-2">
              <span className="font-cinzel text-xs font-bold text-[#CF373D] uppercase tracking-wider block">
                CHUYỂN KHOẢN NGÂN HÀNG NHANH 24/7
              </span>
              <h3 className="font-display text-xl font-bold text-[#124874]">
                Quét Mã VietQR
              </h3>
            </div>

            {/* Dynamic QR Display */}
            <div className="p-4 bg-[#FAF7F2] border-2 border-dashed border-[#124874] inline-block mx-auto">
              <img
                src={`https://api.vietqr.io/image/970436-1028889999-qr_only.jpg?amount=${grandTotal}&addInfo=BLEND%20${Date.now().toString().slice(-4)}`}
                alt="VietQR Code"
                className="w-48 h-48 object-contain mx-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=300&q=80';
                }}
              />
            </div>

            <div className="space-y-1 text-xs font-mono text-left bg-gray-50 p-3 border border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-500">Ngân hàng:</span>
                <strong className="text-[#124874]">Vietcombank (VCB)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số tài khoản:</span>
                <strong className="text-[#124874]">1028 889 999</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Chủ tài khoản:</span>
                <strong>BLEND ROASTERY SAIGON</strong>
              </div>
              <div className="flex justify-between text-[#CF373D] font-bold text-sm pt-1 border-t border-gray-200">
                <span>Số tiền:</span>
                <span>{grandTotal.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="press-btn px-4 py-2 bg-white text-[#124874] border border-[#124874] font-cinzel text-xs font-bold hover:bg-[#FAF7F2] cursor-pointer"
              >
                ĐÓNG
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsQrModalOpen(false);
                  addToast('Đã ghi nhận thanh toán chuyển khoản VietQR!', 'success');
                }}
                style={{ backgroundColor: '#124874', color: '#ffffff' }}
                className="press-btn px-5 py-2 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors cursor-pointer"
              >
                ĐÃ NHẬN TIỀN
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CashierView;
