import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/common/SectionHeader';
import StatusBadge from '../components/common/StatusBadge';
import StaffModal from '../components/staff/StaffModal';
import Pagination from '../components/common/Pagination';
import { staffApi } from '../services/api';
import { firestoreStaff } from '../services/firestoreService';
import { useToast } from '../context/ToastContext';

export const StaffView = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const { addToast } = useToast();

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await staffApi.getAll();
      if (res.success) {
        setStaff(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Lỗi tải danh sách nhân sự', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSaveStaff = async (formData) => {
    try {
      if (editingStaff) {
        await staffApi.update(editingStaff.id, formData);
        await firestoreStaff.update(editingStaff.id, formData);
        addToast('Đã lưu phân quyền nhân sự & đồng bộ Firestore!', 'success');
      } else {
        const res = await staffApi.create(formData);
        const newStaffData = res?.data || formData;
        await firestoreStaff.create(newStaffData);
        addToast('Đã cấp tài khoản nhân sự mới và đồng bộ Firestore thành công!', 'success');
      }
      setIsModalOpen(false);
      setEditingStaff(null);
      fetchStaff();
    } catch (err) {
      addToast(err.message || 'Lỗi khi lưu nhân viên', 'error');
    }
  };

  const handleDeleteStaff = async (id, name) => {
    if (!window.confirm(`Xác nhận thu hồi tài khoản của nhân viên "${name}"?`)) return;
    try {
      await staffApi.delete(id);
      await firestoreStaff.delete(id);
      addToast(`Đã thu hồi quyền nhân viên ${name}`, 'success');
      fetchStaff();
    } catch (err) {
      addToast(err.message || 'Không thể xóa tài khoản', 'error');
    }
  };

  const formatStaffFullNameWithRole = (name, role) => {
    if (!name) return '';
    const cleanName = name.replace(/\s*\(.*?\)\s*/g, '').trim() || name;
    return role ? `${cleanName} (${role})` : cleanName;
  };

  return (
    <div className="font-body animate-editorial-in text-brand-dark space-y-6">
      <SectionHeader 
        sectionNo="MỤC VII &bull; DANH BỘ NHÂN SỰ & QUYỀN TRUY CẬP" 
        title="Nhân Sự Phân Ca & Quản Trị Hệ Thống" 
        subtitle="Quản lý danh sách nhân sự tại các ca làm việc, phân quyền chức danh quản lý, thu ngân và quầy pha chế." 
        action={
          <button 
            onClick={() => {
              setEditingStaff(null);
              setIsModalOpen(true);
            }}
            className="press-btn px-5 py-2.5 bg-cerulean text-white font-cinzel text-xs font-bold hover:bg-jasper transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-user-gear"></i> CẤP TÀI KHOẢN MỚI
          </button>
        }
      />
      
      <div className="editorial-card-press overflow-hidden bg-white border border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.9)]">
        <div className="editorial-table-scroll">
          <table className="w-full text-left border-collapse font-body">
            <thead className="sticky top-0 z-10">
              <tr className="bg-cerulean text-white font-cinzel text-xs uppercase tracking-wider border-b-2 border-cerulean-dark">
                <th className="p-4 w-20">MÃ SỐ</th>
                <th className="p-4">HỌ VÀ TÊN NHÂN VIÊN</th>
                <th className="p-4">TÊN ĐĂNG NHẬP</th>
                <th className="p-4 text-center">VAI TRÒ (ROLE)</th>
                <th className="p-4 text-center">TÌNH TRẠNG</th>
                <th className="p-4 text-right">PHÂN QUYỀN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-borderLight">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500 font-serif italic">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i> Đang tải danh bộ nhân sự...
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500 font-serif italic">
                    Chưa có nhân sự nào trong danh bộ.
                  </td>
                </tr>
              ) : (
                staff
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((s) => (
                  <tr 
                    key={s.id} 
                    className={`hover:bg-brand-paper/60 transition-colors ${
                      s.status === 'Nghỉ việc' ? 'bg-brand-paperDark/40 text-gray-400' : ''
                    }`}
                  >
                    {/* Staff ID */}
                    <td className="p-4 font-mono font-bold text-xs text-jasper">
                      #{String(s.id).padStart(3, '0')}
                    </td>

                    {/* Staff Name with Role */}
                    <td className="p-4">
                      <p className="font-serif text-lg font-bold text-cerulean">
                        {formatStaffFullNameWithRole(s.name, s.role)}
                      </p>
                      <span className="font-cinzel text-[10px] text-gray-400 uppercase tracking-widest block">
                        GUILD PERSONNEL
                      </span>
                    </td>

                    {/* Username */}
                    <td className="p-4 font-mono text-sm text-cerulean font-bold">
                      @{s.username}
                    </td>

                    {/* Role Stamp */}
                    <td className="p-4 text-center">
                      <span className={`ink-stamp text-[10px] ${
                        s.role === 'Quản lý'
                          ? 'stamp-jasper'
                          : s.role === 'Thu ngân'
                          ? 'stamp-cerulean'
                          : s.role === 'Pha chế'
                          ? 'stamp-amber'
                          : 'stamp-muted'
                      }`}>
                        {s.role.toUpperCase()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4 text-center">
                      <StatusBadge status={s.status} />
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right whitespace-nowrap">
                      <button 
                        onClick={() => {
                          setEditingStaff(s);
                          setIsModalOpen(true);
                        }}
                        className="press-btn px-3 py-1 bg-white text-cerulean font-cinzel text-xs font-bold hover:bg-cerulean hover:text-white mr-2"
                      >
                        <i className="fa-solid fa-key mr-1 text-jasper"></i> PHÂN QUYỀN
                      </button>
                      <button 
                        onClick={() => handleDeleteStaff(s.id, s.name)}
                        className="press-btn px-2.5 py-1 bg-white text-jasper font-cinzel text-xs font-bold hover:bg-jasper hover:text-white"
                      >
                        <i className="fa-solid fa-trash-can"></i>
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
          totalPages={Math.ceil(staff.length / itemsPerPage) || 1}
          totalItems={staff.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          itemsPerPageOptions={[5, 8, 10, 15, 20]}
        />
      </div>

      <StaffModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStaff(null);
        }}
        onSave={handleSaveStaff}
        editingStaff={editingStaff}
        existingStaffList={staff}
      />
    </div>
  );
};

export default StaffView;
