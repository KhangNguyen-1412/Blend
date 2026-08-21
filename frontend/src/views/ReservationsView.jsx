import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/common/SectionHeader';
import ReservationModal from '../components/reservations/ReservationModal';
import Pagination from '../components/common/Pagination';
import { reservationsApi } from '../services/api';
import { firestoreReservations } from '../services/firestoreService';
import { useToast } from '../context/ToastContext';

const STATUS_CONFIG = {
  'Chờ xác nhận': {
    badge: 'border-2 border-[#CF373D] text-[#CF373D] bg-[#FCFAF6]',
    dot: 'bg-[#CF373D]',
    icon: 'fa-hourglass-half'
  },
  'Đã xác nhận': {
    badge: 'border-2 border-[#124874] text-[#124874] bg-[#FCFAF6]',
    dot: 'bg-[#124874]',
    icon: 'fa-check'
  },
  'Đã phục vụ': {
    badge: 'border-2 border-[#124874] text-white bg-[#124874]',
    dot: 'bg-white',
    icon: 'fa-mug-hot'
  },
  'Đã hủy': {
    badge: 'border-2 border-[#6E675F] text-[#6E675F] bg-[#FAF7F2]',
    dot: 'bg-[#6E675F]',
    icon: 'fa-ban'
  }
};

const DEFAULT_TABLES = [
  // Zone 1: Sảnh Báo In Cổ Điển (8 bàn)
  { id: 'T01', name: 'Bàn 01', zone: 'Khu vực đọc báo in cổ điển', capacity: 4, status: 'Trống', note: 'Gần cửa sổ lớn' },
  { id: 'T02', name: 'Bàn 02', zone: 'Khu vực đọc báo in cổ điển', capacity: 2, status: 'Đang phục vụ', note: 'Bàn đọc báo đơn' },
  { id: 'T03', name: 'Bàn 03', zone: 'Khu vực đọc báo in cổ điển', capacity: 4, status: 'Đã đặt chỗ', note: 'Bàn trung tâm sảnh' },
  { id: 'T04', name: 'Bàn 04', zone: 'Khu vực đọc báo in cổ điển', capacity: 4, status: 'Trống', note: 'Bàn gần giá sách báo' },
  { id: 'T05', name: 'Bàn 05', zone: 'Khu vực đọc báo in cổ điển', capacity: 6, status: 'Đang phục vụ', note: 'Bàn gỗ sồi nhóm' },
  { id: 'T06', name: 'Bàn 06', zone: 'Khu vực đọc báo in cổ điển', capacity: 2, status: 'Trống', note: 'Góc tĩnh lặng' },
  { id: 'T07', name: 'Bàn 07', zone: 'Khu vực đọc báo in cổ điển', capacity: 4, status: 'Trống', note: 'Gần quầy phát hành báo' },
  { id: 'T08', name: 'Bàn 08', zone: 'Khu vực đọc báo in cổ điển', capacity: 4, status: 'Trống', note: 'Góc máy đánh chữ cổ' },

  // Zone 2: Quầy Barista Trực Tiếp (4 vị trí)
  { id: 'BAR01', name: 'Quầy Bar 01', zone: 'Quầy Barista trực tiếp', capacity: 2, status: 'Đang phục vụ', note: 'Ghế cao xem pha Espresso' },
  { id: 'BAR02', name: 'Quầy Bar 02', zone: 'Quầy Barista trực tiếp', capacity: 2, status: 'Trống', note: 'Ghế cao xem pha Pour Over' },
  { id: 'BAR03', name: 'Quầy Bar 03', zone: 'Quầy Barista trực tiếp', capacity: 2, status: 'Đã đặt chỗ', note: 'Ghế cao xem biểu diễn Latte Art' },
  { id: 'BAR04', name: 'Quầy Bar 04', zone: 'Quầy Barista trực tiếp', capacity: 2, status: 'Trống', note: 'Ghế cao quầy trà thủ công' },

  // Zone 3: Sân Vườn Thoáng Mát (4 bàn)
  { id: 'T09', name: 'Bàn 09', zone: 'Sân vườn thoáng mát', capacity: 4, status: 'Trống', note: 'Dưới gốc cây bàng cổ thụ' },
  { id: 'T10', name: 'Bàn 10', zone: 'Sân vườn thoáng mát', capacity: 6, status: 'Đang phục vụ', note: 'Bàn đá cẩm thạch sân sau' },
  { id: 'T11', name: 'Bàn 11', zone: 'Sân vườn thoáng mát', capacity: 4, status: 'Trống', note: 'Bàn ngoài trời có dù che' },
  { id: 'T12', name: 'Bàn 12', zone: 'Sân vườn thoáng mát', capacity: 2, status: 'Trống', note: 'Bàn cạnh hồ cá koi' },

  // Zone 4: Phòng Họp Riêng VIP Salon (2 phòng)
  { id: 'VIP01', name: 'Phòng VIP 01', zone: 'Phòng họp riêng VIP Salon', capacity: 8, status: 'Đã đặt chỗ', note: 'Phòng khép kín có máy chiếu & set trà cao cấp' },
  { id: 'VIP02', name: 'Phòng VIP 02', zone: 'Phòng họp riêng VIP Salon', capacity: 10, status: 'Trống', note: 'Phòng tiếp khách ngoại giao & đàm phán' },
];

