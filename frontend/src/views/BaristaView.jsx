import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ordersApi, productsApi } from '../services/api';
import { firestoreOrders } from '../services/firestoreService';
import BaristaRecipeModal from '../components/barista/BaristaRecipeModal';
import BaristaStockToggleModal from '../components/barista/BaristaStockToggleModal';

export const BaristaView = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Audio Chime State (Web Audio API Bell)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const audioContextRef = useRef(null);
  const prevOrderCountRef = useRef(0);

  // Checked items state per order: { [orderId]: { [itemIdx]: true/false } }
  const [checkedItems, setCheckedItems] = useState({});

  // Modals
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  // Filter / Active View
  const [filterServingType, setFilterServingType] = useState('all');

  // Play Web Audio Chime for incoming order
  const playNewOrderChime = () => {
    if (!isAudioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // 2-tone melodic chime (High bell C6 -> E6)
      const now = ctx.currentTime;

      // Note 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.50, now); // C6
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);

      // Note 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, now + 0.15); // E6
      gain2.gain.setValueAtTime(0.3, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.7);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Fetch initial orders & products
  const fetchOrdersAndProducts = async () => {
    try {
      setLoading(true);
      const [ordRes, prodRes] = await Promise.all([
        ordersApi.getAll(),
        productsApi.getAll()
      ]);
      if (ordRes.success) {
        setOrders(ordRes.data || []);
        prevOrderCountRef.current = (ordRes.data || []).length;
      }
      if (prodRes.success) {
        setProducts(prodRes.data || []);
      }
    } catch (err) {
      addToast(err.message || 'Lỗi đồng bộ sổ pha chế quầy bar', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndProducts();

    // Subscribe to Firestore orders realtime stream
    const unsubscribe = firestoreOrders.subscribe((firestoreList) => {
      if (firestoreList && firestoreList.length > 0) {
        // If new orders arrived, trigger chime
        if (firestoreList.length > prevOrderCountRef.current && prevOrderCountRef.current > 0) {
          playNewOrderChime();
          addToast('🔔 Đơn gọi món mới từ quầy thu ngân đã cập nhật!', 'info');
        }
        prevOrderCountRef.current = firestoreList.length;
        // Merge or refresh
        ordersApi.getAll().then((res) => {
          if (res.success) setOrders(res.data || []);
        }).catch(() => {});
      }
    });

    // Auto-polling interval every 15 seconds
    const interval = setInterval(() => {
      ordersApi.getAll().then((res) => {
        if (res.success) setOrders(res.data || []);
      }).catch(() => {});
    }, 15000);

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Parse items from order object (handles array, JSON string, or fallback)
  const parseOrderItems = (order) => {
    if (Array.isArray(order.items)) return order.items;
    if (typeof order.items === 'string' && order.items.startsWith('[')) {
      try {
        return JSON.parse(order.items);
      } catch {
        // fallback
      }
    }
    // Fallback if order has no structured items
    return [
      {
        name: order.customer ? `Khẩu phần gọi món (${order.customer})` : 'Đồ uống đặc sản Blend',
        quantity: 1,
        modifierSummary: order.notes || 'Quy chuẩn tiêu chuẩn'
      }
    ];
  };

  // Toggle item checkbox
  const handleToggleItemCheck = (orderId, itemIdx) => {
    setCheckedItems((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        [itemIdx]: !prev[orderId]?.[itemIdx]
      }
    }));
  };

  // Advance Order Status
  const handleAdvanceStatus = async (orderId, currentStatus) => {
    try {
      let nextStatus = 'Đang pha chế';
      if (currentStatus === 'Chờ xác nhận' || currentStatus === 'Mới nhận') {
        nextStatus = 'Đang pha chế';
      } else if (currentStatus === 'Đang pha chế') {
        nextStatus = 'Đang giao'; // Sẵn sàng phục vụ
      } else if (currentStatus === 'Đang giao') {
        nextStatus = 'Đã hoàn thành';
      }

      const res = await ordersApi.advanceStatus(orderId);
      addToast(res.message || `Đã chuyển đơn #${orderId} sang "${nextStatus}"`, 'success');
      fetchOrdersAndProducts();
    } catch (err) {
      addToast(err.message || 'Lỗi cập nhật tiến độ pha chế', 'error');
    }
  };

  // Filter orders by serving type
  const activeOrders = orders.filter((o) => {
    if (filterServingType === 'all') return true;
    const notesStr = (o.notes || '') + (o.customer || '') + (o.items || '');
    return notesStr.toLowerCase().includes(filterServingType.toLowerCase());
  });

  // Split into 3 KDS Kanban Columns
  // Column 1: Hàng đợi chờ pha (Chờ xác nhận)
  const queueOrders = activeOrders.filter((o) => o.status === 'Chờ xác nhận' || o.status === 'Mới nhận');

  // Column 2: Đang trên máy pha (Đang pha chế)
  const inProgressOrders = activeOrders.filter((o) => o.status === 'Đang pha chế');

  // Column 3: Sẵn sàng phục vụ & Hoàn tất (Đang giao / Đã hoàn thành gần đây)
  const readyOrders = activeOrders.filter((o) => o.status === 'Đang giao');
  const completedOrders = activeOrders.filter((o) => o.status === 'Đã hoàn thành').slice(0, 4);

  // Total cup count in queue & in progress
  const totalCupsToBrew = [...queueOrders, ...inProgressOrders].reduce((sum, order) => {
    const items = parseOrderItems(order);
    return sum + items.reduce((iSum, item) => iSum + (item.quantity || 1), 0);
  }, 0);

  const baristaName = user?.name || 'Lê Thị Cẩm (Barista Trưởng)';

  return (
    <div className="font-body animate-editorial-in text-brand-dark space-y-4">
      
      {/* -----------------------------------------------------------------------
          BARISTA STATION MASTHEAD & SUMMARY STRIP
          ----------------------------------------------------------------------- */}
      <div className="editorial-paper bg-[#FCFAF6] p-4 sm:p-5 border-2 border-[#124874] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Identity & Shift Overview */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#CF373D] text-white flex items-center justify-center text-xl shadow-xs border-2 border-white">
            <i className="fa-solid fa-mug-hot"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider">
                TRẠM PHA CHẾ &bull; BARISTA KDS
              </span>
              <span className="ink-stamp stamp-jasper text-[8px] font-bold">CA PHA CHẾ TƯƠI</span>
            </div>
            <h2 className="font-serif font-bold text-lg text-brand-dark leading-snug">
              {baristaName} <span className="font-mono text-xs text-[#124874] font-bold">(@{user?.username || 'barista'})</span>
            </h2>
            <p className="font-serif italic text-xs text-gray-600">
              Tổng số ly cần pha trong ca: <strong className="font-mono text-[#CF373D] text-sm font-bold">{totalCupsToBrew} ly</strong> &bull; Đang trên cối: <strong className="font-mono text-[#124874]">{inProgressOrders.length} đơn</strong>
            </p>
          </div>
        </div>

        {/* Action Controls & Sound Chime */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsAudioEnabled(!isAudioEnabled);
              if (!isAudioEnabled) playNewOrderChime();
              addToast(isAudioEnabled ? 'Đã tắt âm báo chuông' : 'Đã bật âm báo chuông đơn mới', 'info');
            }}
            className={`press-btn px-3 py-2 border font-cinzel text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isAudioEnabled
                ? 'bg-white text-emerald-800 border-emerald-600 shadow-2xs'
                : 'bg-gray-100 text-gray-400 border-gray-300'
            }`}
            title={isAudioEnabled ? 'Âm báo đơn mới: ĐANG BẬT' : 'Âm báo đơn mới: ĐANG TẮT'}
          >
            <i className={`fa-solid ${isAudioEnabled ? 'fa-bell text-emerald-600' : 'fa-bell-slash'}`}></i>
            <span>{isAudioEnabled ? 'CHUÔNG BÁO [BẬT]' : 'CHUÔNG [TẮT]'}</span>
          </button>

          {/* Recipe Handbook Modal Button */}
          <button
            type="button"
            onClick={() => setIsRecipeModalOpen(true)}
            className="press-btn px-3.5 py-2 bg-white text-[#124874] border border-[#124874] font-cinzel text-xs font-bold hover:bg-[#FAF7F2] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <i className="fa-solid fa-book-open text-[#CF373D]"></i>
            <span>SỔ TAY CÔNG THỨC</span>
          </button>

          {/* Quick Out of Stock Toggle Button */}
          <button
            type="button"
            onClick={() => setIsStockModalOpen(true)}
            className="press-btn px-3.5 py-2 bg-[#124874] text-white font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <i className="fa-solid fa-boxes-packing text-amber-300"></i>
            <span>BÁO HẾT HÀNG NHANH</span>
          </button>
        </div>

      </div>

      {/* -----------------------------------------------------------------------
          MAIN KDS WORKSPACE: 3-COLUMN KANBAN DISPATCH BOARD
          COLUMN 1 (35%): HÀNG ĐỢI CHỜ PHA (QUEUE)
          COLUMN 2 (35%): ĐANG TRÊN MÁY PHA (BREWING / IN PROGRESS)
          COLUMN 3 (30%): SẴN SÀNG PHỤC VỤ & HOÀN TẤT (READY / CALL WAITER)
          ----------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* =====================================================================
            CỘT 1: HÀNG ĐỢI CHỜ PHA CHẾ (QUEUE / 4 COLS)
            ===================================================================== */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* Column Header */}
          <div className="bg-[#124874] text-white p-3 border-2 border-[#124874] shadow-xs flex justify-between items-center">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-hourglass-start text-amber-300 text-sm"></i>
              <span className="font-cinzel text-xs font-black tracking-wider uppercase">
                I. HÀNG ĐỢI CHỜ PHA ({queueOrders.length})
              </span>
            </div>
            <span className="px-2 py-0.5 bg-white text-[#124874] font-mono text-[10px] font-bold">
              {queueOrders.reduce((s, o) => s + parseOrderItems(o).reduce((is, i) => is + (i.quantity || 1), 0), 0)} ly
            </span>
          </div>

          {/* Queue Tickets List */}
          <div className="space-y-3">
            {queueOrders.length === 0 ? (
              <div className="p-8 bg-white border-2 border-[#124874]/30 text-center text-gray-400 space-y-2">
                <i className="fa-solid fa-circle-check text-3xl text-emerald-600"></i>
                <p className="font-serif italic text-xs text-gray-600 font-bold">
                  Hàng đợi pha chế đang trống.
                </p>
                <p className="font-cinzel text-[10px] text-gray-400">
                  TẤT CẢ ĐƠN ĐÃ ĐƯỢC CHUYỂN VÀO MÁY PHA
                </p>
              </div>
            ) : (
              queueOrders.map((order) => {
                const items = parseOrderItems(order);
                const orderCheckState = checkedItems[order.id] || {};
                return (
                  <div
                    key={order.id}
                    className="editorial-card-press bg-white p-4 border-2 border-[#124874] shadow-sm space-y-3 animate-fade-in"
                  >
                    {/* Ticket Masthead */}
                    <div className="flex justify-between items-start border-b border-[#124874] pb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-sm text-[#CF373D]">
                            #{order.id}
                          </span>
                          <span className="px-2 py-0.5 bg-[#FAF7F2] border border-[#124874] font-cinzel text-[9px] font-bold text-[#124874]">
                            {order.customer}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-500 block mt-0.5">
                          Giờ đặt: {order.time}
                        </span>
                      </div>

                      <span className="ink-stamp stamp-amber text-[8px] font-bold">
                        CHỜ PHA
                      </span>
                    </div>

                    {/* Drink Items Checklist */}
                    <div className="space-y-2.5 divide-y divide-gray-100">
                      {items.map((item, idx) => (
                        <div key={idx} className="pt-2 first:pt-0 flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={Boolean(orderCheckState[idx])}
                            onChange={() => handleToggleItemCheck(order.id, idx)}
                            className="mt-1 w-4 h-4 text-[#124874] border-gray-400 rounded-none focus:ring-0 cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 bg-[#124874] text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                                {item.quantity}x
                              </span>
                              <strong className={`font-serif text-sm leading-tight ${orderCheckState[idx] ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                {item.name}
                              </strong>
                            </div>
                            {item.modifierSummary && (
                              <p className="font-serif italic text-xs text-[#CF373D] font-bold ml-6 mt-0.5 bg-red-50 p-1 border-l-2 border-[#CF373D]">
                                {item.modifierSummary}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* General Order Notes */}
                    {order.notes && (
                      <div className="p-2 bg-amber-50 border border-amber-200 text-[11px] font-serif italic text-amber-900 flex items-start gap-1.5">
                        <i className="fa-solid fa-comment-dots text-amber-700 mt-0.5"></i>
                        <span><strong>Ghi chú:</strong> {order.notes}</span>
                      </div>
                    )}

                    {/* Primary Action Button */}
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus(order.id, order.status)}
                      style={{ backgroundColor: '#124874', color: '#ffffff' }}
                      className="press-btn w-full py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>BẮT ĐẦU PHA CHẾ</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* =====================================================================
            CỘT 2: ĐANG TRÊN MÁY PHA / CỐI RANG (IN PROGRESS / 4 COLS)
            ===================================================================== */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* Column Header */}
          <div className="bg-[#CF373D] text-white p-3 border-2 border-[#CF373D] shadow-xs flex justify-between items-center">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-fire-burner text-amber-300 text-sm fa-bounce"></i>
              <span className="font-cinzel text-xs font-black tracking-wider uppercase">
                II. ĐANG TRÊN MÁY PHA ({inProgressOrders.length})
              </span>
            </div>
            <span className="px-2 py-0.5 bg-white text-[#CF373D] font-mono text-[10px] font-bold">
              {inProgressOrders.reduce((s, o) => s + parseOrderItems(o).reduce((is, i) => is + (i.quantity || 1), 0), 0)} ly
            </span>
          </div>

          {/* In Progress Tickets List */}
          <div className="space-y-3">
            {inProgressOrders.length === 0 ? (
              <div className="p-8 bg-white border-2 border-[#CF373D]/30 text-center text-gray-400 space-y-2">
                <i className="fa-solid fa-mug-saucer text-3xl text-gray-300"></i>
                <p className="font-serif italic text-xs text-gray-600">
                  Hiện chưa có đơn nào đang trong máy pha.
                </p>
                <p className="font-cinzel text-[10px] text-gray-400">
                  BẤM "BẮT ĐẦU PHA CHẾ" Ở CỘT TRÁI ĐỂ NHẬN ĐƠN
                </p>
              </div>
            ) : (
              inProgressOrders.map((order) => {
                const items = parseOrderItems(order);
                const orderCheckState = checkedItems[order.id] || {};
                return (
                  <div
                    key={order.id}
                    className="editorial-card-press bg-white p-4 border-2 border-[#CF373D] shadow-md space-y-3 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-2 h-full bg-[#CF373D]"></div>

                    {/* Ticket Masthead */}
                    <div className="flex justify-between items-start border-b border-[#CF373D] pb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-sm text-[#CF373D]">
                            #{order.id}
                          </span>
                          <span className="px-2 py-0.5 bg-[#124874] text-white font-cinzel text-[9px] font-bold">
                            {order.customer}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-500 block mt-0.5">
                          Nhận đơn lúc: {order.time}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-0.5 border border-amber-300 font-mono text-[10px] font-bold">
                        <i className="fa-solid fa-stopwatch fa-spin text-amber-700"></i>
                        <span>ĐANG PHA</span>
                      </div>
                    </div>

                    {/* Drink Items Checklist */}
                    <div className="space-y-2.5 divide-y divide-gray-100">
                      {items.map((item, idx) => (
                        <div key={idx} className="pt-2 first:pt-0 flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={Boolean(orderCheckState[idx])}
                            onChange={() => handleToggleItemCheck(order.id, idx)}
                            className="mt-1 w-4 h-4 text-[#CF373D] border-gray-400 rounded-none focus:ring-0 cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 bg-[#CF373D] text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                                {item.quantity}x
                              </span>
                              <strong className={`font-serif text-sm leading-tight ${orderCheckState[idx] ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                {item.name}
                              </strong>
                            </div>
                            {item.modifierSummary && (
                              <p className="font-serif italic text-xs text-[#124874] font-bold ml-6 mt-0.5 bg-blue-50 p-1 border-l-2 border-[#124874]">
                                {item.modifierSummary}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* General Order Notes */}
                    {order.notes && (
                      <div className="p-2 bg-amber-50 border border-amber-200 text-[11px] font-serif italic text-amber-900 flex items-start gap-1.5">
                        <i className="fa-solid fa-comment-dots text-amber-700 mt-0.5"></i>
                        <span><strong>Ghi chú:</strong> {order.notes}</span>
                      </div>
                    )}

                    {/* Complete & Call Waiter Action Button */}
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus(order.id, order.status)}
                      style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
                      className="press-btn w-full py-2.5 font-cinzel text-xs font-bold hover:bg-[#124874] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <i className="fa-solid fa-bell-concierge"></i>
                      <span>PHA XONG &bull; BÁO PHỤC VỤ</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* =====================================================================
            CỘT 3: SẴN SÀNG PHỤC VỤ & LỊCH SỬ (READY / 4 COLS)
            ===================================================================== */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* Column Header */}
          <div className="bg-emerald-800 text-white p-3 border-2 border-emerald-800 shadow-xs flex justify-between items-center">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-bell-concierge text-amber-300 text-sm"></i>
              <span className="font-cinzel text-xs font-black tracking-wider uppercase">
                III. SẴN SÀNG PHỤC VỤ ({readyOrders.length})
              </span>
            </div>
            <span className="px-2 py-0.5 bg-white text-emerald-800 font-mono text-[10px] font-bold">
              TRẢ MÓN
            </span>
          </div>

          {/* Ready Orders List */}
          <div className="space-y-3">
            {readyOrders.length === 0 ? (
              <div className="p-6 bg-white border-2 border-emerald-800/30 text-center text-gray-400 space-y-1">
                <i className="fa-solid fa-clipboard-check text-3xl text-emerald-700"></i>
                <p className="font-serif italic text-xs text-gray-600 font-bold">
                  Không có đơn nào đang chờ mang ra bàn.
                </p>
              </div>
            ) : (
              readyOrders.map((order) => {
                const items = parseOrderItems(order);
                return (
                  <div
                    key={order.id}
                    className="editorial-card-press bg-emerald-50/50 p-4 border-2 border-emerald-700 shadow-xs space-y-3"
                  >
                    <div className="flex justify-between items-start border-b border-emerald-700/40 pb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-sm text-emerald-900">
                            #{order.id}
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-800 text-white font-cinzel text-[9px] font-bold">
                            {order.customer}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-500 block mt-0.5">
                          Xong lúc: {order.time}
                        </span>
                      </div>

                      <span className="ink-stamp stamp-green text-[8px] font-bold">
                        ĐÃ XONG
                      </span>
                    </div>

                    {/* Summary of Items */}
                    <div className="space-y-1 text-xs">
                      {items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-gray-800 font-serif">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-mono text-gray-500 text-[10px]">{item.modifierSummary}</span>
                        </div>
                      ))}
                    </div>

                    {/* Finalize Handover Action Button */}
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus(order.id, order.status)}
                      className="press-btn w-full py-2 bg-emerald-800 text-white font-cinzel text-xs font-bold hover:bg-[#124874] transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <i className="fa-solid fa-check-double"></i>
                      <span>ĐÃ TRẢ MÓN / HOÀN TẤT</span>
                    </button>
                  </div>
                );
              })
            )}

            {/* Completed Orders Feed (Last 4) */}
            {completedOrders.length > 0 && (
              <div className="pt-2 border-t-2 border-dashed border-[#124874]/30 space-y-2">
                <span className="font-cinzel text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  CÁC ĐƠN ĐÃ HOÀN TẤT GẦN ĐÂY:
                </span>
                <div className="space-y-1.5">
                  {completedOrders.map((co) => (
                    <div
                      key={co.id}
                      className="p-2 bg-white border border-gray-200 text-xs flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <div>
                        <strong className="font-mono text-[#124874]">#{co.id}</strong>
                        <span className="font-serif text-gray-600 ml-2">{co.customer}</span>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-800 font-bold">
                        HOÀN TẤT &bull; {co.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* -----------------------------------------------------------------------
          POPUP MODALS:
          1. BARISTA RECIPE HANDBOOK MODAL
          2. BARISTA STOCK TOGGLE MODAL
          ----------------------------------------------------------------------- */}
      <BaristaRecipeModal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
      />

      <BaristaStockToggleModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        products={products}
        onProductUpdated={fetchOrdersAndProducts}
      />

    </div>
  );
};

export default BaristaView;
