import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import CustomSelect from '../common/CustomSelect';

export const StaffModal = ({ isOpen, onClose, onSave, editingStaff, existingStaffList = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '123456',
    role: 'Pha chế',
    status: 'Hoạt động'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isUsernameManuallyEdited, setIsUsernameManuallyEdited] = useState(false);

  // Helper to map role to clean English slug
  const getEnglishRole = (role) => {
    if (!role) return 'staff';
    const r = role.toLowerCase();
    if (r.includes('quản lý') || r.includes('admin') || r.includes('manager')) return 'manager';
    if (r.includes('thủ kho') || r.includes('kho') || r.includes('warehouse')) return 'warehouse';
    if (r.includes('thu ngân') || r.includes('cashier')) return 'cashier';
    if (r.includes('pha chế') || r.includes('barista')) return 'barista';
    if (r.includes('phục vụ') || r.includes('waiter') || r.includes('floor')) return 'staff';
    return 'staff';
  };

  // Helper to generate username: [tên không dấu] + [họ và tên lót viết tắt]_[vai trò bằng tiếng anh]
  // E.g. "Huỳnh Thiên Vũ Nhân" + "Thu ngân" => "nhanhtv_cashier"
  const generateSuggestedUsername = (fullName, role) => {
    if (!fullName) return '';
    const clean = fullName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
    
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    
    const roleEn = getEnglishRole(role);
    
    if (parts.length === 1) {
      return `${parts[0]}_${roleEn}`;
    }
    
    const lastName = parts[parts.length - 1]; // Tên chính (không dấu)
    const initials = parts.slice(0, -1).map(p => p[0]).join(''); // Họ và tên lót viết tắt
    return `${lastName}${initials}_${roleEn}`;
  };

  useEffect(() => {
    if (editingStaff) {
      const cleanName = (editingStaff.name || '').replace(/\s*\(.*?\)\s*/g, '').trim() || editingStaff.name;
      setFormData({
        ...editingStaff,
        name: cleanName,
        password: editingStaff.password || '123456'
      });
      setIsUsernameManuallyEdited(true);
    } else {
      setFormData({
        name: '',
        username: '',
        password: '123456',
        role: 'Pha chế',
        status: 'Hoạt động'
      });
      setIsUsernameManuallyEdited(false);
    }
  }, [editingStaff, isOpen]);

  // When name changes, if username was not manually customized, auto-generate it
  const handleNameChange = (e) => {
    const newName = e.target.value;
    if (!isUsernameManuallyEdited && !editingStaff) {
      const suggested = generateSuggestedUsername(newName, formData.role);
      setFormData(prev => ({
        ...prev,
        name: newName,
        username: suggested
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        name: newName
      }));
    }
  };

  // When role changes, also update suggested username if not manually edited
  const handleRoleChange = (newRole) => {
    if (!isUsernameManuallyEdited && !editingStaff) {
      const suggested = generateSuggestedUsername(formData.name, newRole);
      setFormData(prev => ({
        ...prev,
        role: newRole,
        username: suggested
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        role: newRole
      }));
    }
  };

  const handleUsernameChange = (e) => {
    setIsUsernameManuallyEdited(true);
    setFormData({
      ...formData,
      username: e.target.value.toLowerCase().replace(/\s+/g, '')
    });
  };

  // Check if username already exists in system
  const isUsernameDuplicate = Boolean(
    formData.username &&
    existingStaffList.some(
      (s) => (s.username || '').toLowerCase() === formData.username.toLowerCase() && s.id !== editingStaff?.id
    )
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUsernameDuplicate) {
      alert(`Tên đăng nhập "@${formData.username}" đã tồn tại trong hệ thống. Vui lòng chọn tên khác!`);
      return;
    }
    const cleanName = (formData.name || '').replace(/\s*\(.*?\)\s*/g, '').trim() || formData.name;
    onSave({
      ...formData,
      name: cleanName,
      password: formData.password || '123456'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingStaff ? 'Cập Nhật Phân Quyền Nhân Sự' : 'Cấp Tài Khoản & Phân Quyền Mới'}
    >
      <form onSubmit={handleSubmit} className="space-y-5 font-body">
        {/* Full Name */}
        <div>
          <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
            Họ và Tên Nhân Viên *
          </label>
          <input
            type="text"
            required
            placeholder="VD: Huỳnh Thiên Vũ Nhân hoặc Lê Thị Cẩm"
            value={formData.name}
            onChange={handleNameChange}
            className="w-full bg-white border border-[#124874] px-4 py-2.5 font-serif text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
          />
        </div>

        {/* Username */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider">
              Tên Đăng Nhập Hệ Thống (Username) *
            </label>
            {!editingStaff && formData.name && (
              <span className="font-serif italic text-[11px] text-gray-500">
                (Tự động sinh từ họ tên)
              </span>
            )}
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-gray-400 font-mono font-bold text-sm">@</span>
            <input
              type="text"
              required
              placeholder="VD: nhanhtv hoặc baodg"
              value={formData.username}
              onChange={handleUsernameChange}
              className={`w-full bg-white border pl-8 pr-4 py-2.5 font-mono text-sm font-bold focus:outline-none focus:ring-2 ${
                isUsernameDuplicate 
                  ? 'border-[#CF373D] focus:ring-[#CF373D] text-[#CF373D]' 
                  : 'border-[#124874] focus:ring-[#CF373D]'
              }`}
            />
          </div>

          {/* Duplicate Username Warning */}
          {isUsernameDuplicate && (
            <div className="flex items-center justify-between mt-1.5 p-2 bg-red-50 border border-[#CF373D]/40 text-[#CF373D] text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>Tên đăng nhập "@{formData.username}" đã tồn tại trong danh bạ!</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  let suffix = 2;
                  while (existingStaffList.some(s => (s.username || '').toLowerCase() === `${formData.username}${suffix}`)) {
                    suffix++;
                  }
                  setFormData(prev => ({ ...prev, username: `${prev.username}${suffix}` }));
                }}
                className="underline text-[11px] hover:text-red-800 cursor-pointer"
              >
                Gợi ý tên khác
              </button>
            </div>
          )}
        </div>

        {/* Initial Password (Default: 123456) */}
        <div>
          <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
            Mật Khẩu Khởi Tạo *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required={!editingStaff}
              placeholder="123456"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-[#FAF7F2] border border-[#124874] pl-4 pr-10 py-2.5 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-[#124874] cursor-pointer"
              title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          <p className="font-serif italic text-xs text-gray-500 mt-1">
            Mật khẩu mặc định là <strong className="font-mono text-[#CF373D] font-bold">123456</strong>. Nhân sự có thể đổi lại mật khẩu sau khi nhận ca.
          </p>
        </div>

        {/* Role & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <CustomSelect
              label="Chức Danh & Vai Trò (Role) *"
              value={formData.role}
              options={[
                { value: 'Quản lý', label: 'Quản lý (Manager)', icon: 'fa-user-tie' },
                { value: 'Thủ kho', label: 'Thủ kho (Warehouse Master)', icon: 'fa-boxes-stacked' },
                { value: 'Thu ngân', label: 'Thu ngân (Cashier)', icon: 'fa-cash-register' },
                { value: 'Pha chế', label: 'Pha chế (Barista)', icon: 'fa-mug-hot' },
                { value: 'Phục vụ', label: 'Phục vụ (Floor Staff)', icon: 'fa-bell-concierge' },
              ]}
              onChange={handleRoleChange}
            />
          </div>

          <div>
            <CustomSelect
              label="Tình Trạng Công Tác *"
              value={formData.status}
              options={[
                { value: 'Hoạt động', label: 'Đang công tác (Active)', icon: 'fa-circle-check' },
                { value: 'Nghỉ việc', label: 'Đã nghỉ việc (Inactive)', icon: 'fa-circle-xmark' },
              ]}
              onChange={(status) => setFormData({ ...formData, status })}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t-2 border-[#124874]">
          <button
            type="button"
            onClick={onClose}
            className="press-btn px-6 py-2.5 bg-white text-[#161413] font-cinzel text-xs font-bold hover:bg-[#EDE7DC] cursor-pointer"
          >
            HỦY BỎ
          </button>
          <button
            type="submit"
            disabled={isUsernameDuplicate}
            style={{ backgroundColor: isUsernameDuplicate ? '#94a3b8' : '#124874', color: '#ffffff' }}
            className={`press-btn px-8 py-2.5 font-cinzel text-xs font-bold transition-colors shadow-sm ${
              isUsernameDuplicate ? 'cursor-not-allowed opacity-60' : 'hover:bg-[#CF373D] cursor-pointer'
            }`}
          >
            {editingStaff ? 'LƯU PHÂN QUYỀN' : 'CẤP TÀI KHOẢN'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StaffModal;