export const ReservationsView = () => {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState(DEFAULT_TABLES);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);

  // Sub-Tab Switcher: 'list' (Sổ Đặt Chỗ) vs 'tables' (Quản Lý Bàn Thưởng Thức)
  const [activeMainTab, setActiveMainTab] = useState('list');
  
  // Filters & Pagination for Reservations List
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filters for Table Management Map
  const [tableZoneFilter, setTableZoneFilter] = useState('all');
  const [tableStatusFilter, setTableStatusFilter] = useState('all');

  const { addToast } = useToast();

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await reservationsApi.getAll();
      if (res.success) {
        setReservations(res.data || []);
      }
    } catch (err) {
      addToast(err.message || 'Lỗi tải danh sách phiếu đặt chỗ', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();

    const unsubscribe = firestoreReservations.subscribe((firestoreList) => {
      if (firestoreList) {
        setReservations(firestoreList);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleSaveReservation = async (formData) => {
    try {
      if (editingReservation) {
        const res = await reservationsApi.update(editingReservation.id, formData);
        await firestoreReservations.update(editingReservation.id, formData);
        addToast(res.message || 'Cập nhật phiếu đặt chỗ thành công!', 'success');
      } else {
        const res = await reservationsApi.create(formData);
        await firestoreReservations.create({ ...formData, id: res.data?.id || `res_${Date.now()}` });
        addToast('Ghi danh phiếu đặt chỗ mới thành công!', 'success');
      }
      setIsModalOpen(false);
      setEditingReservation(null);
      fetchReservations();
    } catch (err) {
      addToast(err.message || 'Lỗi khi lưu phiếu đặt chỗ', 'error');
    }
  };

  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      const reservation = reservations.find((r) => r.id === id);
      if (!reservation) return;

      const updated = { ...reservation, status: newStatus };
      await reservationsApi.update(id, updated);
      await firestoreReservations.update(id, updated);

      addToast(`Đã chuyển phiếu #${id} sang trạng thái "${newStatus}"`, 'success');
      fetchReservations();
    } catch (err) {
      addToast(err.message || 'Lỗi cập nhật trạng thái', 'error');
    }
  };

  const handleDeleteReservation = async (id, name) => {
    if (!window.confirm(`Xác nhận xóa phiếu đặt chỗ của thực khách "${name}"?`)) {
      return;
    }

    try {
      await reservationsApi.delete(id);
      await firestoreReservations.delete(id);
      addToast('Đã xóa phiếu đặt chỗ thành công', 'success');
      fetchReservations();
    } catch (err) {
      addToast(err.message || 'Lỗi khi xóa phiếu đặt chỗ', 'error');
    }
  };

  // 1-Click quick toggle table status in Table Management Tab
  const handleToggleTableStatus = (tableId, nextStatus) => {
    setTables(tables.map(t => t.id === tableId ? { ...t, status: nextStatus } : t));
    addToast(`Đã chuyển trạng thái bàn sang "${nextStatus}"`, 'info');
  };

  // Filtered reservations
  const filteredReservations = reservations.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.email && r.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.note && r.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.table_number && r.table_number.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Filtered tables
  const filteredTables = tables.filter((t) => {
    const matchZone = tableZoneFilter === 'all' || t.zone === tableZoneFilter;
    const matchStatus = tableStatusFilter === 'all' || t.status === tableStatusFilter;
    return matchZone && matchStatus;
  });

  // Calculate Metrics
  const totalCount = reservations.length;
  const pendingCount = reservations.filter((r) => r.status === 'Chờ xác nhận').length;
  const confirmedCount = reservations.filter((r) => r.status === 'Đã xác nhận').length;
  const completedCount = reservations.filter((r) => r.status === 'Đã phục vụ').length;

  const totalTables = tables.length;
  const availableTables = tables.filter(t => t.status === 'Trống').length;
  const occupiedTables = tables.filter(t => t.status === 'Đang phục vụ').length;
  const reservedTables = tables.filter(t => t.status === 'Đã đặt chỗ').length;

  return (
    <div className="font-body animate-editorial-in text-[#161413] space-y-6">
      
      {/* Editorial Header */}
      <SectionHeader 
        sectionNo="MỤC VI &bull; SỔ ĐIỀU PHỐI ĐẶT CHỖ" 
        title="Quản Lý Đặt Chỗ Thưởng Thức & VIP Salon" 
        subtitle="Tiếp nhận, xác thực lịch hẹn từ Trang Giới Thiệu, chỉ định và điều phối sơ đồ bàn thưởng thức nghệ thuật cho thực khách." 
        action={
          <div className="flex gap-2">
            <button 
              onClick={fetchReservations}
              className="press-btn px-4 py-2.5 bg-white border border-[#124874] text-[#124874] font-cinzel text-xs font-bold hover:bg-[#124874] hover:text-white transition-colors flex items-center gap-1.5 shadow-xs"
              title="Tải lại dữ liệu mới nhất"
            >
              <i className={`fa-solid fa-arrows-rotate ${loading ? 'fa-spin' : ''}`}></i>
              <span>LÀM MỚI</span>
            </button>
            <button 
              onClick={() => {
                setEditingReservation(null);
                setIsModalOpen(true);
              }}
              style={{ backgroundColor: '#124874', color: '#ffffff' }}
              className="press-btn px-5 py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors flex items-center gap-2 shadow-xs"
            >
              <i className="fa-solid fa-calendar-plus"></i>
              <span>GHI DANH ĐẶT BÀN MỚI</span>
            </button>
          </div>
        }
      />

      {/* Main Tab Navigation: Sổ Đặt Chỗ vs Quản Lý Bàn Thưởng Thức */}
      <div className="bg-[#FAF7F2] p-2 border-2 border-[#124874] flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveMainTab('list')}
            className={`px-4 py-2 font-cinzel text-xs font-bold transition-all border flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'list'
                ? 'bg-[#124874] text-white border-[#124874] shadow-sm font-black'
                : 'bg-white text-[#124874] border-[#D8D1C5] hover:bg-white'
            }`}
          >
            <i className="fa-solid fa-book-bookmark"></i>
            <span>SỔ ĐẶT CHỖ &bull; RESERVATIONS ({reservations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('tables')}
            className={`px-4 py-2 font-cinzel text-xs font-bold transition-all border flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'tables'
                ? 'bg-[#124874] text-white border-[#124874] shadow-sm font-black'
                : 'bg-white text-[#124874] border-[#D8D1C5] hover:bg-white'
            }`}
          >
            <i className="fa-solid fa-chair text-[#CF373D]"></i>
            <span>QUẢN LÝ BÀN THƯỞNG THỨC ({tables.length} BÀN)</span>
          </button>
        </div>

        <div className="text-xs font-serif italic text-gray-600 hidden sm:block">
          {activeMainTab === 'list' ? 'Xem và điều phối danh sách phiếu đặt bàn' : 'Sơ đồ bàn, sức chứa & điều phối chỗ ngồi theo khu vực'}
        </div>
      </div>

      {/* =======================================================================
          TAB 1: SỔ ĐẶT CHỖ & LỊCH HẸN THỰC KHÁCH (LIST VIEW)
          ======================================================================= */}
      {activeMainTab === 'list' && (
        <div className="space-y-5 animate-fade-in">
          
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="editorial-card-press bg-white p-5 border-2 border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.95)]">
              <div className="flex justify-between items-start mb-2">
                <span className="font-cinzel text-[10px] font-bold text-[#124874] uppercase tracking-wider">
                  TỔNG PHIẾU ĐẶT
                </span>
                <i className="fa-solid fa-book-bookmark text-[#124874] text-sm"></i>
              </div>
              <p className="font-display text-3xl font-bold text-[#124874]">{totalCount}</p>
              <span className="font-serif italic text-xs text-[#6E675F] block mt-1">Ghi nhận từ web &amp; tại quầy</span>
            </div>

            <div className="editorial-card-press p-5 bg-[#FCFAF6] border-2 border-[#CF373D] shadow-[4px_4px_0px_rgba(207,55,61,0.95)]">
              <div className="flex justify-between items-start mb-2">
                <span className="font-cinzel text-[10px] font-bold text-[#CF373D] uppercase tracking-wider">
                  CẦN XÁC NHẬN GẤP
                </span>
                <i className="fa-solid fa-bell text-[#CF373D] text-sm"></i>
              </div>
              <p className="font-display text-3xl font-bold text-[#CF373D]">{pendingCount}</p>
              <span className="font-serif italic text-xs text-[#6E675F] block mt-1">Thực khách đang chờ gọi điện</span>
            </div>

            <div className="editorial-card-press bg-white p-5 border-2 border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.95)]">
              <div className="flex justify-between items-start mb-2">
                <span className="font-cinzel text-[10px] font-bold text-[#124874] uppercase tracking-wider">
                  ĐÃ XÁC NHẬN &amp; GIỮ CHỖ
                </span>
                <i className="fa-solid fa-calendar-check text-[#124874] text-sm"></i>
              </div>
              <p className="font-display text-3xl font-bold text-[#124874]">{confirmedCount}</p>
              <span className="font-serif italic text-xs text-[#6E675F] block mt-1">Đã sắp xếp bàn &amp; chuẩn bị</span>
            </div>

            <div className="editorial-card-press bg-white p-5 border-2 border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.95)]">
              <div className="flex justify-between items-start mb-2">
                <span className="font-cinzel text-[10px] font-bold text-[#124874] uppercase tracking-wider">
                  ĐÃ PHỤC VỤ HOÀN TẤT
                </span>
                <i className="fa-solid fa-mug-hot text-[#124874] text-sm"></i>
              </div>
              <p className="font-display text-3xl font-bold text-[#124874]">{completedCount}</p>
              <span className="font-serif italic text-xs text-[#6E675F] block mt-1">Thực khách đã dùng bữa</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white p-4 border-2 border-[#124874] shadow-xs flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm theo tên thực khách, số điện thoại, bàn thưởng thức, ghi chú..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#124874] pl-9 pr-4 py-2 font-body text-xs text-[#161413] focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-[#124874] text-xs"></i>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-cinzel font-bold text-[#124874] text-[11px] uppercase hidden lg:inline">
                Trạng thái:
              </span>
              {['all', 'Chờ xác nhận', 'Đã xác nhận', 'Đã phục vụ', 'Đã hủy'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 font-cinzel text-[11px] font-bold transition-colors border ${
                    statusFilter === status
                      ? 'bg-[#124874] text-white border-[#124874]'
                      : 'bg-[#FAF7F2] text-[#124874] border-[#D8D1C5] hover:border-[#124874] hover:bg-white'
                  }`}
                >
                  {status === 'all' ? 'TẤT CẢ' : status.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Reservations Gazette Table */}
          <div className="editorial-card-press overflow-hidden bg-white border-2 border-[#124874] shadow-[6px_6px_0px_rgba(18,72,116,0.95)]">
            <div className="editorial-table-scroll">
              <table className="w-full text-left border-collapse font-body text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#124874] text-white font-cinzel tracking-wider text-[11px] border-b-2 border-[#0D3656]">
                    <th className="py-3 px-4">MÃ &bull; THỜI GIAN</th>
                    <th className="py-3 px-4">THỰC KHÁCH</th>
                    <th className="py-3 px-4">LỊCH ĐẾN &bull; SỐ KHÁCH</th>
                    <th className="py-3 px-4">KHU VỰC &bull; BÀN CHỈ ĐỊNH</th>
                    <th className="py-3 px-4 text-center">TRẠNG THÁI</th>
                    <th className="py-3 px-4 text-right">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D1C5]">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-[#6E675F] font-serif italic">
                        <i className="fa-solid fa-spinner fa-spin text-xl mb-2 text-[#124874] block"></i>
                        Đang mở sổ ghi danh đặt chỗ...
                      </td>
                    </tr>
                  ) : filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-[#6E675F] font-serif italic">
                        <i className="fa-regular fa-calendar-xmark text-3xl mb-2 text-[#6E675F] block"></i>
                        Không tìm thấy phiếu đặt chỗ nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((r) => {
                      const statusInfo = STATUS_CONFIG[r.status] || STATUS_CONFIG['Chờ xác nhận'];
                      return (
                        <tr key={r.id} className="hover:bg-[#FAF7F2] transition-colors">
                          <td className="py-3.5 px-4 align-top">
                            <span className="font-mono font-bold text-[#124874] block">
                              #RES-{String(r.id).padStart(4, '0')}
                            </span>
                            <span className="font-mono text-[10px] text-[#6E675F] block mt-0.5">
                              {r.created_at ? new Date(r.created_at).toLocaleDateString('vi-VN') : 'Mới ghi danh'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 align-top">
                            <span className="font-serif font-bold text-sm text-[#161413] block">
                              {r.name}
                            </span>
                            <div className="font-mono text-xs text-[#CF373D] font-bold flex items-center gap-1 mt-0.5">
                              <i className="fa-solid fa-phone text-[10px]"></i>
                              <span>{r.phone}</span>
                            </div>
                            {r.email && (
                              <span className="font-mono text-[10px] text-[#6E675F] block truncate max-w-[180px]">
                                {r.email}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 align-top">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#124874]">
                              <i className="fa-solid fa-calendar-day text-[#CF373D]"></i>
                              <span>{r.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#161413] mt-0.5">
                              <i className="fa-regular fa-clock text-gray-500"></i>
                              <span>{r.time}</span>
                              <span className="text-gray-400">&bull;</span>
                              <span className="text-[#124874]">{r.guests} người</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 align-top">
                            <div className="flex items-center gap-1.5">
                              <span className="font-serif text-xs font-bold text-[#124874] block">
                                {r.area || 'Khu vực đọc báo in'}
                              </span>
                            </div>
                            {r.table_number ? (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-[#124874] text-white font-mono text-[10px] font-bold">
                                <i className="fa-solid fa-chair mr-1"></i> {r.table_number}
                              </span>
                            ) : (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-[#FAF7F2] border border-[#D8D1C5] text-gray-500 font-mono text-[10px]">
                                Tự động xếp bàn
                              </span>
                            )}
                            {r.note && (
                              <p className="font-serif italic text-[11px] text-gray-600 mt-1 line-clamp-2">
                                "{r.note}"
                              </p>
                            )}
                          </td>

                          <td className="py-3.5 px-4 align-top text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-cinzel font-bold ${statusInfo.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
                              <span>{r.status}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4 align-top text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {r.status === 'Chờ xác nhận' && (
                                <button
                                  type="button"
                                  onClick={() => handleQuickStatusChange(r.id, 'Đã xác nhận')}
                                  className="px-2.5 py-1 bg-[#124874] text-white hover:bg-[#CF373D] font-cinzel text-[10px] font-bold transition-colors shadow-2xs cursor-pointer"
                                  title="Xác nhận giữ chỗ"
                                >
                                  <i className="fa-solid fa-check mr-1"></i> DUYỆT
                                </button>
                              )}

                              {r.status === 'Đã xác nhận' && (
                                <button
                                  type="button"
                                  onClick={() => handleQuickStatusChange(r.id, 'Đã phục vụ')}
                                  className="px-2.5 py-1 bg-[#124874] text-white hover:bg-[#CF373D] font-cinzel text-[10px] font-bold transition-colors shadow-2xs cursor-pointer"
                                  title="Đánh dấu đã tiếp đón và phục vụ"
                                >
                                  <i className="fa-solid fa-mug-hot mr-1"></i> TIẾP ĐÓN
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingReservation(r);
                                  setIsModalOpen(true);
                                }}
                                className="p-1.5 bg-white hover:bg-[#124874] hover:text-white border border-[#124874] text-[#124874] transition-colors cursor-pointer"
                                title="Chỉnh sửa thông tin"
                              >
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteReservation(r.id, r.name)}
                                className="p-1.5 bg-white hover:bg-[#CF373D] hover:text-white border border-[#CF373D] text-[#CF373D] transition-colors cursor-pointer"
                                title="Xóa phiếu đặt chỗ"
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredReservations.length / itemsPerPage) || 1}
              totalItems={filteredReservations.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              itemsPerPageOptions={[5, 10, 15, 20, 50]}
            />
          </div>

        </div>
      )}

      {/* =======================================================================
          TAB 2: QUẢN LÝ BÀN THƯỞNG THỨC & SƠ ĐỒ CHỖ NGỒI (TABLE MANAGEMENT)
          ======================================================================= */}
      {activeMainTab === 'tables' && (
        <div className="space-y-5 animate-fade-in">
          
          {/* Table Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 border-2 border-[#124874] shadow-xs text-center">
              <span className="font-cinzel text-[10px] font-bold text-[#124874] uppercase block">TỔNG SỐ BÀN THƯỞNG THỨC</span>
              <span className="font-mono text-2xl font-black text-[#124874]">{totalTables} bàn</span>
            </div>
            <div className="bg-white p-4 border-2 border-emerald-700 shadow-xs text-center">
              <span className="font-cinzel text-[10px] font-bold text-emerald-800 uppercase block">BÀN TRỐNG SẴN SÀNG</span>
              <span className="font-mono text-2xl font-black text-emerald-800">{availableTables} bàn</span>
            </div>
            <div className="bg-white p-4 border-2 border-[#CF373D] shadow-xs text-center">
              <span className="font-cinzel text-[10px] font-bold text-[#CF373D] uppercase block">ĐANG PHỤC VỤ KHÁCH</span>
              <span className="font-mono text-2xl font-black text-[#CF373D]">{occupiedTables} bàn</span>
            </div>
            <div className="bg-white p-4 border-2 border-indigo-700 shadow-xs text-center">
              <span className="font-cinzel text-[10px] font-bold text-indigo-900 uppercase block">ĐÃ ĐẶT CHỖ TRƯỚC</span>
              <span className="font-mono text-2xl font-black text-indigo-900">{reservedTables} bàn</span>
            </div>
          </div>

          {/* Table Zone Filter & Status Filter Strip */}
          <div className="bg-white p-4 border-2 border-[#124874] shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
            
            {/* Zone Filter Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'TẤT CẢ KHU VỰC (18)' },
                { id: 'Khu vực đọc báo in cổ điển', label: 'SẢNH BÁO IN (8)' },
                { id: 'Quầy Barista trực tiếp', label: 'QUẦY BAR (4)' },
                { id: 'Sân vườn thoáng mát', label: 'SÂN VƯỜN (4)' },
                { id: 'Phòng họp riêng VIP Salon', label: 'VIP SALON (2)' },
              ].map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setTableZoneFilter(zone.id)}
                  className={`px-3 py-1.5 font-cinzel text-xs font-bold border transition-all cursor-pointer ${
                    tableZoneFilter === zone.id
                      ? 'bg-[#124874] text-white border-[#124874] shadow-2xs font-black'
                      : 'bg-[#FAF7F2] text-[#124874] border-[#D8D1C5] hover:bg-white'
                  }`}
                >
                  {zone.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xs font-bold text-[#124874] uppercase">Trạng thái:</span>
              <select
                value={tableStatusFilter}
                onChange={(e) => setTableStatusFilter(e.target.value)}
                className="bg-[#FAF7F2] border border-[#124874] px-2.5 py-1 font-serif text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#CF373D]"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Trống">Trống sạch sẽ</option>
                <option value="Đang phục vụ">Đang phục vụ</option>
                <option value="Đã đặt chỗ">Đã đặt chỗ</option>
                <option value="Bảo trì">Bảo trì / Khóa</option>
              </select>
            </div>
          </div>

          {/* Interactive Tables Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTables.map((tbl) => {
              const isAvailable = tbl.status === 'Trống';
              const isOccupied = tbl.status === 'Đang phục vụ';
              const isReserved = tbl.status === 'Đã đặt chỗ';

              // Find if any active reservation matches this table
              const matchedReservation = reservations.find(
                (r) => r.table_number === tbl.name && r.status !== 'Đã hủy'
              );

              return (
                <div
                  key={tbl.id}
                  className={`editorial-card-press p-4 border-2 transition-all flex flex-col justify-between space-y-3 shadow-xs ${
                    isOccupied
                      ? 'border-[#CF373D] bg-red-50/50'
                      : isReserved
                      ? 'border-indigo-700 bg-indigo-50/50'
                      : 'border-[#124874] bg-white'
                  }`}
                >
                  {/* Table Header */}
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-[10px] text-gray-500 block">#{tbl.id}</span>
                        <h4 className="font-serif font-bold text-base text-[#124874] leading-tight">
                          {tbl.name}
                        </h4>
                      </div>

                      <span className={`px-2 py-0.5 font-cinzel text-[9px] font-bold border ${
                        isOccupied
                          ? 'bg-[#CF373D] text-white border-[#CF373D]'
                          : isReserved
                          ? 'bg-indigo-800 text-white border-indigo-800'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}>
                        {tbl.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="font-serif italic text-[11px] text-gray-600 mt-1">
                      {tbl.zone} &bull; <strong className="font-mono">{tbl.capacity} chỗ</strong>
                    </p>
                  </div>

                  {/* Reservation Match Card */}
                  <div className="bg-[#FCFAF6] p-2.5 border border-[#D8D1C5] text-xs font-serif space-y-1">
                    {matchedReservation ? (
                      <div>
                        <div className="flex justify-between items-center text-[#124874] font-bold">
                          <span>{matchedReservation.name}</span>
                          <span className="font-mono text-[10px] text-[#CF373D]">{matchedReservation.time}</span>
                        </div>
                        <p className="font-mono text-[10px] text-gray-500">
                          SĐT: {matchedReservation.phone} ({matchedReservation.guests} khách)
                        </p>
                      </div>
                    ) : (
                      <p className="font-serif italic text-[11px] text-gray-500">
                        {tbl.note || 'Không có ghi chú đặc biệt'}
                      </p>
                    )}
                  </div>

                  {/* Quick Table Action Buttons */}
                  <div className="pt-2 border-t border-gray-200 grid grid-cols-2 gap-1.5">
                    {isAvailable && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleToggleTableStatus(tbl.id, 'Đang phục vụ')}
                          className="press-btn py-1.5 bg-[#124874] text-white font-cinzel text-[10px] font-bold hover:bg-[#CF373D] transition-colors cursor-pointer"
                        >
                          XẾP KHÁCH
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleTableStatus(tbl.id, 'Đã đặt chỗ')}
                          className="press-btn py-1.5 bg-white border border-[#124874] text-[#124874] font-cinzel text-[10px] font-bold hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                        >
                          GIỮ CHỖ
                        </button>
                      </>
                    )}

                    {isOccupied && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleToggleTableStatus(tbl.id, 'Trống')}
                          className="press-btn py-1.5 bg-emerald-800 text-white font-cinzel text-[10px] font-bold hover:bg-emerald-900 transition-colors cursor-pointer"
                        >
                          TRẢ BÀN
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            addToast(`Đã in phiếu kiểm kê bàn ${tbl.name}`, 'info');
                          }}
                          className="press-btn py-1.5 bg-white border border-[#CF373D] text-[#CF373D] font-cinzel text-[10px] font-bold hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          IN TẠM TÍNH
                        </button>
                      </>
                    )}

                    {isReserved && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleToggleTableStatus(tbl.id, 'Đang phục vụ')}
                          className="press-btn py-1.5 bg-indigo-800 text-white font-cinzel text-[10px] font-bold hover:bg-[#124874] transition-colors cursor-pointer"
                        >
                          ĐÓN KHÁCH
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleTableStatus(tbl.id, 'Trống')}
                          className="press-btn py-1.5 bg-white border border-gray-400 text-gray-700 font-cinzel text-[10px] font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          HỦY GIỮ BÀN
                        </button>
                      </>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Reservation Edit / Create Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingReservation(null);
        }}
        onSave={handleSaveReservation}
        editingReservation={editingReservation}
      />

    </div>
  );
};

export default ReservationsView;
