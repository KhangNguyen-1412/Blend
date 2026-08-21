import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/common/SectionHeader';
import SupplierModal from '../components/suppliers/SupplierModal';
import Pagination from '../components/common/Pagination';
import { suppliersApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export const SuppliersView = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const { addToast } = useToast();

  const categoryTabs = [
    'Tất cả',
    'Hạt cà phê đặc sản',
    'Sữa tươi & Chế phẩm',
    'Trà & Thảo mộc',
    'Siro & Topping',
    'Bao bì & Ly tách',
    'Thiết bị & Phụ tùng'
  ];

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeCategory !== 'Tất cả') params.category = activeCategory;
      const res = await suppliersApi.getAll(params);
      if (res.success) {
        setSuppliers(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Lỗi khi tải danh sách nhà cung cấp', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [activeCategory]);

  const handleSaveSupplier = async (formData) => {
    try {
      if (editingSupplier) {
        await suppliersApi.update(editingSupplier.id, formData);
        addToast('Đã lưu cập nhật thông tin đối tác cung ứng!', 'success');
      } else {
        await suppliersApi.create(formData);
        addToast('Đã ghi danh nhà cung cấp mới vào danh bộ đối tác!', 'success');
      }
      setIsModalOpen(false);
      setEditingSupplier(null);
      fetchSuppliers();
    } catch (err) {
      addToast(err.message || 'Lỗi khi lưu thông tin đối tác', 'error');
    }
  };

  const handleDeleteSupplier = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa hồ sơ đối tác "${name}" khỏi danh bộ?`)) return;
    try {
      await suppliersApi.delete(id);
      addToast(`Đã thu hồi hồ sơ đối tác ${name}`, 'success');
      fetchSuppliers();
    } catch (err) {
      addToast(err.message || 'Không thể xóa hồ sơ đối tác', 'error');
    }
  };

  const filteredSuppliers = suppliers.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(term) ||
      (s.code && s.code.toLowerCase().includes(term)) ||
      (s.phone && s.phone.includes(term)) ||
      (s.contact_person && s.contact_person.toLowerCase().includes(term)) ||
      (s.category && s.category.toLowerCase().includes(term))
    );
  });

  // Calculate Quick Stats
  const activeCount = suppliers.filter(s => s.status === 'Đang hợp tác').length;
  const categoriesCount = new Set(suppliers.map(s => s.category)).size;

  return (
    <div className="font-body animate-editorial-in text-[#161413] space-y-6">
      {/* Editorial Header */}
      <SectionHeader 
        sectionNo="MỤC X &bull; DANH BỘ ĐỐI TÁC & NHÀ CUNG CẤP" 
        title="Quản Lý Nhà Cung Cấp & Nguồn Nguyên Vật Liệu" 
        subtitle="Quản lý hồ sơ đối tác nông trại cà phê, nhà máy sữa, công ty trà thảo mộc, vật tư bao bì và theo dõi công nợ nhập hàng." 
        action={
          <button 
            onClick={() => {
              setEditingSupplier(null);
              setIsModalOpen(true);
            }}
            style={{ backgroundColor: '#124874', color: '#ffffff' }}
            className="press-btn px-5 py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <i className="fa-solid fa-truck-field"></i> + KHAI BÁO NHÀ CUNG CẤP
          </button>
        }
      />

      {/* Quick Summary Stat Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="editorial-card-press p-4 bg-white border border-[#124874] text-center">
          <span className="font-mono text-2xl font-black text-[#124874] block">{suppliers.length}</span>
          <span className="font-cinzel text-[9px] uppercase tracking-widest text-[#6E675F] font-bold">TỔNG ĐỐI TÁC</span>
        </div>
        <div className="editorial-card-press p-4 bg-white border border-[#124874] text-center">
          <span className="font-mono text-2xl font-black text-emerald-800 block">{activeCount}</span>
          <span className="font-cinzel text-[9px] uppercase tracking-widest text-[#6E675F] font-bold">ĐANG HỢP TÁC</span>
        </div>
        <div className="editorial-card-press p-4 bg-white border border-[#124874] text-center">
          <span className="font-mono text-2xl font-black text-[#CF373D] block">{categoriesCount}</span>
          <span className="font-cinzel text-[9px] uppercase tracking-widest text-[#6E675F] font-bold">NHÓM VẬT TƯ</span>
        </div>
        <div className="editorial-card-press p-4 bg-white border border-[#124874] text-center">
          <span className="font-mono text-2xl font-black text-[#124874] block">100%</span>
          <span className="font-cinzel text-[9px] uppercase tracking-widest text-[#6E675F] font-bold">CHUẨN XUẤT XỨ</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="editorial-paper p-4 bg-brand-paperLight flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Category Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categoryTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveCategory(tab)}
              style={activeCategory === tab ? { backgroundColor: '#124874', color: '#ffffff' } : {}}
              className={`whitespace-nowrap px-3.5 py-2 font-cinzel text-xs font-bold border transition-all cursor-pointer ${
                activeCategory === tab
                  ? 'border-[#0D3656] shadow-sm'
                  : 'bg-white text-[#124874] border-[#D8D1C5] hover:bg-[#FAF7F2]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64 flex-shrink-0">
          <input
            type="text"
            placeholder="Tìm tên, mã, SĐT, người liên hệ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#124874] pl-9 pr-3.5 py-2 text-xs font-serif focus:outline-none focus:ring-1 focus:ring-[#CF373D]"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400 text-xs"></i>
        </div>
      </div>

      {/* Suppliers Table / List */}
      {loading ? (
        <div className="text-center p-12 bg-white editorial-paper">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-[#124874] mb-2"></i>
          <p className="font-serif italic text-gray-600">Đang tải danh bộ nhà cung cấp đối tác...</p>
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="text-center p-12 bg-white editorial-card-press border border-[#124874] space-y-3">
          <i className="fa-solid fa-truck-ramp-box text-4xl text-gray-300 block"></i>
          <h4 className="font-display text-xl font-bold text-[#124874]">Chưa Có Nhà Cung Cấp Nào Trong Danh Mục Này</h4>
          <p className="font-serif italic text-xs text-gray-500 max-w-md mx-auto">
            Nhấp vào nút bên dưới để khai báo các nông trại trồng cà phê, đối tác cung cấp sữa hoặc bao bì cho chuỗi Blend Roastery.
          </p>
          <button 
            onClick={() => {
              setEditingSupplier(null);
              setIsModalOpen(true);
            }}
            style={{ backgroundColor: '#124874', color: '#ffffff' }}
            className="press-btn px-5 py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors inline-flex items-center gap-2 mt-2 cursor-pointer"
          >
            <i className="fa-solid fa-plus"></i> + KHAI BÁO NHÀ CUNG CẤP ĐẦU TIÊN
          </button>
        </div>
      ) : (
        <div className="editorial-card-press overflow-hidden bg-white border border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.9)]">
          <div className="editorial-table-scroll">
            <table className="w-full text-left border-collapse font-body">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#124874] text-white font-cinzel text-xs uppercase tracking-wider border-b-2 border-[#0D3656]">
                  <th className="p-3.5 w-24">MÃ ĐỐI TÁC</th>
                  <th className="p-3.5">NHÀ CUNG CẤP &amp; NÔNG TRẠI</th>
                  <th className="p-3.5">NHÓM CUNG ỨNG</th>
                  <th className="p-3.5">LIÊN HỆ ĐẶT HÀNG</th>
                  <th className="p-3.5">ĐỊA CHỈ NÔNG TRẠI / KHO</th>
                  <th className="p-3.5 text-center">TRẠNG THÁI</th>
                  <th className="p-3.5 text-right">CÔNG NỢ</th>
                  <th className="p-3.5 text-center w-28">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D1C5]">
                {filteredSuppliers
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((s) => (
                  <tr key={s.id} className="hover:bg-[#FAF7F2] transition-colors">
                    {/* Supplier Code */}
                    <td className="p-3.5 font-mono font-bold text-xs text-[#CF373D] whitespace-nowrap">
                      #{s.code || `NCC-${s.id}`}
                    </td>

                    {/* Supplier Name & Representative */}
                    <td className="p-3.5">
                      <p className="font-serif font-bold text-base text-[#124874]">{s.name}</p>
                      {s.contact_person && (
                        <span className="font-serif italic text-xs text-gray-600 block mt-0.5">
                          Đại diện: {s.contact_person}
                        </span>
                      )}
                      {s.notes && (
                        <span className="font-mono text-[10px] text-gray-500 truncate max-w-xs block mt-0.5" title={s.notes}>
                          Ghi chú: {s.notes}
                        </span>
                      )}
                    </td>

                    {/* Category Pill */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-[#FAF7F2] border border-[#D8D1C5] font-serif text-xs font-bold text-[#124874]">
                        {s.category}
                      </span>
                    </td>

                    {/* Contact Info */}
                    <td className="p-3.5 font-mono text-xs text-gray-800 whitespace-nowrap">
                      <p className="font-bold text-[#124874]">
                        <i className="fa-solid fa-phone mr-1.5 text-[#CF373D]"></i>{s.phone}
                      </p>
                      {s.email && (
                        <p className="text-gray-500 mt-0.5 text-[11px]">
                          <i className="fa-regular fa-envelope mr-1.5 text-gray-400"></i>{s.email}
                        </p>
                      )}
                    </td>

                    {/* Farm/Warehouse Address */}
                    <td className="p-3.5 font-serif text-xs text-gray-700 max-w-xs truncate" title={s.address}>
                      {s.address || '—'}
                    </td>

                    {/* Status Ink Stamp */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span className={`ink-stamp text-[10px] ${
                        s.status === 'Đang hợp tác'
                          ? 'stamp-navy border-emerald-800 text-emerald-900 bg-emerald-50'
                          : s.status === 'Tạm dừng'
                          ? 'stamp-amber'
                          : 'stamp-jasper'
                      }`}>
                        {s.status}
                      </span>
                    </td>

                    {/* Current Debt */}
                    <td className="p-3.5 text-right font-mono font-bold text-sm text-[#CF373D] whitespace-nowrap">
                      {s.debt || '0đ'}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-center whitespace-nowrap space-x-1.5">
                      <button 
                        onClick={() => {
                          setEditingSupplier(s);
                          setIsModalOpen(true);
                        }}
                        className="press-btn px-2.5 py-1 bg-white text-[#124874] font-cinzel text-xs font-bold hover:bg-[#124874] hover:text-white transition-colors border border-[#124874] cursor-pointer"
                        title="Hiệu chỉnh thông tin đối tác"
                      >
                        SỬA
                      </button>
                      <button 
                        onClick={() => handleDeleteSupplier(s.id, s.name)}
                        className="press-btn px-2.5 py-1 bg-white text-[#CF373D] font-cinzel text-xs font-bold hover:bg-[#CF373D] hover:text-white transition-colors border border-[#CF373D] cursor-pointer"
                        title="Thu hồi hồ sơ đối tác"
                      >
                        XÓA
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredSuppliers.length / itemsPerPage) || 1}
            totalItems={filteredSuppliers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemsPerPageOptions={[5, 10, 15, 20, 50]}
          />
        </div>
      )}

      {/* Supplier Modal */}
      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSupplier(null);
        }}
        onSave={handleSaveSupplier}
        editingSupplier={editingSupplier}
      />
    </div>
  );
};

export default SuppliersView;
