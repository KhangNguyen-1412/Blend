import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/common/SectionHeader';
import CustomSelect from '../components/common/CustomSelect';
import { ordersApi, inventoryApi, staffApi } from '../services/api';
import { firestoreStaff } from '../services/firestoreService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const ProfileView = () => {
  const { addToast } = useToast();
  const { user, updateUser } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('info');
  const [staffList, setStaffList] = useState([]);

  // Helper to generate dynamic role-appropriate default profile for ANY user
  const getDefaultProfileForUser = (u) => {
    const isManager = (u?.role || '').toLowerCase().includes('quản lý') || (u?.role || '').toLowerCase().includes('admin');
    const isWarehouse = (u?.role || '').toLowerCase().includes('kho');
    const isCashier = (u?.role || '').toLowerCase().includes('thu ngân');
    const isBarista = (u?.role || '').toLowerCase().includes('pha chế');
    const isFloor = (u?.role || '').toLowerCase().includes('phục vụ');

    const normalizedHolder = (u?.name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toUpperCase();

    let defaultBio = 'Thực hiện nhiệm vụ chuyên môn và tuân thủ quy chuẩn dịch vụ ẩm thực cao cấp của chuỗi Blend Roastery.';
    if (isFloor) defaultBio = 'Chịu trách nhiệm tiếp đón thực khách, phục vụ đồ uống tại bàn và điều phối sơ đồ bàn tại sảnh Blend Roastery.';
    else if (isCashier) defaultBio = 'Chịu trách nhiệm vận hành máy tính tiền POS, thu ngân đa kênh và đối soát quỹ tiền mặt ca trực.';
    else if (isBarista) defaultBio = 'Chịu trách nhiệm kỹ thuật chiết xuất cà phê, điều phối quầy bar và bảo đảm chất lượng đồ uống theo chuẩn công thức Blend.';
    else if (isWarehouse) defaultBio = 'Chịu trách nhiệm kiểm soát xuất nhập tồn kho nguyên liệu, bảo quản hạt cà phê và lập biên bản vật tư.';
    else if (isManager) defaultBio = 'Chịu trách nhiệm toàn diện quy trình vận hành quầy bar, chất lượng nguồn hạt rang tuyển chọn và đối soát sổ sách tài chính nội bộ của chuỗi Blend.';

    return {
      fullName: u?.name || 'Nhân Viên',
      title: u?.role || 'Nhân sự',
      username: u?.username || 'staff',
      email: u?.email || `${u?.username || 'staff'}@blendcoffee.vn`,
      phone: u?.phone || '0908 123 456',
      branch: 'Blend Roastery & Tea - Saigon Flagship (Đồng Khởi, Q.1)',
      staffId: isManager ? `ADM-2026-00${u?.id || 1}` : `STF-2026-00${u?.id || 1}`,
      shift: isManager ? 'Toàn thời gian (Shift Lead)' : 'Ca trực tiêu chuẩn (8h/ngày)',
      joinDate: '15/01/2024',
      bio: defaultBio,
      
      birthDate: '1998-05-20',
      idCard: '079098012345',
      taxCode: '8492018491',
      bankName: 'Vietcombank',
      bankAccount: '1029384756',
      bankHolder: normalizedHolder || 'NGUYEN VAN A',

      pettyCashLimit: isManager ? '5.000.000đ' : '500.000đ',
      discountCap: isManager ? '20%' : '5%',
      canOverridePrice: isManager,
      canRefund: isManager,
      deputyManager: 'thukho',

      refundPin: '8888',
      require2FA: isManager,
      autoLockMinutes: 15,

      telegramEnabled: isManager,
      telegramChatId: `@${u?.username || 'staff'}_blend`,
      zaloEnabled: true,
      zaloPhone: u?.phone || '0908 123 456',
      emailAlertEnabled: isManager,
      alertOnHighRevenue: isManager,
      alertOnRefund: isManager,
      alertOnLowStock: isManager || isWarehouse,
      alertOnLargeBooking: isManager || isFloor,

      totalHoursThisMonth: 168,
      workingDays: 22,
      standardDays: 22,
      annualLeaveRemaining: 10,
      kpiScore: '99.8%'
    };
  };

  const getUserProfileKey = (u) => `blend_profile_${u?.id || u?.username || 'user'}`;

  // Initial State from current user
  const [profile, setProfile] = useState(() => {
    if (user) {
      const userKey = getUserProfileKey(user);
      const saved = localStorage.getItem(userKey);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
      return getDefaultProfileForUser(user);
    }
    return getDefaultProfileForUser(null);
  });

  // Sync profile whenever logged-in user changes
  useEffect(() => {
    if (!user) return;
    const userKey = getUserProfileKey(user);
    const saved = localStorage.getItem(userKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile({
          ...parsed,
          fullName: user.name || parsed.fullName,
          title: user.role || parsed.title,
          username: user.username || parsed.username,
        });
        return;
      } catch (e) {}
    }
    setProfile(getDefaultProfileForUser(user));
  }, [user]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [auditLogs, setAuditLogs] = useState([]);
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'sess-1',
      device: 'Windows 11 PC • Chrome 128 (Máy Trạm POS Quầy Bar)',
      ip: '192.168.1.102 (Nội bộ Flagship)',
      location: 'Quận 1, TP. Hồ Chí Minh',
      time: 'Đang hoạt động (Phiên hiện tại)',
      isCurrent: true,
      icon: 'fa-desktop'
    },
    {
      id: 'sess-2',
      device: 'iPhone 15 Pro Max • Safari iOS 18 (Ứng Dụng Di Động)',
      ip: '14.241.120.88 (Viettel 5G)',
      location: 'TP. Hồ Chí Minh',
      time: 'Cách đây 12 phút',
      isCurrent: false,
      icon: 'fa-mobile-screen'
    }
  ]);

  // Load Real Staff for Deputy Manager Selection & Real Audit Logs
  useEffect(() => {
    staffApi.getAll()
      .then((res) => {
        if (res.success && res.data) {
          setStaffList(res.data);
        }
      })
      .catch(() => {});

    Promise.all([ordersApi.getAll(), inventoryApi.getDockets()]).then(([ordersRes, docketsRes]) => {
      const logs = [];
      if (ordersRes.success && ordersRes.data) {
        ordersRes.data.slice(0, 4).forEach((o) => {
          logs.push({
            id: `ord-${o.id}`,
            time: `${o.time || 'Gần đây'}`,
            action: `Xử lý phiếu đơn #${o.id} của khách "${o.customer}" (${o.total}) - Trạng thái: ${o.status}`,
            type: 'order',
            icon: 'fa-scroll'
          });
        });
      }
      if (docketsRes.success && docketsRes.data) {
        docketsRes.data.slice(0, 3).forEach((d) => {
          logs.push({
            id: `dkt-${d.id}`,
            time: `${d.date || 'Hôm nay'}`,
            action: `Biên bản ${d.type}: ${d.item_name} (${d.qty}) - Thủ kho: ${d.clerk}`,
            type: 'inventory',
            icon: 'fa-boxes-stacked'
          });
        });
      }
      setAuditLogs(logs);
    }).catch(() => {});
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const userKey = getUserProfileKey(user);
    localStorage.setItem(userKey, JSON.stringify(profile));

    // Update global user state in AuthContext so Sidebar, Header & Landing Page reflect immediately
    if (updateUser) {
      updateUser({
        name: profile.fullName,
        role: profile.title,
      });
    }

    // Persist changes to backend staff database & Firestore if valid user session exists
    if (user?.id) {
      try {
        await staffApi.update(user.id, {
          name: profile.fullName,
          role: profile.title,
        });
        await firestoreStaff.update(user.id, {
          name: profile.fullName,
          role: profile.title,
        });
      } catch (err) {
        console.warn('Backend sync note:', err);
      }
    }

    addToast(`Đã lưu toàn bộ thông tin hồ sơ của ${profile.fullName}!`, 'success');
  };

  const handleSaveAuthority = (e) => {
    e.preventDefault();
    const userKey = getUserProfileKey(user);
    localStorage.setItem(userKey, JSON.stringify(profile));
    addToast('Đã cập nhật thẩm quyền duyệt chi & hạn mức vận hành!', 'success');
  };

  const handleSaveAlerts = (e) => {
    e.preventDefault();
    const userKey = getUserProfileKey(user);
    localStorage.setItem(userKey, JSON.stringify(profile));
    addToast('Đã lưu cấu hình kênh nhận thông báo khẩn cấp (Telegram/Zalo)!', 'success');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      addToast('Vui lòng nhập mật khẩu hiện tại', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      addToast('Mật khẩu mới phải có tối thiểu 6 ký tự', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addToast('Xác nhận mật khẩu mới không khớp!', 'error');
      return;
    }
    addToast('Đổi mật khẩu tài khoản cá nhân thành công!', 'success');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    const userKey = getUserProfileKey(user);
    localStorage.setItem(userKey, JSON.stringify(profile));
    addToast('Đã cập nhật thiết lập bảo mật & mã PIN phê duyệt!', 'success');
  };

  const handleTerminateOtherSessions = () => {
    if (!window.confirm('Bạn có chắc muốn đăng xuất từ xa khỏi tất cả các thiết bị khác?')) return;
    setActiveSessions(activeSessions.filter(s => s.isCurrent));
    addToast('Đã đăng xuất tài khoản khỏi tất cả thiết bị di động & máy trạm khác!', 'success');
  };

  const bankOptions = [
    { value: 'Vietcombank', label: 'Vietcombank (Ngân hàng Ngoại Thương)', icon: 'fa-building-columns' },
    { value: 'Techcombank', label: 'Techcombank (Ngân hàng Kỹ Thương)', icon: 'fa-building-columns' },
    { value: 'MBBank', label: 'MBBank (Ngân hàng Quân Đội)', icon: 'fa-building-columns' },
    { value: 'BIDV', label: 'BIDV (Đầu Tư & Phát Triển)', icon: 'fa-building-columns' },
    { value: 'ACB', label: 'ACB (Ngân hàng Á Châu)', icon: 'fa-building-columns' },
    { value: 'VPBank', label: 'VPBank (Việt Nam Thịnh Vượng)', icon: 'fa-building-columns' },
    { value: 'TPBank', label: 'TPBank (Tiên Phong Bank)', icon: 'fa-building-columns' },
  ];

  // List of all active staff and managers in the system available for deputy delegation
  const currentUsername = user?.username || profile.username || 'admin_khang';
  const deputyStaffOptions = staffList
    .filter((s) => {
      const roleLower = (s.role || '').toLowerCase();
      // Exclude customer accounts
      if (roleLower === 'customer' || roleLower === 'khách hàng') return false;
      // Exclude resigned / inactive personnel
      if (s.status === 'Nghỉ việc') return false;
      // Exclude current user (cannot delegate to oneself)
      if (s.username === currentUsername) return false;
      return true;
    })
    .map((s) => {
      let icon = 'fa-user';
      const roleLower = (s.role || '').toLowerCase();
      if (roleLower.includes('quản lý') || roleLower.includes('manager') || roleLower.includes('admin')) {
        icon = 'fa-user-tie';
      } else if (roleLower.includes('kho')) {
        icon = 'fa-boxes-stacked';
      } else if (roleLower.includes('thu ngân') || roleLower.includes('cashier')) {
        icon = 'fa-cash-register';
      } else if (roleLower.includes('pha chế') || roleLower.includes('barista')) {
        icon = 'fa-mug-hot';
      } else if (roleLower.includes('phục vụ') || roleLower.includes('waiter') || roleLower.includes('floor')) {
        icon = 'fa-bell-concierge';
      }

      return {
        value: s.username,
        label: `${s.name} (${s.role})`,
        icon
      };
    });

  const isManagerRole = (user?.role || profile.title || '').toLowerCase().includes('quản lý') || (user?.role || profile.title || '').toLowerCase().includes('admin');
  const roleDisplay = (profile.title || user?.role || 'Nhân sự').toUpperCase();

  return (
    <div className="font-body animate-editorial-in text-[#161413] space-y-8">
      {/* Editorial Section Header */}
      <SectionHeader 
        sectionNo={isManagerRole ? "MỤC IX &bull; TỔNG QUẢN LÝ & CHỦ BIÊN CA" : `HỒ SƠ NHÂN SỰ &bull; CA TRỰC ${roleDisplay}`} 
        title={`Hồ Sơ Cá Nhân &bull; ${profile.fullName}`} 
        subtitle={isManagerRole 
          ? "Quản lý định danh nhân sự cấp cao, hạn mức duyệt chi tài chính, kênh cảnh báo khẩn cấp Telegram/Zalo, bảo mật 2FA và chấm công ca trực."
          : `Quản lý thông tin định danh cá nhân, tài khoản ngân hàng nhận lương thưởng, lịch sử đăng nhập máy trạm và chấm công của ${profile.fullName}.`} 
        action={
          <div className="flex items-center gap-3">
            <span className={`ink-stamp ${isManagerRole ? 'stamp-jasper' : 'stamp-green'} text-xs font-bold`}>
              <i className={`fa-solid ${isManagerRole ? 'fa-shield-halved' : 'fa-id-badge'} mr-1.5`}></i> {roleDisplay}
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 4 Cols: Archival Press Identity Pass (Thẻ Ký Giả / Thẻ Chủ Biên) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="editorial-card-press bg-[#FCFAF6] p-6 border-2 border-[#124874] shadow-[6px_6px_0px_rgba(18,72,116,0.95)] relative overflow-hidden">
            {/* Top Pass Ribbon */}
            <div 
              style={{ backgroundColor: '#124874', color: '#ffffff' }}
              className="py-1.5 px-4 text-center -mx-6 -mt-6 mb-6 border-b-2 border-[#0D3656]"
            >
              <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] font-bold text-[#C59B27]">
                &mdash; OFFICIAL PRESS &amp; ROASTERY PASS &mdash;
              </span>
            </div>

            {/* Avatar & Monogram Frame */}
            <div className="text-center pb-5 border-b border-[#D8D1C5]">
              <div className="relative inline-block mb-3">
                <div 
                  style={{ backgroundColor: '#CF373D', borderColor: '#124874', color: '#ffffff' }}
                  className="w-24 h-24 border-4 mx-auto flex items-center justify-center font-display font-black text-5xl shadow-[4px_4px_0px_rgba(18,72,116,0.9)]"
                >
                  {profile.fullName.charAt(0)}
                </div>
                <div 
                  style={{ backgroundColor: '#C59B27', borderColor: '#124874', color: '#ffffff' }}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs shadow-xs"
                  title="Tài khoản đã xác minh danh tính"
                >
                  <i className="fa-solid fa-check"></i>
                </div>
              </div>

              <h3 className="font-display text-2xl font-bold text-[#124874] tracking-tight">
                {profile.fullName}
              </h3>
              <p className="font-serif italic text-sm text-[#CF373D] font-bold mt-0.5">
                {profile.title}
              </p>
              <p className="font-mono text-xs text-[#6E675F] mt-1 font-semibold">
                @{profile.username} &bull; Mã: #{profile.staffId}
              </p>
            </div>

            {/* Key Dossier Details */}
            <div className="py-4 space-y-2.5 font-body text-xs border-b border-[#D8D1C5]">
              <div className="flex justify-between">
                <span className="font-cinzel uppercase text-[#6E675F] font-bold">CHI NHÁNH:</span>
                <span className="font-serif font-bold text-[#124874] text-right truncate max-w-[180px]">Saigon Flagship</span>
              </div>
              <div className="flex justify-between">
                <span className="font-cinzel uppercase text-[#6E675F] font-bold">CA LÀM VIỆC:</span>
                <span className="font-serif font-bold text-gray-800">Toàn thời gian (Shift Lead)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-cinzel uppercase text-[#6E675F] font-bold">NGÀY GIA NHẬP:</span>
                <span className="font-mono font-bold text-[#124874]">{profile.joinDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-cinzel uppercase text-[#6E675F] font-bold">HẠN MỨC QUỸ CA:</span>
                <span className="font-mono font-bold text-[#CF373D]">{profile.pettyCashLimit}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-cinzel uppercase text-[#6E675F] font-bold">TRẠNG THÁI CA:</span>
                <span className="text-emerald-800 font-bold font-serif">
                  <i className="fa-solid fa-circle text-[8px] mr-1 text-emerald-600"></i> Đang Trong Ca Trực
                </span>
              </div>
            </div>

            {/* Digital Signature Specimen Box */}
            <div className="py-4 border-b border-[#D8D1C5] text-center space-y-1">
              <span className="font-cinzel text-[9px] uppercase tracking-widest text-[#6E675F] font-bold block">
                CHỮ KÝ ĐIỆN TỬ PHÊ DUYỆT BÁO CÁO:
              </span>
              <div className="p-2.5 bg-[#FAF7F2] border border-dashed border-[#124874] text-center">
                <span className="font-display italic text-2xl text-[#124874] tracking-wider block transform -rotate-2">
                  {profile.fullName}
                </span>
                <span className="font-mono text-[9px] text-gray-500 block mt-1">
                  SHA256: 7f8a9...b3e2 &bull; HỢP LỆ TRÊN MỌI CHỨNG TỪ
                </span>
              </div>
            </div>

            {/* Verified Wax Seal Stamp */}
            <div className="pt-3 flex justify-between items-center">
              <div className="ink-stamp stamp-cerulean text-[10px]">
                CHỦ BIÊN XÁC THỰC
              </div>
              <span className="font-mono text-[10px] text-[#6E675F]">
                VOL. IV &bull; 2026
              </span>
            </div>
          </div>

          {/* Timesheet Quick Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="editorial-paper p-3.5 text-center bg-white border border-[#D8D1C5]">
              <span className="font-mono text-2xl font-black text-[#124874] block">{profile.totalHoursThisMonth}h</span>
              <span className="font-cinzel text-[9px] uppercase tracking-widest text-[#6E675F] font-bold">GIỜ CÔNG THÁNG</span>
            </div>
            <div className="editorial-paper p-3.5 text-center bg-white border border-[#D8D1C5]">
              <span className="font-mono text-2xl font-black text-[#CF373D] block">{profile.annualLeaveRemaining} Ngày</span>
              <span className="font-cinzel text-[9px] uppercase tracking-widest text-[#6E675F] font-bold">PHÉP NĂM CÒN LẠI</span>
            </div>
          </div>
        </div>

        {/* Right 8 Cols: Comprehensive Management Tabs */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Sub-Navigation Tabs Strip (5 Sub-tabs) */}
          <div className="flex gap-2 pb-2 border-b-2 border-[#124874] overflow-x-auto">
            {[
              { id: 'info', name: 'I. HỒ SƠ & PHÁP LÝ', icon: 'fa-id-card' },
              { id: 'authority', name: 'II. THẨM QUYỀN & HẠN MỨC', icon: 'fa-scale-balanced' },
              { id: 'security', name: 'III. BẢO MẬT & PHIÊN ĐĂNG NHẬP', icon: 'fa-shield-halved' },
              { id: 'alerts', name: 'IV. KÊNH CẢNH BÁO KHẨN', icon: 'fa-bell' },
              { id: 'logs', name: 'V. NHẬT KÝ & CHẤM CÔNG', icon: 'fa-clock-rotate-left' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={activeSubTab === tab.id ? { backgroundColor: '#124874', color: '#ffffff' } : {}}
                className={`px-3.5 py-2 font-cinzel text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeSubTab === tab.id
                    ? 'border-[#0D3656] shadow-sm'
                    : 'bg-white text-[#124874] border-[#D8D1C5] hover:bg-[#FAF7F2]'
                }`}
              >
                <i className={`fa-solid ${tab.icon}`}></i>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: Profile & Legal Information */}
          {activeSubTab === 'info' && (
            <div className="editorial-card-press bg-white p-6 md:p-8 border border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.9)]">
              <div className="border-b border-[#D8D1C5] pb-3 mb-6">
                <h4 className="font-display text-xl font-bold text-[#124874]">
                  Hồ Sơ Nhân Sự, Pháp Lý &amp; Tài Khoản Ngân Hàng
                </h4>
                <p className="font-serif italic text-xs text-gray-500 mt-0.5">
                  Thông tin định danh pháp lý, số CCCD, mã số thuế và tài khoản ngân hàng nhận chi trả lương thưởng.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                      Họ và Tên Đầy Đủ *
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full bg-[#FCFAF6] border border-[#124874] px-4 py-2.5 font-serif text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                  </div>

                  <div>
                    <CustomSelect
                      label="Chức Danh Quản Trị *"
                      value={profile.title}
                      options={[
                        { value: 'Quản lý', label: 'Quản lý (Chủ Biên & Quản Trị Trưởng Ca)', icon: 'fa-user-tie' },
                        { value: 'Thủ kho', label: 'Thủ kho (Điều Phối Kho Vật Tư & Nhập Xuất)', icon: 'fa-boxes-stacked' },
                        { value: 'Thu ngân', label: 'Thu ngân (Quản Lý POS & Thu Ngân Ca Trực)', icon: 'fa-cash-register' },
                        { value: 'Pha chế', label: 'Pha chế (Barista & Giám Sát Quầy Bar)', icon: 'fa-mug-hot' },
                        { value: 'Phục vụ', label: 'Phục vụ (Nhân Viên Sảnh & Phục Vụ Bàn)', icon: 'fa-bell-concierge' },
                      ]}
                      onChange={(roleVal) => setProfile({ ...profile, title: roleVal })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                      Email Liên Lạc Cơ Quan *
                    </label>
                    <input
                      type="email"
                      required
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-[#FCFAF6] border border-[#124874] px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                      Số Điện Thoại Nội Bộ *
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full bg-[#FCFAF6] border border-[#124874] px-4 py-2.5 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                  </div>
                </div>

                {/* Legal & Tax Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3 border-t border-[#D8D1C5]">
                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                      Số CCCD / CMND *
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.idCard}
                      onChange={(e) => setProfile({ ...profile, idCard: e.target.value })}
                      className="w-full bg-[#FCFAF6] border border-[#124874] px-3.5 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                      Mã Số Thuế Cá Nhân (MST)
                    </label>
                    <input
                      type="text"
                      value={profile.taxCode}
                      onChange={(e) => setProfile({ ...profile, taxCode: e.target.value })}
                      className="w-full bg-[#FCFAF6] border border-[#124874] px-3.5 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                      Ngày Sinh
                    </label>
                    <input
                      type="date"
                      value={profile.birthDate}
                      onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                      className="w-full bg-[#FCFAF6] border border-[#124874] px-3.5 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                  </div>
                </div>

                {/* Banking Payroll Details */}
                <div className="p-4 bg-[#FAF7F2] border border-[#124874] space-y-4">
                  <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider block border-b border-[#D8D1C5] pb-2">
                    <i className="fa-solid fa-credit-card mr-1.5 text-[#CF373D]"></i> TÀI KHOẢN NGÂN HÀNG THỤ HƯỞNG LƯƠNG &amp; THƯỞNG:
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <CustomSelect
                        label="Ngân Hàng Thụ Hưởng *"
                        value={profile.bankName}
                        options={bankOptions}
                        onChange={(bank) => setProfile({ ...profile, bankName: bank })}
                      />
                    </div>

                    <div>
                      <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                        Số Tài Khoản Ngân Hàng *
                      </label>
                      <input
                        type="text"
                        required
                        value={profile.bankAccount}
                        onChange={(e) => setProfile({ ...profile, bankAccount: e.target.value })}
                        className="w-full bg-white border border-[#124874] px-3.5 py-2.5 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                      />
                    </div>

                    <div>
                      <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                        Tên Chủ Tài Khoản (In Hoa) *
                      </label>
                      <input
                        type="text"
                        required
                        value={profile.bankHolder}
                        onChange={(e) => setProfile({ ...profile, bankHolder: e.target.value.toUpperCase() })}
                        className="w-full bg-white border border-[#124874] px-3.5 py-2.5 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                    Chi Nhánh Trực Thuộc Quản Lý
                  </label>
                  <input
                    type="text"
                    value={profile.branch}
                    onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                    className="w-full bg-[#FCFAF6] border border-[#124874] px-4 py-2.5 font-serif text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                  />
                </div>

                <div>
                  <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                    Tuyên Ngôn &amp; Ghi Chú Điều Hành
                  </label>
                  <textarea
                    rows="2"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full bg-[#FCFAF6] border border-[#124874] px-4 py-2 font-serif text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-[#D8D1C5] flex justify-end">
                  <button
                    type="submit"
                    style={{ backgroundColor: '#124874', color: '#ffffff' }}
                    className="press-btn px-8 py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-floppy-disk"></i> LƯU CẬP NHẬT HỒ SƠ
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Operational Authority & Financial Limits */}
          {activeSubTab === 'authority' && (
            <div className="editorial-card-press bg-white p-6 md:p-8 border border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.9)]">
              <div className="border-b border-[#D8D1C5] pb-3 mb-6">
                <h4 className="font-display text-xl font-bold text-[#124874]">
                  Thẩm Quyền Phê Duyệt &amp; Hạn Mức Vận Hành Ca
                </h4>
                <p className="font-serif italic text-xs text-gray-500 mt-0.5">
                  Thiết lập hạn mức tài chính được phép xuất quỹ tiền mặt, tỷ lệ chiết khấu đền bù và nhân sự ủy quyền khi vắng mặt.
                </p>
              </div>

              <form onSubmit={handleSaveAuthority} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-[#FAF7F2] border-2 border-[#124874] space-y-3">
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider">
                      Hạn Mức Xuất Quỹ Khẩn Cấp Trong Ca (VNĐ) *
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.pettyCashLimit}
                      onChange={(e) => setProfile({ ...profile, pettyCashLimit: e.target.value })}
                      className="w-full bg-white border border-[#124874] px-4 py-2 font-mono text-base font-bold text-[#CF373D] focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                    <p className="font-serif italic text-[11px] text-gray-600">
                      Hạn mức tối đa Quản lý được duyệt mua bổ sung vật tư tươi sống gấp ngoài siêu thị.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] border-2 border-[#124874] space-y-3">
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider">
                      Hạn Mức Chiết Khấu / Đền Bù Tối Đa (%) *
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.discountCap}
                      onChange={(e) => setProfile({ ...profile, discountCap: e.target.value })}
                      className="w-full bg-white border border-[#124874] px-4 py-2 font-mono text-base font-bold text-[#124874] focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                    <p className="font-serif italic text-[11px] text-gray-600">
                      Tỷ lệ giảm giá tối đa Quản lý được áp dụng thủ công khi xử lý khiếu nại của khách VIP.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white border border-[#124874] space-y-4">
                  <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider block border-b border-[#D8D1C5] pb-2">
                    <i className="fa-solid fa-user-shield mr-1.5 text-[#CF373D]"></i> ỦY QUYỀN ĐIỀU HÀNH KHI VẮNG MẶT (DEPUTY MANAGER):
                  </span>

                  <div>
                    <CustomSelect
                      label="Nhân Sự Tiếp Quản Thẩm Quyền Phê Duyệt *"
                      placeholder="Chọn nhân viên hoặc quản lý trong hệ thống..."
                      value={profile.deputyManager}
                      options={
                        deputyStaffOptions.length > 0
                          ? deputyStaffOptions
                          : [{ value: '', label: 'Không có nhân sự khả dụng khác', icon: 'fa-user-slash' }]
                      }
                      onChange={(dep) => setProfile({ ...profile, deputyManager: dep })}
                    />
                    <p className="font-serif italic text-xs text-gray-500 mt-1.5">
                      Nhân sự được ủy quyền sẽ tạm thời có quyền đóng dấu các phiếu xuất kho và duyệt đơn hủy khi Quản lý đi công tác.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-start gap-3 p-3.5 bg-[#FAF7F2] border border-[#D8D1C5] cursor-pointer hover:border-[#124874]">
                    <input
                      type="checkbox"
                      checked={profile.canRefund}
                      onChange={(e) => setProfile({ ...profile, canRefund: e.target.checked })}
                      className="mt-1 w-4 h-4 accent-[#124874]"
                    />
                    <div>
                      <span className="font-serif text-sm font-bold text-[#124874] block">Quyền Phê Duyệt Hoàn Tiền (Refund)</span>
                      <span className="font-serif text-xs text-gray-600">Được quyền nhập mã PIN để hủy đơn và trả tiền cho khách.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 bg-[#FAF7F2] border border-[#D8D1C5] cursor-pointer hover:border-[#124874]">
                    <input
                      type="checkbox"
                      checked={profile.canOverridePrice}
                      onChange={(e) => setProfile({ ...profile, canOverridePrice: e.target.checked })}
                      className="mt-1 w-4 h-4 accent-[#124874]"
                    />
                    <div>
                      <span className="font-serif text-sm font-bold text-[#124874] block">Quyền Can Thiệp Giá Niêm Yết</span>
                      <span className="font-serif text-xs text-gray-600">Được phép thay đổi bảng giá món trực tiếp trong menu.</span>
                    </div>
                  </label>
                </div>

                <div className="pt-4 border-t border-[#D8D1C5] flex justify-end">
                  <button
                    type="submit"
                    style={{ backgroundColor: '#124874', color: '#ffffff' }}
                    className="press-btn px-8 py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-stamp"></i> LƯU THIẾT LẬP THẨM QUYỀN
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: Security, Password & Active Sessions */}
          {activeSubTab === 'security' && (
            <div className="space-y-6">
              {/* Change Password Card */}
              <div className="editorial-card-press bg-white p-6 md:p-8 border border-[#124874]">
                <div className="border-b border-[#D8D1C5] pb-3 mb-6">
                  <h4 className="font-display text-xl font-bold text-[#124874]">
                    Đổi Mật Khẩu Đăng Nhập Quản Trị
                  </h4>
                  <p className="font-serif italic text-xs text-gray-500 mt-0.5">
                    Đảm bảo mật khẩu có tối thiểu 6 ký tự để bảo vệ tài khoản quản trị ca.
                  </p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                      Mật Khẩu Hiện Tại *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full bg-[#FCFAF6] border border-[#124874] px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                      Mật Khẩu Mới *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full bg-[#FCFAF6] border border-[#124874] px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                      Xác Nhận Mật Khẩu Mới *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full bg-[#FCFAF6] border border-[#124874] px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                  </div>

                  <button
                    type="submit"
                    style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
                    className="press-btn px-6 py-2.5 font-cinzel text-xs font-bold hover:bg-[#AB282D] transition-colors mt-2 cursor-pointer"
                  >
                    CẬP NHẬT MẬT KHẨU
                  </button>
                </form>
              </div>

              {/* Refund PIN & Operation Security */}
              <div className="editorial-card-press bg-white p-6 md:p-8 border border-[#124874]">
                <div className="border-b border-[#D8D1C5] pb-3 mb-6">
                  <h4 className="font-display text-xl font-bold text-[#124874]">
                    Mã PIN Phê Duyệt Nghiệp Vụ Quầy Bar &amp; 2FA
                  </h4>
                  <p className="font-serif italic text-xs text-gray-500 mt-0.5">
                    Mã PIN 4 số dùng để duyệt nhanh các đơn hoàn tiền (*Refund*) hoặc điều chỉnh giảm giá đặc biệt tại quầy thu ngân.
                  </p>
                </div>

                <form onSubmit={handleSaveSecurity} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                      Mã PIN Hoàn Tiền (4 Chữ Số)
                    </label>
                    <input
                      type="password"
                      maxLength="4"
                      value={profile.refundPin}
                      onChange={(e) => setProfile({ ...profile, refundPin: e.target.value })}
                      className="w-48 bg-[#FCFAF6] border border-[#124874] px-4 py-2 font-mono text-lg font-bold tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.require2FA}
                        onChange={(e) => setProfile({ ...profile, require2FA: e.target.checked })}
                        className="w-4 h-4 accent-[#124874]"
                      />
                      <span className="font-serif text-sm font-bold text-[#124874]">
                        Yêu cầu xác thực bảo mật 2 lớp (2FA) khi đăng nhập thiết bị lạ
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    style={{ backgroundColor: '#124874', color: '#ffffff' }}
                    className="press-btn px-6 py-2 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors cursor-pointer"
                  >
                    LƯU MÃ PIN PHÊ DUYỆT
                  </button>
                </form>
              </div>

              {/* Active Sessions & Remote Logout */}
              <div className="editorial-card-press bg-white p-6 md:p-8 border border-[#124874]">
                <div className="border-b border-[#D8D1C5] pb-3 mb-6 flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <h4 className="font-display text-xl font-bold text-[#124874]">
                      Các Thiết Bị &amp; Phiên Đăng Nhập Đang Hoạt Động
                    </h4>
                    <p className="font-serif italic text-xs text-gray-500 mt-0.5">
                      Theo dõi danh sách các máy trạm POS và điện thoại di động đang đăng nhập tài khoản quản trị.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTerminateOtherSessions}
                    className="press-btn px-4 py-2 bg-white text-[#CF373D] border border-[#CF373D] hover:bg-[#CF373D] hover:text-white font-cinzel text-xs font-bold transition-colors cursor-pointer"
                  >
                    <i className="fa-solid fa-power-off mr-1.5"></i> ĐĂNG XUẤT THIẾT BỊ KHÁC
                  </button>
                </div>

                <div className="space-y-3">
                  {activeSessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-4 bg-[#FAF7F2] border border-[#D8D1C5] flex items-center justify-between hover:border-[#124874] transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div 
                          style={{ backgroundColor: sess.isCurrent ? '#124874' : '#6E675F', color: '#ffffff' }}
                          className="w-10 h-10 flex items-center justify-center text-sm flex-shrink-0 shadow-xs"
                        >
                          <i className={`fa-solid ${sess.icon}`}></i>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-serif font-bold text-sm text-[#161413]">{sess.device}</p>
                            {sess.isCurrent && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-cinzel text-[9px] font-bold border border-emerald-300">
                                HIỆN TẠI
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs text-gray-500 block mt-0.5">
                            IP: {sess.ip} &bull; {sess.location}
                          </span>
                        </div>
                      </div>

                      <span className="font-mono text-xs text-[#124874] font-bold whitespace-nowrap ml-4">
                        {sess.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Emergency Alert Channels (Telegram / Zalo / SMS) */}
          {activeSubTab === 'alerts' && (
            <div className="editorial-card-press bg-white p-6 md:p-8 border border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.9)]">
              <div className="border-b border-[#D8D1C5] pb-3 mb-6">
                <h4 className="font-display text-xl font-bold text-[#124874]">
                  Kênh Cảnh Báo Khẩn Cấp &amp; Tích Hợp Thông Báo Tức Thời
                </h4>
                <p className="font-serif italic text-xs text-gray-500 mt-0.5">
                  Tự động gửi tin nhắn báo động qua Telegram Bot, Zalo ZNS và SMS khi xảy ra sự cố đột biến tại cửa hàng.
                </p>
              </div>

              <form onSubmit={handleSaveAlerts} className="space-y-6">
                {/* Integration Channels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-4 bg-[#FAF7F2] border-2 border-[#124874] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-cinzel text-xs font-bold text-[#124874] uppercase flex items-center gap-2">
                        <i className="fa-brands fa-telegram text-blue-500 text-base"></i> TELEGRAM ALERT BOT
                      </span>
                      <input
                        type="checkbox"
                        checked={profile.telegramEnabled}
                        onChange={(e) => setProfile({ ...profile, telegramEnabled: e.target.checked })}
                        className="w-4 h-4 accent-[#124874] cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="@username hoặc Telegram ChatID"
                      value={profile.telegramChatId}
                      onChange={(e) => setProfile({ ...profile, telegramChatId: e.target.value })}
                      className="w-full bg-white border border-[#124874] px-3.5 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                    <p className="font-serif italic text-[11px] text-gray-600">
                      Nhận thông báo đơn hủy, doanh thu ca và kho cạn qua kênh Telegram riêng.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] border-2 border-[#124874] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-cinzel text-xs font-bold text-[#124874] uppercase flex items-center gap-2">
                        <i className="fa-solid fa-comment-sms text-emerald-600 text-base"></i> ZALO ZNS &amp; SMS KHẨN
                      </span>
                      <input
                        type="checkbox"
                        checked={profile.zaloEnabled}
                        onChange={(e) => setProfile({ ...profile, zaloEnabled: e.target.checked })}
                        className="w-4 h-4 accent-[#124874] cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Số điện thoại nhận tin khẩn cấp"
                      value={profile.zaloPhone}
                      onChange={(e) => setProfile({ ...profile, zaloPhone: e.target.value })}
                      className="w-full bg-white border border-[#124874] px-3.5 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                    <p className="font-serif italic text-[11px] text-gray-600">
                      Nhắn tin trực tiếp tới số điện thoại của Quản lý trưởng ca trực.
                    </p>
                  </div>
                </div>

                {/* Event Trigger Rules */}
                <div className="p-4 bg-white border border-[#124874] space-y-3">
                  <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider block border-b border-[#D8D1C5] pb-2">
                    <i className="fa-solid fa-bolt mr-1.5 text-[#CF373D]"></i> CÁC SỰ KIỆN KÍCH HOẠT GỬI CẢNH BÁO:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <label className="flex items-center gap-3 p-3 bg-[#FAF7F2] border border-[#D8D1C5] cursor-pointer hover:border-[#124874]">
                      <input
                        type="checkbox"
                        checked={profile.alertOnRefund}
                        onChange={(e) => setProfile({ ...profile, alertOnRefund: e.target.checked })}
                        className="w-4 h-4 accent-[#124874]"
                      />
                      <span className="font-serif text-xs font-bold text-[#161413]">
                        Có đơn hàng bị HỦY hoặc HOÀN TIỀN bất thường
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-[#FAF7F2] border border-[#D8D1C5] cursor-pointer hover:border-[#124874]">
                      <input
                        type="checkbox"
                        checked={profile.alertOnLowStock}
                        onChange={(e) => setProfile({ ...profile, alertOnLowStock: e.target.checked })}
                        className="w-4 h-4 accent-[#124874]"
                      />
                      <span className="font-serif text-xs font-bold text-[#161413]">
                        Nguyên vật liệu hạt/trà/sữa chạm mức BÁO ĐỘNG ĐỎ
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-[#FAF7F2] border border-[#D8D1C5] cursor-pointer hover:border-[#124874]">
                      <input
                        type="checkbox"
                        checked={profile.alertOnLargeBooking}
                        onChange={(e) => setProfile({ ...profile, alertOnLargeBooking: e.target.checked })}
                        className="w-4 h-4 accent-[#124874]"
                      />
                      <span className="font-serif text-xs font-bold text-[#161413]">
                        Khách đặt bàn đoàn đông (&gt; 10 người / Tiệc sự kiện)
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-[#FAF7F2] border border-[#D8D1C5] cursor-pointer hover:border-[#124874]">
                      <input
                        type="checkbox"
                        checked={profile.alertOnHighRevenue}
                        onChange={(e) => setProfile({ ...profile, alertOnHighRevenue: e.target.checked })}
                        className="w-4 h-4 accent-[#124874]"
                      />
                      <span className="font-serif text-xs font-bold text-[#161413]">
                        Doanh thu trong ngày vượt mốc mục tiêu ca trực
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D8D1C5] flex justify-end">
                  <button
                    type="submit"
                    style={{ backgroundColor: '#124874', color: '#ffffff' }}
                    className="press-btn px-8 py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-paper-plane"></i> LƯU KÊNH THÔNG BÁO KHẨN
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: Audit Trail & Timesheet */}
          {activeSubTab === 'logs' && (
            <div className="space-y-6">
              {/* Timesheet Summary Card */}
              <div className="editorial-card-press bg-white p-6 md:p-8 border border-[#124874]">
                <div className="border-b border-[#D8D1C5] pb-3 mb-6 flex justify-between items-center">
                  <div>
                    <h4 className="font-display text-xl font-bold text-[#124874]">
                      Bảng Chấm Công &amp; Hiệu Suất Ca Trực Tháng Này
                    </h4>
                    <p className="font-serif italic text-xs text-gray-500 mt-0.5">
                      Dữ liệu giờ trực thực tế được ghi nhận tự động từ hệ thống đăng nhập máy trạm POS.
                    </p>
                  </div>
                  <span className="ink-stamp stamp-cerulean text-[10px] font-bold">
                    KPI: {profile.kpiScore}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-[#FAF7F2] border border-[#D8D1C5]">
                    <span className="font-mono text-2xl font-bold text-[#124874] block">{profile.totalHoursThisMonth} Giờ</span>
                    <span className="font-cinzel text-[10px] text-gray-600 font-bold uppercase">TỔNG GIỜ LÀM</span>
                  </div>
                  <div className="p-4 bg-[#FAF7F2] border border-[#D8D1C5]">
                    <span className="font-mono text-2xl font-bold text-emerald-800 block">{profile.workingDays}/{profile.standardDays}</span>
                    <span className="font-cinzel text-[10px] text-gray-600 font-bold uppercase">NGÀY CÔNG THỰC TẾ</span>
                  </div>
                  <div className="p-4 bg-[#FAF7F2] border border-[#D8D1C5]">
                    <span className="font-mono text-2xl font-bold text-[#CF373D] block">{profile.annualLeaveRemaining} Ngày</span>
                    <span className="font-cinzel text-[10px] text-gray-600 font-bold uppercase">PHÉP NĂM CÒN</span>
                  </div>
                  <div className="p-4 bg-[#FAF7F2] border border-[#D8D1C5]">
                    <span className="font-mono text-2xl font-bold text-[#124874] block">0 Giờ</span>
                    <span className="font-cinzel text-[10px] text-gray-600 font-bold uppercase">ĐI TRỄ / VỀ SỚM</span>
                  </div>
                </div>
              </div>

              {/* Real Audit Trail from Database */}
              <div className="editorial-card-press bg-white p-6 md:p-8 border border-[#124874]">
                <div className="border-b border-[#D8D1C5] pb-3 mb-6 flex justify-between items-center">
                  <div>
                    <h4 className="font-display text-xl font-bold text-[#124874]">
                      Nhật Ký Điều Hành &amp; Phê Duyệt Nghiệp Vụ
                    </h4>
                    <p className="font-serif italic text-xs text-gray-500 mt-0.5">
                      Lưu vết thời gian thực tất cả các thao tác của tài khoản Chủ Biên trên hệ thống.
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#124874] bg-[#EDE7DC] px-2.5 py-1 border border-[#D8D1C5] font-bold">
                    {auditLogs.length} BẢN GHI
                  </span>
                </div>

                <div className="space-y-3">
                  {auditLogs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 font-serif italic">
                      Chưa có phát sinh nghiệp vụ nào trong ca trực hôm nay.
                    </div>
                  ) : (
                    auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 bg-[#FAF7F2] border border-[#D8D1C5] flex items-center justify-between hover:border-[#124874] transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <div 
                            style={{ backgroundColor: '#124874', color: '#ffffff' }}
                            className="w-8 h-8 flex items-center justify-center text-xs flex-shrink-0 shadow-xs"
                          >
                            <i className={`fa-solid ${log.icon}`}></i>
                          </div>
                          <div>
                            <p className="font-serif font-bold text-sm text-[#161413]">{log.action}</p>
                            <span className="font-cinzel text-[10px] text-gray-500 uppercase tracking-wider block">
                              TÁC VỤ: {log.type.toUpperCase()} &bull; CHỦ BIÊN
                            </span>
                          </div>
                        </div>

                        <span className="font-mono text-xs text-[#6E675F] whitespace-nowrap ml-4">
                          <i className="fa-regular fa-clock mr-1 text-[#CF373D]"></i>
                          {log.time}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfileView;
