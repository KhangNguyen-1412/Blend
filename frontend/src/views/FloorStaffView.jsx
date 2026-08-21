import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ordersApi, productsApi, reservationsApi } from '../services/api';
import { firestoreOrders, firestoreReservations } from '../services/firestoreService';
import TableOrderModal from '../components/floor/TableOrderModal';
import TableTransferModal from '../components/floor/TableTransferModal';

// Initial 18 tables across 4 zones of Blend Roastery
const INITIAL_TABLES = [
  // Zone 1: Sảnh Báo In Chính (Main Hall)
  { id: 'T01', name: 'Bàn 01', zone: 'Sảnh Báo In', capacity: 4, status: 'Trống', occupiedTime: null, orderItems: [], total: 0 },
  { id: 'T02', name: 'Bàn 02', zone: 'Sảnh Báo In', capacity: 2, status: 'Đang dùng món', occupiedTime: '25 phút', orderItems: ['2x Cà phê Muối Béo', '1x Croissant'], total: 125000 },
  { id: 'T03', name: 'Bàn 03', zone: 'Sảnh Báo In', capacity: 4, status: 'Đồ uống đã xong', occupiedTime: '10 phút', orderItems: ['2x Trà Sen Vàng Macchiato', '1x Espresso'], total: 145000, hasReadyDrink: true },
  { id: 'T04', name: 'Bàn 04', zone: 'Sảnh Báo In', capacity: 4, status: 'Trống', occupiedTime: null, orderItems: [], total: 0 },
  { id: 'T05', name: 'Bàn 05', zone: 'Sảnh Báo In', capacity: 6, status: 'Đang dùng món', occupiedTime: '40 phút', orderItems: ['3x Cà phê Trứng', '2x Trà Đào Cam Sả'], total: 245000 },
  { id: 'T06', name: 'Bàn 06', zone: 'Sảnh Báo In', capacity: 2, status: 'Cần dọn bàn', occupiedTime: null, orderItems: [], total: 0 },
  { id: 'T07', name: 'Bàn 07', zone: 'Sảnh Báo In', capacity: 4, status: 'Trống', occupiedTime: null, orderItems: [], total: 0 },
  { id: 'T08', name: 'Bàn 08', zone: 'Sảnh Báo In', capacity: 4, status: 'Trống', occupiedTime: null, orderItems: [], total: 0 },

  // Zone 2: Sân Vườn Di Sản (Garden Terrace)
  { id: 'T09', name: 'Bàn 09 (Sân Vườn)', zone: 'Sân Vườn', capacity: 4, status: 'Đồ uống đã xong', occupiedTime: '8 phút', orderItems: ['1x Cold Brew Ủ Lạnh', '1x Trà Sữa Oolong'], total: 95000, hasReadyDrink: true },
  { id: 'T10', name: 'Bàn 10 (Sân Vườn)', zone: 'Sân Vườn', capacity: 6, status: 'Đang dùng món', occupiedTime: '15 phút', orderItems: ['4x Cà phê Sữa Đá', '1x Tiramisu'], total: 210000 },
  { id: 'T11', name: 'Bàn 11 (Sân Vườn)', zone: 'Sân Vườn', capacity: 4, status: 'Trống', occupiedTime: null, orderItems: [], total: 0 },
  { id: 'T12', name: 'Bàn 12 (Sân Vườn)', zone: 'Sân Vườn', capacity: 2, status: 'Trống', occupiedTime: null, orderItems: [], total: 0 },

  // Zone 3: Ban Công Tầng 2 (Vintage Balcony)
  { id: 'T13', name: 'Bàn 13 (Ban Công)', zone: 'Ban Công Tầng 2', capacity: 2, status: 'Đang dùng món', occupiedTime: '30 phút', orderItems: ['2x Cà phê Phin Giấy', '1x Bánh Mì Nướng'], total: 110000 },
  { id: 'T14', name: 'Bàn 14 (Ban Công)', zone: 'Ban Công Tầng 2', capacity: 4, status: 'Trống', occupiedTime: null, orderItems: [], total: 0 },
  { id: 'T15', name: 'Bàn 15 (Ban Công)', zone: 'Ban Công Tầng 2', capacity: 4, status: 'Cần dọn bàn', occupiedTime: null, orderItems: [], total: 0 },
  { id: 'T16', name: 'Bàn 16 (Ban Công)', zone: 'Ban Công Tầng 2', capacity: 6, status: 'Trống', occupiedTime: null, orderItems: [], total: 0 },

  // Zone 4: Phòng Đọc Báo VIP (VIP Salon)
  { id: 'VIP01', name: 'Phòng VIP 01', zone: 'Phòng Đọc VIP', capacity: 8, status: 'Đã đặt chỗ', occupiedTime: null, reservedFor: 'Nguyễn Thanh Tùng (14:30)', orderItems: [], total: 0 },
  { id: 'VIP02', name: 'Phòng VIP 02', zone: 'Phòng Đọc VIP', capacity: 10, status: 'Trống', occupiedTime: null, orderItems: [], total: 0 },
];

