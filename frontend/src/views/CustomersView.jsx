import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/common/SectionHeader';
import Pagination from '../components/common/Pagination';
import { customersApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export const CustomersView = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { addToast } = useToast();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await customersApi.getAll();
      if (res.success) {
        setCustomers(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Lỗi tải danh sách khách hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa hồ sơ khách hàng "${name}" khỏi hệ thống?`)) return;
    try {
      await customersApi.delete(id);
      addToast(`Đã xóa khách hàng ${name}`, 'success');
      fetchCustomers();
    } catch (err) {
      addToast(err.message || 'Không thể xóa khách hàng', 'error');
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone && c.phone.includes(searchTerm)) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="font-body animate-editorial-in text-brand-dark space-y-6">
      <SectionHeader 
        sectionNo="MỤC V &bull; SỔ HỘI VIÊN & KHÁCH QUÝ" 
        title="Danh Bộ Khách Thân Thiết & Hạng Thành Viên" 
        subtitle="Dữ liệu hội viên được tự động tích lũy khi khách hàng thực tế đăng ký tài khoản và mua đồ uống tại quán." 
        action={
          <div className="flex items-center gap-2">
            <span className="ink-stamp stamp-cerulean text-xs font-bold">
              <i className="fa-solid fa-users mr-1"></i> TỔNG HỘI VIÊN: {customers.length}
            </span>
          </div>
        }
      />

      {/* Search Toolbar */}
      <div className="editorial-paper p-3.5 bg-brand-paperLight flex justify-between items-center">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#124874] pl-9 pr-4 py-2 text-xs font-serif focus:outline-none focus:ring-1 focus:ring-[#CF373D]"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400 text-xs"></i>
        </div>
        <span className="font-serif italic text-xs text-gray-500 hidden sm:inline">
          Dữ liệu ghi nhận tự động từ tài khoản khách thực tế
        </span>
      </div>
      
      <div className="editorial-card-press overflow-hidden bg-white border border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.9)]">
        <div className="editorial-table-scroll">
          <table className="w-full text-left border-collapse font-body">
            <thead className="sticky top-0 z-10">
              <tr className="bg-cerulean text-white font-cinzel text-xs uppercase tracking-wider border-b-2 border-cerulean-dark">
                <th className="p-4 w-20">SỐ THẺ</th>
                <th className="p-4">HỌ TÊN KHÁCH QUÝ</th>
                <th className="p-4">THÔNG TIN LIÊN LẠC</th>
                <th className="p-4 text-center">HẠNG HỘI VIÊN</th>
                <th className="p-4 text-right">TỔNG TÍCH LŨY</th>
                <th className="p-4 text-center w-24">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-borderLight">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500 font-serif italic">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i> Đang tải sổ bộ hội viên...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-500 font-serif italic space-y-2">
                    <i className="fa-solid fa-address-book text-3xl text-gray-300 block"></i>
                    <p className="text-base text-gray-700">Chưa có hồ sơ hội viên nào được ghi nhận.</p>
                    <p className="text-xs text-gray-500">
                      Hồ sơ khách hàng sẽ tự động xuất hiện tại đây ngay khi có người dùng đăng ký tài khoản mới trên hệ thống.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((c) => (
                  <tr key={c.id} className="hover:bg-brand-paper/60 transition-colors">
                    {/* Card Number */}
                    <td className="p-4 font-mono font-bold text-xs text-jasper">
                      #{String(c.id).padStart(4, '0')}
                    </td>

                    {/* Customer Name */}
                    <td className="p-4">
                      <p className="font-serif text-lg font-bold text-cerulean">{c.name}</p>
                      <span className="font-cinzel text-[10px] text-gray-400 uppercase tracking-widest block">
                        PATRON MEMBER
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="p-4 text-sm font-mono text-gray-700">
                      <p className="font-bold"><i className="fa-solid fa-phone text-xs text-brand-muted mr-1.5"></i>{c.phone || '—'}</p>
                      {c.email && (
                        <p className="text-xs text-gray-500 mt-0.5"><i className="fa-regular fa-envelope text-xs text-brand-muted mr-1.5"></i>{c.email}</p>
                      )}
                    </td>

                    {/* Tier Wax Seal Stamp */}
                    <td className="p-4 text-center">
                      <span className={`ink-stamp text-[10px] ${
                        c.tier === 'Kim Cương'
                          ? 'stamp-navy border-purple-800 text-purple-900 bg-purple-50'
                          : c.tier === 'Vàng'
                          ? 'stamp-amber'
                          : c.tier === 'Bạc'
                          ? 'stamp-muted'
                          : 'stamp-muted text-amber-900 border-amber-800'
                      }`}>
                        <i className="fa-solid fa-crown text-[9px] mr-1"></i>
                        {c.tier ? c.tier.toUpperCase() : 'ĐỒNG'}
                      </span>
                    </td>

                    {/* Spent */}
                    <td className="p-4 text-right">
                      <span className="font-mono text-base font-bold text-cerulean">
                        {c.spent || '0đ'}
                      </span>
                    </td>

                    {/* Actions: Clean View / Delete only */}
                    <td className="p-4 text-center whitespace-nowrap">
                      <button 
                        onClick={() => handleDeleteCustomer(c.id, c.name)}
                        className="press-btn px-2.5 py-1 bg-white text-jasper font-cinzel text-xs font-bold hover:bg-jasper hover:text-white transition-colors border border-jasper"
                        title="Thu hồi hồ sơ khách hàng"
                      >
                        <i className="fa-solid fa-trash-can mr-1"></i> XÓA
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredCustomers.length / itemsPerPage) || 1}
          totalItems={filteredCustomers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          itemsPerPageOptions={[5, 10, 15, 20, 50]}
        />
      </div>
    </div>
  );
};

export default CustomersView;
