import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/common/SectionHeader';
import InventoryModal from '../components/inventory/InventoryModal';
import Pagination from '../components/common/Pagination';
import { inventoryApi, reportsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const InventoryView = () => {
  const [invTab, setInvTab] = useState('stock'); // 'stock' | 'import' | 'recipe'
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Search & Filter & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'warning' | 'ok'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { addToast } = useToast();
  const { user } = useAuth();

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getAll();
      if (res.success) {
        setInventory(res.data || []);
      }
    } catch (err) {
      addToast(err.message || 'Lỗi khi tải sổ kiểm kê kho', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSaveItem = async (formData) => {
    try {
      if (editingItem) {
        await inventoryApi.update(editingItem.id, formData);
        addToast('Đã ghi nhận điều chỉnh sổ kho vật tư!', 'success');
      } else {
        await inventoryApi.create(formData);
        addToast('Đã ghi danh nguyên vật liệu mới vào sổ kho!', 'success');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchInventory();
    } catch (err) {
      addToast(err.message || 'Không thể cập nhật sổ kho', 'error');
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (!window.confirm(`Xác nhận gạch bỏ nguyên liệu "${name}" khỏi sổ kho?`)) return;
    try {
      await inventoryApi.delete(id);
      addToast(`Đã xóa nguyên liệu "${name}"`, 'success');
      fetchInventory();
    } catch (err) {
      addToast(err.message || 'Lỗi khi xóa nguyên liệu', 'error');
    }
  };

  const handleQuickStockIn = async (item, addQty = 10) => {
    try {
      const newQty = (parseFloat(item.qty) || 0) + addQty;
      const newStatus = newQty >= item.min ? 'ok' : 'warning';
      await inventoryApi.update(item.id, { qty: newQty, status: newStatus });
      addToast(`Đã nhập bổ sung +${addQty} ${item.unit} cho "${item.name}"!`, 'success');
      fetchInventory();
    } catch (err) {
      addToast('Lỗi khi nhập thêm hàng', 'error');
    }
  };

  const handleExportInventoryExcel = () => {
    const url = reportsApi.getExcelExportUrl('inventory');
    window.open(url, '_blank');
    addToast('Đang kết xuất Sổ Kho Nguyên Liệu (.xls) màu thương hiệu...', 'success');
  };

  // Filtered Items
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.id).includes(searchTerm) ||
      item.unit.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalItems = inventory.length;
  const warningItems = inventory.filter((i) => i.status === 'warning').length;
  const safeItems = inventory.filter((i) => i.status !== 'warning').length;

  const [dockets, setDockets] = useState([]);
  const [docketsLoading, setDocketsLoading] = useState(false);

  const fetchDockets = async () => {
    try {
      setDocketsLoading(true);
      const res = await inventoryApi.getDockets();
      if (res.success) {
        setDockets(res.data || []);
      }
    } catch {
      // Background load
    } finally {
      setDocketsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchDockets();
  }, []);

  const handleCreateNewDocket = async () => {
    const type = window.prompt('Nhập loại biên bản ("NHẬP KHO" hoặc "XUẤT QUẦY"):', 'NHẬP KHO');
    if (!type) return;
    const itemName = window.prompt('Nhập tên nguyên liệu (vd: Hạt Arabica Cầu Đất):');
    if (!itemName) return;
    const qty = window.prompt('Nhập số lượng (vd: +20 kg hoặc -5 hộp):', '+20 kg');
    if (!qty) return;
    const source = window.prompt('Nguồn gốc / Điểm đến (vd: Đồi chè Bảo Lộc):', 'Kho Tổng Sài Gòn');
    if (!source) return;

    try {
      await inventoryApi.createDocket({
        type: type.toUpperCase(),
        item_name: itemName,
        qty,
        source,
        date: new Date().toLocaleDateString('vi-VN'),
        clerk: user?.name || 'Đặng Gia Bảo'
      });
      addToast('Đã lập và lưu biên bản kho thành công!', 'success');
      fetchDockets();
    } catch (err) {
      addToast('Không thể lập biên bản kho', 'error');
    }
  };

  return (
    <div className="font-body animate-editorial-in text-[#161413] space-y-6">
      
      {/* 1. Broadsheet Section Header */}
      <SectionHeader 
        sectionNo="MỤC IV &bull; SỔ ĐIỀU PHỐI KHO HÀNG &amp; NGUYÊN VẬT LIỆU" 
        title="Trạm Điều Phối &amp; Kiểm Kê Kho Vật Tư" 
        subtitle="Không gian nghiệp vụ chuyên trách dành cho Thủ Kho: Giám sát định mức dự trữ, lập phiếu nhập xuất và đối soát tồn kho." 
        action={
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleExportInventoryExcel}
              className="press-btn px-3.5 py-2 bg-white border border-[#124874] text-[#124874] font-cinzel text-xs font-bold hover:bg-[#124874] hover:text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Xuất file Excel sổ kho"
            >
              <i className="fa-solid fa-file-excel"></i>
              <span>XUẤT SỔ KHO EXCEL</span>
            </button>
            <button 
              onClick={() => window.print()}
              className="press-btn px-3.5 py-2 bg-white border border-[#124874] text-[#124874] font-cinzel text-xs font-bold hover:bg-[#124874] hover:text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="In bản kê kiểm kho A4"
            >
              <i className="fa-solid fa-print"></i>
              <span>IN BẢN KÊ</span>
            </button>
            <button 
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              style={{ backgroundColor: '#124874', color: '#ffffff' }}
              className="press-btn px-5 py-2 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <i className="fa-solid fa-boxes-packing"></i>
              <span>+ GHI DANH NGUYÊN LIỆU MỚI</span>
            </button>
          </div>
        }
      />

      {/* 2. 4 Broadsheet Metric Ribbon Cards (Strictly Cerulean & Jasper) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total SKUs (Cerulean #124874) */}
        <div className="editorial-card-press bg-white p-5 border-2 border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.95)]">
          <div className="flex justify-between items-start mb-2">
            <span className="font-cinzel text-[10px] font-bold text-[#124874] uppercase tracking-wider">
              TỔNG CHỦNG LOẠI NVL
            </span>
            <i className="fa-solid fa-boxes-stacked text-[#124874] text-sm"></i>
          </div>
          <p className="font-display text-3xl font-bold text-[#124874]">
            {totalItems} <span className="text-xs font-serif font-normal text-gray-500">mã vật tư</span>
          </p>
          <span className="font-serif italic text-xs text-[#6E675F] block mt-1">
            Đang quản lý trong sổ kho
          </span>
        </div>

        {/* Card 2: Warning Stock (Jasper Red #CF373D) */}
        <div className="editorial-card-press p-5 bg-[#FCFAF6] border-2 border-[#CF373D] shadow-[4px_4px_0px_rgba(207,55,61,0.95)]">
          <div className="flex justify-between items-start mb-2">
            <span className="font-cinzel text-[10px] font-bold text-[#CF373D] uppercase tracking-wider">
              CẢNH BÁO CHẠM ĐÁY
            </span>
            <i className="fa-solid fa-triangle-exclamation text-[#CF373D] text-sm"></i>
          </div>
          <p className="font-display text-3xl font-bold text-[#CF373D]">
            {warningItems} <span className="text-xs font-serif font-normal text-gray-500">mặt hàng</span>
          </p>
          <span className="font-serif italic text-xs text-[#6E675F] block mt-1">
            Dưới định mức &bull; Cần nhập ngay
          </span>
        </div>

        {/* Card 3: Safe Stock (Cerulean #124874) */}
        <div className="editorial-card-press bg-white p-5 border-2 border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.95)]">
          <div className="flex justify-between items-start mb-2">
            <span className="font-cinzel text-[10px] font-bold text-[#124874] uppercase tracking-wider">
              ĐẠT CHUẨN AN TOÀN
            </span>
            <i className="fa-solid fa-circle-check text-[#124874] text-sm"></i>
          </div>
          <p className="font-display text-3xl font-bold text-[#124874]">
            {safeItems} <span className="text-xs font-serif font-normal text-gray-500">mặt hàng</span>
          </p>
          <span className="font-serif italic text-xs text-[#6E675F] block mt-1">
            Đủ dự trữ phục vụ pha chế
          </span>
        </div>

        {/* Card 4: Warehouse Controller Info */}
        <div className="editorial-card-press bg-white p-5 border-2 border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.95)]">
          <div className="flex justify-between items-start mb-2">
            <span className="font-cinzel text-[10px] font-bold text-[#124874] uppercase tracking-wider">
              THỦ KHO PHỤ TRÁCH
            </span>
            <i className="fa-solid fa-warehouse text-[#124874] text-sm"></i>
          </div>
          <p className="font-display text-xl font-bold text-[#124874] truncate">
            {user?.name || 'Đặng Gia Bảo'}
          </p>
          <span className="font-serif italic text-xs text-[#6E675F] block mt-1">
            Kho: Saigon Central Pantry Hub
          </span>
        </div>

      </div>
      
      {/* 3. Pantry Ledger Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b-2 border-[#124874] pb-2">
        <button 
          onClick={() => setInvTab('stock')} 
          className={`font-cinzel text-xs font-bold px-4 py-2 transition-all border cursor-pointer ${
            invTab === 'stock' 
              ? 'bg-[#124874] text-white border-[#124874] shadow-xs' 
              : 'text-[#124874] bg-white border-[#D8D1C5] hover:bg-[#FAF7F2]'
          }`}
        >
          I. SỔ KIỂM KÊ TỒN KHO &amp; ĐỊNH MỨC ({totalItems})
        </button>
        <button 
          onClick={() => setInvTab('import')} 
          className={`font-cinzel text-xs font-bold px-4 py-2 transition-all border cursor-pointer ${
            invTab === 'import' 
              ? 'bg-[#124874] text-white border-[#124874] shadow-xs' 
              : 'text-[#124874] bg-white border-[#D8D1C5] hover:bg-[#FAF7F2]'
          }`}
        >
          II. BIÊN BẢN NHẬP &amp; XUẤT ĐIỀU PHỐI
        </button>
        <button 
          onClick={() => setInvTab('recipe')} 
          className={`font-cinzel text-xs font-bold px-4 py-2 transition-all border cursor-pointer ${
            invTab === 'recipe' 
              ? 'bg-[#124874] text-white border-[#124874] shadow-xs' 
              : 'text-[#124874] bg-white border-[#D8D1C5] hover:bg-[#FAF7F2]'
          }`}
        >
          III. MA TRẬN ĐỊNH LƯỢNG CÔNG THỨC (RECIPE)
        </button>
      </div>

      {/* =========================================================================
          TAB 1: SỔ KIỂM KÊ TỒN KHO THỰC TẾ
          ========================================================================= */}
      {invTab === 'stock' && (
        <div className="space-y-4">
          
          {/* Search & Filter Strip */}
          <div className="bg-white p-4 border-2 border-[#124874] shadow-xs flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm mã NVL, tên nguyên liệu (Arabica, Oolong, Bơ Pháp, Sữa tươi...)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#124874] pl-9 pr-4 py-2 font-body text-xs text-[#161413] focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-[#124874] text-xs"></i>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-cinzel font-bold text-[#124874] text-[11px] uppercase hidden lg:inline">
                Tình trạng:
              </span>
              {[
                { id: 'all', label: 'TẤT CẢ' },
                { id: 'warning', label: `CẦN NHẬP GẤP (${warningItems})` },
                { id: 'ok', label: 'ĐỦ ĐỊNH MỨC' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStatusFilter(s.id)}
                  className={`px-3 py-1.5 font-cinzel text-[11px] font-bold transition-colors border cursor-pointer ${
                    statusFilter === s.id
                      ? s.id === 'warning'
                        ? 'bg-[#CF373D] text-white border-[#CF373D]'
                        : 'bg-[#124874] text-white border-[#124874]'
                      : 'bg-[#FAF7F2] text-[#124874] border-[#D8D1C5] hover:border-[#124874]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Inventory Ledger Table with Scrollbar and Pagination */}
          <div className="editorial-card-press overflow-hidden bg-white border-2 border-[#124874] shadow-[6px_6px_0px_rgba(18,72,116,0.95)]">
            <div className="editorial-table-scroll">
              <table className="w-full text-left border-collapse font-body text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#124874] text-white font-cinzel text-[11px] border-b-2 border-[#0D3656] tracking-wider">
                    <th className="py-3.5 px-4 w-20">MÃ NVL</th>
                    <th className="py-3.5 px-4">TÊN NGUYÊN VẬT LIỆU</th>
                    <th className="py-3.5 px-4 text-center">ĐƠN VỊ TÍNH</th>
                    <th className="py-3.5 px-4 text-center">TỒN THỰC TẾ</th>
                    <th className="py-3.5 px-4 text-center">ĐỊNH MỨC AN TOÀN</th>
                    <th className="py-3.5 px-4 text-center">TÌNH TRẠNG KHO</th>
                    <th className="py-3.5 px-4 text-right">ĐIỀU PHỐI &amp; THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D1C5]">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-[#6E675F] font-serif italic">
                        <i className="fa-solid fa-spinner fa-spin text-xl mb-2 text-[#124874] block"></i>
                        Đang mở sổ kiểm kê kho vật tư...
                      </td>
                    </tr>
                  ) : filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-[#6E675F] font-serif italic">
                        <i className="fa-solid fa-box-open text-3xl mb-2 text-[#6E675F] block"></i>
                        Không tìm thấy nguyên vật liệu nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredInventory
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((item) => {
                      const isWarning = item.status === 'warning';
                      return (
                        <tr key={item.id} className="hover:bg-[#FAF7F2] transition-colors">
                          
                          {/* Item Code */}
                          <td className="py-3.5 px-4 font-mono font-bold text-[#124874]">
                            #{item.id}
                          </td>

                          {/* Item Name */}
                          <td className="py-3.5 px-4">
                            <span className="font-serif font-bold text-sm text-[#161413] block">
                              {item.name}
                            </span>
                            <span className="font-serif italic text-[10px] text-[#6E675F]">
                              Vật tư dự trữ chuẩn F&amp;B
                            </span>
                          </td>

                          {/* Unit */}
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-[#124874]">
                            {item.unit}
                          </td>

                          {/* Quantity */}
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-block font-mono text-base font-bold px-3 py-0.5 border ${
                              isWarning
                                ? 'bg-[#FCFAF6] text-[#CF373D] border-[#CF373D]'
                                : 'bg-white text-[#124874] border-[#124874]'
                            }`}>
                              {item.qty}
                            </span>
                          </td>

                          {/* Min Threshold */}
                          <td className="py-3.5 px-4 text-center font-mono text-gray-600">
                            &gt;= {item.min} {item.unit}
                          </td>

                          {/* Status Stamp */}
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-block px-2.5 py-1 font-cinzel text-[10px] font-bold uppercase tracking-wider border-2 ${
                              isWarning
                                ? 'border-[#CF373D] text-[#CF373D] bg-[#FCFAF6]'
                                : 'border-[#124874] text-[#124874] bg-[#FCFAF6]'
                            }`}>
                              {isWarning ? 'CẦN NHẬP BỔ SUNG' : 'ĐỦ ĐỊNH MỨC'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              
                              {/* Quick +10 Stock In */}
                              <button
                                type="button"
                                onClick={() => handleQuickStockIn(item, 10)}
                                className="px-2.5 py-1 bg-[#124874] text-white hover:bg-[#CF373D] font-cinzel text-[10px] font-bold transition-colors shadow-2xs cursor-pointer"
                                title={`Nhập nhanh +10 ${item.unit}`}
                              >
                                <i className="fa-solid fa-plus mr-1"></i> NHẬP +10
                              </button>

                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingItem(item);
                                  setIsModalOpen(true);
                                }}
                                className="p-1.5 bg-white hover:bg-[#124874] hover:text-white border border-[#124874] text-[#124874] transition-colors cursor-pointer"
                                title="Chỉnh sửa định mức & thông số"
                              >
                                <i className="fa-solid fa-sliders"></i>
                              </button>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item.id, item.name)}
                                className="p-1.5 bg-white hover:bg-[#CF373D] hover:text-white border border-[#CF373D] text-[#CF373D] transition-colors cursor-pointer"
                                title="Gạch bỏ nguyên liệu"
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

            {/* Stock Pagination Footer */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredInventory.length / itemsPerPage) || 1}
              totalItems={filteredInventory.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              itemsPerPageOptions={[5, 10, 15, 20, 50]}
            />
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: BIÊN BẢN NHẬP & XUẤT ĐIỀU PHỐI (IMPORT / EXPORT DOCKETS)
          ========================================================================= */}
      {invTab === 'import' && (
        <div className="space-y-4">
          <div className="editorial-card-press bg-white p-6 border-2 border-[#124874] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#124874] pb-3">
              <div>
                <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider block">
                  NHẬT KÝ LƯU VẾT NHẬP &amp; XUẤT VẬT TƯ
                </span>
                <p className="font-serif italic text-xs text-gray-500 mt-0.5">
                  Lưu trữ các chuyến hàng từ nông trại Cầu Đất, Bảo Lộc và điều phối ra quầy Barista.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCreateNewDocket}
                  style={{ backgroundColor: '#124874', color: '#ffffff' }}
                  className="press-btn px-4 py-2 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <i className="fa-solid fa-file-circle-plus"></i>
                  <span>+ LẬP PHIẾU NHẬP / XUẤT MỚI</span>
                </button>
              </div>
            </div>

            <div className="border border-[#124874] editorial-table-scroll">
              <table className="w-full text-left border-collapse font-body text-xs">
                <thead>
                  <tr className="bg-[#124874] text-white font-cinzel text-[11px] border-b border-[#0D3656]">
                    <th className="py-2.5 px-3.5">MÃ CHỨNG TỪ</th>
                    <th className="py-2.5 px-3.5">LOẠI BIÊN BẢN</th>
                    <th className="py-2.5 px-3.5">NGUYÊN VẬT LIỆU</th>
                    <th className="py-2.5 px-3.5 text-center">SỐ LƯỢNG</th>
                    <th className="py-2.5 px-3.5">NGUỒN GỐC / ĐIỂM ĐẾN</th>
                    <th className="py-2.5 px-3.5">NGÀY THỰC HIỆN</th>
                    <th className="py-2.5 px-3.5">THỦ KHO KÝ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D1C5]">
                  {docketsLoading ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500 font-serif italic">
                        <i className="fa-solid fa-spinner fa-spin mr-2 text-[#124874]"></i> Đang tải nhật ký biên bản...
                      </td>
                    </tr>
                  ) : dockets.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500 font-serif italic">
                        Chưa có biên bản nhập/xuất nào được lập.
                      </td>
                    </tr>
                  ) : (
                    dockets.map((d) => (
                      <tr key={d.id} className="hover:bg-[#FAF7F2]">
                        <td className="py-2.5 px-3.5 font-mono font-bold text-[#124874]">
                          #{d.id}
                        </td>
                        <td className="py-2.5 px-3.5">
                          <span className={`inline-block px-2 py-0.5 font-cinzel text-[9px] font-bold border ${
                            d.type === 'NHẬP KHO'
                              ? 'border-[#124874] text-[#124874] bg-[#FCFAF6]'
                              : 'border-[#CF373D] text-[#CF373D] bg-[#FCFAF6]'
                          }`}>
                            {d.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 font-serif font-bold text-[#161413]">
                          {d.item_name || d.item}
                        </td>
                        <td className="py-2.5 px-3.5 text-center font-mono font-bold text-sm text-[#124874]">
                          {d.qty}
                        </td>
                        <td className="py-2.5 px-3.5 font-serif text-gray-700">
                          {d.source}
                        </td>
                        <td className="py-2.5 px-3.5 font-mono text-gray-600">
                          {d.date}
                        </td>
                        <td className="py-2.5 px-3.5 font-serif font-bold text-[#124874]">
                          {d.clerk}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: MA TRẬN ĐỊNH LƯỢNG RECIPE & LIÊN KẾT PHA CHẾ
          ========================================================================= */}
      {invTab === 'recipe' && (
        <div className="editorial-card-press bg-white p-8 border-2 border-[#124874] shadow-xs space-y-6">
          <div className="border-b border-[#124874] pb-4 flex justify-between items-center">
            <div>
              <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider block">
                CƠ CHẾ TRỪ TỰ ĐỘNG THEO CÔNG THỨC MÓN
              </span>
              <p className="font-serif italic text-xs text-gray-600 mt-0.5">
                Khi thu ngân / pha chế xuất bill hoàn tất đơn hàng, hệ thống tự động trừ kho theo tỷ lệ định lượng bên dưới:
              </p>
            </div>
            <span className="font-cinzel text-xs font-bold text-[#CF373D] bg-[#FCFAF6] px-3 py-1 border border-[#CF373D]">
              AUTO-SYNC 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-serif text-xs">
            <div className="p-4 bg-[#FAF7F2] border border-[#124874] space-y-2">
              <span className="font-cinzel text-xs font-bold text-[#124874] block">1. CÀ PHÊ MUỐI DI SẢN</span>
              <ul className="space-y-1 text-gray-700">
                <li>&bull; Hạt Robusta Gia Lai: <strong>18g</strong></li>
                <li>&bull; Sữa đặc kem béo: <strong>25ml</strong></li>
                <li>&bull; Kem sữa muối hồng: <strong>30ml</strong></li>
              </ul>
            </div>

            <div className="p-4 bg-[#FAF7F2] border border-[#124874] space-y-2">
              <span className="font-cinzel text-xs font-bold text-[#124874] block">2. TRÀ OOLONG KEM PHÔ MAI</span>
              <ul className="space-y-1 text-gray-700">
                <li>&bull; Cốt trà Oolong Bảo Lộc: <strong>120ml</strong></li>
                <li>&bull; Đường mía tự nhiên: <strong>15ml</strong></li>
                <li>&bull; Kem Phô Mai Macchiato: <strong>40ml</strong></li>
              </ul>
            </div>

            <div className="p-4 bg-[#FAF7F2] border border-[#124874] space-y-2">
              <span className="font-cinzel text-xs font-bold text-[#124874] block">3. COLD BREW CAM VÀNG</span>
              <ul className="space-y-1 text-gray-700">
                <li>&bull; Cốt Arabica Cầu Đất ủ lạnh: <strong>150ml</strong></li>
                <li>&bull; Cam vàng tươi lát: <strong>2 lát</strong></li>
                <li>&bull; Mật ong hoa nhãn: <strong>10ml</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Creating / Editing Inventory */}
      <InventoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        editingItem={editingItem}
      />
    </div>
  );
};

export default InventoryView;