export const FloorStaffView = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [tables, setTables] = useState(INITIAL_TABLES);
  const [activeZone, setActiveZone] = useState('all');
  const [products, setProducts] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedTableForOrder, setSelectedTableForOrder] = useState(null);
  const [selectedTableForTransfer, setSelectedTableForTransfer] = useState(null);

  // Fetch orders and products
  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordRes, prodRes] = await Promise.all([
        ordersApi.getAll(),
        productsApi.getAll()
      ]);

      if (prodRes.success) setProducts(prodRes.data || []);
      if (ordRes.success) {
        // Find orders that are ready to deliver (status === 'Đang giao')
        const ready = (ordRes.data || []).filter(o => o.status === 'Đang giao');
        setReadyOrders(ready);
      }
    } catch (err) {
      addToast(err.message || 'Lỗi đồng bộ dữ liệu sảnh phục vụ', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to Firestore orders stream
    const unsubscribe = firestoreOrders.subscribe((firestoreList) => {
      if (firestoreList) {
        const ready = firestoreList.filter(o => o.status === 'Đang giao');
        setReadyOrders(ready);
      }
    });

    const interval = setInterval(fetchData, 15000);
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Filter tables by active zone
  const filteredTables = tables.filter((t) => {
    if (activeZone === 'all') return true;
    return t.zone === activeZone;
  });

  // Table summary metrics
  const occupiedCount = tables.filter(t => t.status === 'Đang dùng món' || t.status === 'Đồ uống đã xong').length;
  const cleaningCount = tables.filter(t => t.status === 'Cần dọn bàn').length;
  const readyDrinkCount = readyOrders.length;
  const availableCount = tables.filter(t => t.status === 'Trống').length;

  // Handlers for table state changes
  const handleMarkCleaned = (tableId) => {
    setTables(tables.map(t => t.id === tableId ? { ...t, status: 'Trống', orderItems: [], total: 0, occupiedTime: null, hasReadyDrink: false } : t));
    addToast('Bàn đã được lau dọn sạch sẽ, sẵn sàng đón khách mới!', 'success');
  };

  const handleSeatGuests = (table) => {
    setSelectedTableForOrder(table);
  };

  const handleOrderCreatedForTable = (order) => {
    setTables(tables.map(t => {
      if (t.name === order.tableNumber || t.id === order.tableNumber) {
        return {
          ...t,
          status: 'Đang dùng món',
          occupiedTime: 'Vừa vào',
          orderItems: (order.items || []).map(i => `${i.quantity}x ${i.name}`),
          total: order.total_num || order.grandTotal || 0,
          hasReadyDrink: false
        };
      }
      return t;
    }));
    fetchData();
  };

  const handleTransferTable = (sourceTable, targetTable, reason) => {
    setTables(tables.map(t => {
      if (t.id === sourceTable.id) {
        return { ...t, status: 'Cần dọn bàn', orderItems: [], total: 0, occupiedTime: null, hasReadyDrink: false };
      }
      if (t.id === targetTable.id) {
        return {
          ...t,
          status: 'Đang dùng món',
          occupiedTime: sourceTable.occupiedTime || '20 phút',
          orderItems: sourceTable.orderItems,
          total: sourceTable.total,
          hasReadyDrink: sourceTable.hasReadyDrink
        };
      }
      return t;
    }));
  };

  // Deliver drink from ready queue
  const handleConfirmDelivered = async (orderId) => {
    try {
      const res = await ordersApi.advanceStatus(orderId);
      addToast(res.message || `Đã giao đồ uống đơn #${orderId} ra bàn cho khách!`, 'success');
      fetchData();
    } catch (err) {
      addToast(err.message || 'Lỗi cập nhật trạng thái phục vụ', 'error');
    }
  };

  // Request bill / checkout
  const handleRequestBill = (table) => {
    addToast(`Đã gửi yêu cầu in hóa đơn thanh toán cho ${table.name} lên Quầy Thu Ngân POS!`, 'info');
    // Set table to cleaning soon
    setTables(tables.map(t => t.id === table.id ? { ...t, status: 'Cần dọn bàn' } : t));
  };

  const staffName = user?.name || 'Nguyễn Văn An (Phục Vụ Trưởng Sảnh)';

  return (
    <div className="font-body animate-editorial-in text-brand-dark space-y-4">
      
      {/* -----------------------------------------------------------------------
          FLOOR STAFF MASTHEAD & SHIFT SUMMARY
          ----------------------------------------------------------------------- */}
      <div className="editorial-paper bg-[#FCFAF6] p-4 sm:p-5 border-2 border-[#124874] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#124874] text-white flex items-center justify-center text-xl shadow-xs border-2 border-white">
            <i className="fa-solid fa-bell-concierge"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider">
                ĐIỀU PHỐI BÀN &bull; FLOOR SERVICE DESK
              </span>
              <span className="ink-stamp stamp-green text-[8px] font-bold">TRỰC SẢNH TẠI CHỖ</span>
            </div>
            <h2 className="font-serif font-bold text-lg text-brand-dark leading-snug">
              {staffName} <span className="font-mono text-xs text-[#CF373D] font-bold">(@{user?.username || 'staff'})</span>
            </h2>
            <p className="font-serif italic text-xs text-gray-600">
              Đang phục vụ: <strong className="font-mono text-[#CF373D]">{occupiedCount}/18 bàn</strong> &bull; Bàn trống: <strong className="font-mono text-emerald-800">{availableCount} bàn</strong> &bull; Cần dọn dẹp: <strong className="font-mono text-amber-700">{cleaningCount} bàn</strong>
            </p>
          </div>
        </div>

        {/* Quick Zone Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'TẤT CẢ (18)' },
            { id: 'Sảnh Báo In', label: 'SẢNH CHÍNH (8)' },
            { id: 'Sân Vườn', label: 'SÂN VƯỜN (4)' },
            { id: 'Ban Công Tầng 2', label: 'BAN CÔNG (4)' },
            { id: 'Phòng Đọc VIP', label: 'VIP SALON (2)' },
          ].map((z) => (
            <button
              key={z.id}
              type="button"
              onClick={() => setActiveZone(z.id)}
              className={`px-3 py-1.5 font-cinzel text-xs font-bold border transition-all cursor-pointer ${
                activeZone === z.id
                  ? 'bg-[#124874] text-white border-[#124874] shadow-2xs font-black'
                  : 'bg-white text-[#124874] border-[#D8D1C5] hover:bg-[#FAF7F2]'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>

      </div>

      {/* -----------------------------------------------------------------------
          MAIN SPLIT WORKSPACE:
          LEFT (8 Cols): INTERACTIVE FLOOR TABLE MAP
          RIGHT (4 Cols): READY DRINK DELIVERY DISPATCH QUEUE
          ----------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* =====================================================================
            LEFT COLUMN (8 COLS / 66%): INTERACTIVE TABLE MAP
            ===================================================================== */}
        <div className="lg:col-span-8 space-y-3">
          
          <div className="editorial-paper bg-white p-4 border-2 border-[#124874] shadow-xs">
            <div className="flex justify-between items-center border-b border-[#124874] pb-2 mb-3">
              <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider">
                SƠ ĐỒ BÀN KHÁCH &bull; FLOOR MAP ({filteredTables.length} BÀN)
              </span>
              <div className="flex items-center gap-3 text-[11px] font-cinzel font-bold">
                <span className="flex items-center gap-1 text-emerald-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> Trống
                </span>
                <span className="flex items-center gap-1 text-[#CF373D]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#CF373D] inline-block"></span> Có khách
                </span>
                <span className="flex items-center gap-1 text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Cần dọn
                </span>
              </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredTables.map((table) => {
                const isAvailable = table.status === 'Trống';
                const isOccupied = table.status === 'Đang dùng món';
                const isDrinkReady = table.status === 'Đồ uống đã xong' || table.hasReadyDrink;
                const isCleaning = table.status === 'Cần dọn bàn';
                const isReserved = table.status === 'Đã đặt chỗ';

                return (
                  <div
                    key={table.id}
                    className={`editorial-card-press p-3.5 border-2 transition-all flex flex-col justify-between space-y-2.5 shadow-xs ${
                      isDrinkReady
                        ? 'border-[#CF373D] bg-red-50/70 ring-2 ring-[#CF373D] ring-offset-1 animate-pulse'
                        : isOccupied
                        ? 'border-[#124874] bg-[#FAF7F2]'
                        : isCleaning
                        ? 'border-amber-500 bg-amber-50/60'
                        : isReserved
                        ? 'border-indigo-600 bg-indigo-50/60'
                        : 'border-[#D8D1C5] bg-white hover:border-[#124874]'
                    }`}
                  >
                    {/* Header */}
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono text-[10px] text-gray-500 block">#{table.id} &bull; {table.zone}</span>
                          <h4 className="font-serif font-bold text-base text-[#124874] leading-tight">
                            {table.name}
                          </h4>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-2 py-0.5 font-cinzel text-[9px] font-bold border ${
                          isDrinkReady
                            ? 'bg-[#CF373D] text-white border-[#CF373D]'
                            : isOccupied
                            ? 'bg-[#124874] text-white border-[#124874]'
                            : isCleaning
                            ? 'bg-amber-100 text-amber-900 border-amber-400'
                            : isReserved
                            ? 'bg-indigo-100 text-indigo-900 border-indigo-400'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}>
                          {isDrinkReady ? '🔔 CÓ ĐỒ UỐNG' : table.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Capacity & Time Info */}
                      <div className="mt-1 flex items-center justify-between text-xs font-serif text-gray-600">
                        <span><i className="fa-solid fa-chair mr-1 text-gray-400"></i> {table.capacity} chỗ</span>
                        {table.occupiedTime && (
                          <span className="font-mono text-[11px] text-[#CF373D] font-bold">
                            <i className="fa-solid fa-clock mr-1"></i> {table.occupiedTime}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Table Body Content */}
                    <div className="text-xs pt-1 border-t border-gray-200 space-y-1">
                      {isAvailable && (
                        <p className="font-serif italic text-gray-400 text-center py-2">
                          Bàn trống sạch sẽ &bull; Sẵn sàng đón khách
                        </p>
                      )}

                      {isOccupied && (
                        <div>
                          <div className="space-y-0.5 max-h-16 overflow-y-auto pr-1">
                            {table.orderItems.map((item, idx) => (
                              <p key={idx} className="font-serif text-[11px] text-gray-800 truncate">&bull; {item}</p>
                            ))}
                          </div>
                          <div className="flex justify-between items-center pt-1 mt-1 border-t border-dashed border-gray-300 font-mono text-xs">
                            <span className="text-gray-500">Tạm tính:</span>
                            <strong className="text-[#CF373D]">{table.total.toLocaleString('vi-VN')}đ</strong>
                          </div>
                        </div>
                      )}

                      {isDrinkReady && (
                        <div className="bg-white p-2 border border-[#CF373D] text-center space-y-1">
                          <p className="font-serif font-bold text-xs text-[#CF373D]">
                            <i className="fa-solid fa-mug-hot mr-1"></i> Quầy Bar đã pha xong!
                          </p>
                          <p className="font-serif italic text-[10px] text-gray-600">
                            Vui lòng đến quầy bar bưng ra bàn cho khách.
                          </p>
                        </div>
                      )}

                      {isCleaning && (
                        <div className="text-center py-1 text-amber-900 font-serif italic text-[11px]">
                          Khách vừa thanh toán rời đi &bull; Cần lau dọn
                        </div>
                      )}

                      {isReserved && (
                        <div className="text-xs text-indigo-900 font-serif space-y-0.5">
                          <p className="font-bold">{table.reservedFor}</p>
                          <p className="italic text-gray-500 text-[10px]">Đã chuẩn bị trước</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-gray-200">
                      {isAvailable && (
                        <button
                          type="button"
                          onClick={() => handleSeatGuests(table)}
                          style={{ backgroundColor: '#124874', color: '#ffffff' }}
                          className="press-btn w-full py-1.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <i className="fa-solid fa-plus"></i>
                          <span>ĐÓN KHÁCH &bull; GỌI MÓN</span>
                        </button>
                      )}

                      {isOccupied && (
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedTableForOrder(table)}
                            className="press-btn py-1 bg-white border border-[#124874] text-[#124874] font-cinzel text-[10px] font-bold hover:bg-[#FAF7F2] cursor-pointer"
                            title="Gọi thêm món"
                          >
                            + MÓN
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedTableForTransfer(table)}
                            className="press-btn py-1 bg-white border border-[#124874] text-[#124874] font-cinzel text-[10px] font-bold hover:bg-[#FAF7F2] cursor-pointer"
                            title="Chuyển bàn"
                          >
                            ĐỔI BÀN
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRequestBill(table)}
                            className="press-btn py-1 bg-[#CF373D] text-white font-cinzel text-[10px] font-bold hover:bg-[#124874] cursor-pointer"
                            title="Yêu cầu thanh toán"
                          >
                            TÍNH TIỀN
                          </button>
                        </div>
                      )}

                      {isDrinkReady && (
                        <button
                          type="button"
                          onClick={() => {
                            setTables(tables.map(t => t.id === table.id ? { ...t, status: 'Đang dùng món', hasReadyDrink: false } : t));
                            addToast(`Đã xác nhận bưng đồ uống ra ${table.name}!`, 'success');
                          }}
                          style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
                          className="press-btn w-full py-1.5 font-cinzel text-xs font-bold hover:bg-[#124874] transition-colors shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <i className="fa-solid fa-check"></i>
                          <span>ĐÃ BƯNG RA BÀN</span>
                        </button>
                      )}

                      {isCleaning && (
                        <button
                          type="button"
                          onClick={() => handleMarkCleaned(table.id)}
                          className="press-btn w-full py-1.5 bg-amber-600 text-white font-cinzel text-xs font-bold hover:bg-emerald-800 transition-colors shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <i className="fa-solid fa-broom"></i>
                          <span>XÁC NHẬN ĐÃ DỌN XONG</span>
                        </button>
                      )}

                      {isReserved && (
                        <button
                          type="button"
                          onClick={() => handleSeatGuests(table)}
                          className="press-btn w-full py-1.5 bg-indigo-800 text-white font-cinzel text-xs font-bold hover:bg-[#124874] transition-colors shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <i className="fa-solid fa-user-check"></i>
                          <span>CHECK-IN KHÁCH ĐẾN</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* =====================================================================
            RIGHT COLUMN (4 COLS / 34%): READY DRINK DELIVERY DISPATCH QUEUE
            ===================================================================== */}
        <div className="lg:col-span-4 space-y-3">
          
          <div className="editorial-paper bg-white p-4 border-2 border-[#124874] shadow-xs space-y-3">
            
            {/* Header */}
            <div className="bg-[#124874] text-white p-2.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-bell text-amber-300 text-xs fa-shake"></i>
                <span className="font-cinzel text-xs font-bold tracking-wider uppercase">
                  ĐỒ UỐNG CHỜ BƯNG RA BÀN ({readyOrders.length})
                </span>
              </div>
              <span className="px-1.5 py-0.5 bg-white text-[#124874] font-mono text-[10px] font-bold">
                BARISTA KDS
              </span>
            </div>

            {/* Ready Orders List */}
            <div className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-1">
              {readyOrders.length === 0 ? (
                <div className="py-10 text-center text-gray-400 space-y-1">
                  <i className="fa-solid fa-tray text-3xl text-gray-300"></i>
                  <p className="font-serif italic text-xs text-gray-600">Hiện không có đồ uống nào đang chờ bưng ra bàn.</p>
                  <p className="font-cinzel text-[10px] text-gray-400">QUẦY BAR ĐANG PHA CHẾ THEO TIẾN ĐỘ</p>
                </div>
              ) : (
                readyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 bg-[#FAF7F2] border-2 border-[#CF373D] shadow-xs space-y-2.5"
                  >
                    {/* Masthead */}
                    <div className="flex justify-between items-start border-b border-[#CF373D]/30 pb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <strong className="font-mono text-sm text-[#CF373D]">#{order.id}</strong>
                          <span className="px-2 py-0.5 bg-[#124874] text-white font-cinzel text-[10px] font-bold">
                            {order.customer}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-500 block mt-0.5">Xong lúc: {order.time}</span>
                      </div>

                      <span className="ink-stamp stamp-jasper text-[8px] font-bold">
                        BƯNG NGAY
                      </span>
                    </div>

                    {/* Items Summary */}
                    <div className="space-y-1 text-xs">
                      {Array.isArray(order.items) ? (
                        order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between font-serif text-gray-800">
                            <span>{it.quantity}x {it.name}</span>
                            <span className="font-mono text-[10px] text-gray-500">{it.modifierSummary}</span>
                          </div>
                        ))
                      ) : (
                        <p className="font-serif italic text-gray-700">{order.customer}</p>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => handleConfirmDelivered(order.id)}
                      style={{ backgroundColor: '#124874', color: '#ffffff' }}
                      className="press-btn w-full py-2 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <i className="fa-solid fa-check-double"></i>
                      <span>XÁC NHẬN ĐÃ BƯNG RA BÀN</span>
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>

      {/* -----------------------------------------------------------------------
          POPUP MODALS:
          1. TABLE ORDER MODAL (GỌI MÓN TẠI BÀN)
          2. TABLE TRANSFER MODAL (CHUYỂN BÀN)
          ----------------------------------------------------------------------- */}
      <TableOrderModal
        isOpen={Boolean(selectedTableForOrder)}
        onClose={() => setSelectedTableForOrder(null)}
        table={selectedTableForOrder}
        products={products}
        staffName={staffName}
        onOrderCreated={handleOrderCreatedForTable}
      />

      <TableTransferModal
        isOpen={Boolean(selectedTableForTransfer)}
        onClose={() => setSelectedTableForTransfer(null)}
        currentTable={selectedTableForTransfer}
        allTables={tables}
        onTransferConfirm={handleTransferTable}
      />

    </div>
  );
};

export default FloorStaffView;
