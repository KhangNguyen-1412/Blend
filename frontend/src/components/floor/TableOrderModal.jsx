import React, { useState } from 'react';
import Modal from '../common/Modal';
import { ordersApi } from '../../services/api';
import { firestoreOrders } from '../../services/firestoreService';
import { useToast } from '../../context/ToastContext';

export const TableOrderModal = ({ isOpen, onClose, table, products = [], onOrderCreated, staffName }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  if (!isOpen || !table) return null;

  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product) => {
    if (product.status === 'Hết hàng') {
      addToast(`Món "${product.name}" hiện đang tạm hết hàng!`, 'warning');
      return;
    }
    const priceNum = product.price_num || parseInt(String(product.price).replace(/[^0-9]/g, ''), 10) || 0;
    const existing = cart.find((i) => i.productId === product.id);
    if (existing) {
      setCart(cart.map((i) => (i.productId === product.id ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.unitPrice } : i)));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
        unitPrice: priceNum,
        quantity: 1,
        modifierSummary: 'Tiêu chuẩn',
        total: priceNum
      }]);
    }
    addToast(`Đã thêm "${product.name}" vào bàn ${table.name}`, 'info');
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev =>
      prev
        .map(i => {
          if (i.productId === productId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty, total: newQty * i.unitPrice } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  const totalAmount = cart.reduce((sum, i) => sum + (i.total || 0), 0);

  const handleSubmitTableOrder = async () => {
    if (cart.length === 0) {
      addToast('Vui lòng chọn ít nhất 1 món cho bàn!', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const orderId = `ORD-${Date.now().toString().slice(-4)}`;
      const orderPayload = {
        id: orderId,
        customer: `${table.name}`,
        total: `${totalAmount.toLocaleString('vi-VN')}đ`,
        total_num: totalAmount,
        subtotal: totalAmount,
        discount: 0,
        grandTotal: totalAmount,
        servingType: 'Tại bàn',
        tableNumber: table.name,
        payment: 'Chưa thanh toán (Tại bàn)',
        notes: orderNotes ? `Khách: ${guestCount} người • ${orderNotes}` : `Khách: ${guestCount} người`,
        status: 'Chờ xác nhận',
        items: cart,
        cashier: staffName || 'Nhân viên phục vụ',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      await ordersApi.create(orderPayload);
      await firestoreOrders.create(orderPayload);

      addToast(`Đã gửi phiếu gọi món #${orderId} cho ${table.name} xuống quầy pha chế!`, 'success');
      if (onOrderCreated) onOrderCreated(orderPayload);
      onClose();
    } catch (err) {
      addToast(err.message || 'Lỗi khi gửi order cho bàn', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`GỌI MÓN TẠI BÀN &bull; ${table.name.toUpperCase()} (${table.zone})`}
    >
      <div className="space-y-4 font-body text-brand-dark max-h-[78vh] overflow-y-auto pr-1">
        
        {/* Table Identity Banner */}
        <div className="p-3 bg-[#FAF7F2] border-2 border-[#124874] flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#124874] text-white flex items-center justify-center font-display font-bold text-sm">
              {table.id}
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#124874] leading-tight">
                {table.name}
              </h4>
              <p className="font-serif italic text-xs text-gray-600">
                Khu vực: <strong>{table.zone}</strong> &bull; Sức chứa: {table.capacity || 4} chỗ ngồi
              </p>
            </div>
          </div>

          {/* Guest Count Selector */}
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-xs font-bold text-[#124874] uppercase">Số khách:</span>
            <div className="flex items-center border border-[#124874] bg-white">
              <button
                type="button"
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                className="w-7 h-7 flex items-center justify-center text-xs font-bold text-[#124874] hover:bg-gray-100 cursor-pointer"
              >
                -
              </button>
              <span className="w-8 text-center font-mono font-bold text-xs text-[#124874]">
                {guestCount}
              </span>
              <button
                type="button"
                onClick={() => setGuestCount(guestCount + 1)}
                className="w-7 h-7 flex items-center justify-center text-xs font-bold text-[#124874] hover:bg-gray-100 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Split Grid: Products Selection (Left) vs Table Cart (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          
          {/* Left: Product Selector (7 cols) */}
          <div className="md:col-span-7 space-y-3">
            
            {/* Search & Category Pills */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm món gọi cho khách..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#124874] pl-8 pr-3 py-1.5 font-serif text-xs focus:outline-none focus:ring-1 focus:ring-[#CF373D]"
                />
                <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-2 text-gray-400 text-xs"></i>
              </div>

              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-2.5 py-1 font-cinzel text-[11px] font-bold border transition-all cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-[#124874] text-white border-[#124874]'
                      : 'bg-white text-[#124874] border-[#D8D1C5]'
                  }`}
                >
                  TẤT CẢ ({products.length})
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedCategory(c)}
                    className={`px-2.5 py-1 font-cinzel text-[11px] font-bold border transition-all cursor-pointer ${
                      selectedCategory === c
                        ? 'bg-[#124874] text-white border-[#124874]'
                        : 'bg-white text-[#124874] border-[#D8D1C5]'
                    }`}
                  >
                    {c.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Compact Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.status === 'Hết hàng';
                return (
                  <div
                    key={p.id}
                    onClick={() => addToCart(p)}
                    className={`p-2.5 bg-white border border-[#124874] hover:border-[#CF373D] transition-all cursor-pointer flex flex-col justify-between shadow-2xs ${
                      isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-[10px] text-[#CF373D] font-bold block">#{p.id}</span>
                      <h5 className="font-serif font-bold text-xs text-[#124874] leading-tight line-clamp-1">{p.name}</h5>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-gray-100">
                      <span className="font-mono font-bold text-xs text-gray-900">{p.price}</span>
                      <span className="w-5 h-5 bg-[#FAF7F2] border border-[#124874] text-[#124874] flex items-center justify-center text-[10px] font-bold">
                        +
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right: Table Cart (5 cols) */}
          <div className="md:col-span-5 bg-[#FCFAF6] p-3.5 border-2 border-[#124874] space-y-3 shadow-xs">
            <span className="font-cinzel text-xs font-bold text-[#124874] uppercase block border-b border-[#124874] pb-1.5">
              PHIẾU GỌI MÓN BÀN ({cart.length} món)
            </span>

            <div className="max-h-48 overflow-y-auto divide-y divide-gray-200 text-xs space-y-1.5 pr-1">
              {cart.length === 0 ? (
                <p className="font-serif italic text-xs text-gray-400 text-center py-6">
                  Chưa chọn món nào cho bàn.
                </p>
              ) : (
                cart.map((item) => (
                  <div key={item.productId} className="pt-1.5 first:pt-0 flex items-center justify-between gap-2">
                    <div className="flex-1 truncate">
                      <strong className="font-serif text-gray-900 block truncate">{item.name}</strong>
                      <span className="font-mono text-[10px] text-[#CF373D]">{item.unitPrice.toLocaleString('vi-VN')}đ</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, -1)}
                        className="w-4 h-4 bg-white border border-[#124874] text-[#124874] flex items-center justify-center font-bold text-[10px] cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-mono font-bold text-xs">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, 1)}
                        className="w-4 h-4 bg-white border border-[#124874] text-[#124874] flex items-center justify-center font-bold text-[10px] cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono font-bold text-xs text-right w-14">
                      {item.total.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Note input */}
            <div className="pt-2 border-t border-dashed border-[#124874]">
              <input
                type="text"
                placeholder="Ghi chú thêm cho quầy bar..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full bg-white border border-[#124874] px-2 py-1 text-xs font-serif focus:outline-none focus:ring-1 focus:ring-[#CF373D]"
              />
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-[#124874] flex justify-between items-center text-xs font-mono">
              <span className="font-cinzel font-bold text-[#124874]">TỔNG TẠM TÍNH:</span>
              <strong className="font-mono text-sm text-[#CF373D]">{totalAmount.toLocaleString('vi-VN')}đ</strong>
            </div>

            {/* Dispatch Order Button */}
            <button
              type="button"
              disabled={cart.length === 0 || submitting}
              onClick={handleSubmitTableOrder}
              style={{ backgroundColor: cart.length === 0 ? '#94a3b8' : '#CF373D', color: '#ffffff' }}
              className="press-btn w-full py-2.5 font-cinzel text-xs font-bold hover:bg-[#124874] transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i>
                  <span>GỬI ORDER XUỐNG QUẦY BAR</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </Modal>
  );
};

export default TableOrderModal;
