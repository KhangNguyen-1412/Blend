import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { reservationsApi, customersApi } from '../services/api';

export const MemberProfileView = ({ onNavigateTab }) => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const [customerData, setCustomerData] = useState(null);
  const [myReservations, setMyReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for profile and password update
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: '',
    email: '',
    birthDate: '',
    address: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Fetch customer loyalty data from database
    Promise.all([
      customersApi.getAll(),
      reservationsApi.getAll()
    ]).then(([custRes, resvRes]) => {
      if (custRes.success && custRes.data) {
        // Find matching customer record by username, name or phone
        const matched = custRes.data.find(c => 
          (c.name && c.name.toLowerCase() === (user?.name || '').toLowerCase()) ||
          (user?.username && c.phone && c.phone.includes(user.username))
        );
        if (matched) {
          setCustomerData(matched);
          setProfileForm({
            name: matched.name || user?.name || '',
            phone: matched.phone || '',
            email: matched.email || '',
            birthDate: '1998-05-20',
            address: 'TP. Hồ Chí Minh'
          });
        } else {
          setProfileForm({
            name: user?.name || '',
            phone: '0908 xxx xxx',
            email: `${user?.username || 'khach'}@gmail.com`,
            birthDate: '1998-05-20',
            address: 'TP. Hồ Chí Minh'
          });
        }
      }

      if (resvRes.success && resvRes.data) {
        // Filter reservations matching customer name
        const myRes = resvRes.data.filter(r => 
          r.name && r.name.toLowerCase().includes((user?.name || '').toLowerCase().trim())
        );
        setMyReservations(myRes);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    addToast('Đã lưu cập nhật thông tin hồ sơ hội viên!', 'success');
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
    addToast('Đổi mật khẩu tài khoản hội viên thành công!', 'success');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const tier = customerData?.tier || 'Đồng';
  const spent = customerData?.spent || '0đ';

  return (
    <div className="bg-[#F7F4EE] min-h-screen text-[#161413] font-body pb-20 selection:bg-[#124874] selection:text-white">
      
      {/* Top Banner Navigation */}
      <div className="bg-[#FAF7F2] border-b-2 border-[#124874] py-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-[10px] uppercase tracking-widest text-[#6E675F] font-bold">
                MỤC ĐẶC BIỆT &bull; SỔ HỘI VIÊN
              </span>
              <span className="ink-stamp stamp-cerulean text-[9px] font-bold">
                <i className="fa-solid fa-gem text-[#C59B27] mr-1"></i> PATRON MEMBER
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#124874] tracking-tight mt-1">
              Trang Cá Nhân &amp; Đặc Quyền Hội Viên
            </h1>
            <p className="font-serif italic text-sm text-gray-600 mt-1">
              Theo dõi hạng thành viên, tích lũy điểm thưởng khi thưởng thức cà phê và lịch sử đặt bàn của quý khách.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab && onNavigateTab('menu')}
              className="press-btn px-4 py-2 bg-white border border-[#124874] text-[#124874] font-cinzel text-xs font-bold hover:bg-[#124874] hover:text-white transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-mug-saucer mr-1.5 text-[#CF373D]"></i> XEM THỰC ĐƠN
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab('booking')}
              style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
              className="press-btn px-4 py-2 font-cinzel text-xs font-bold hover:bg-[#AB282D] transition-colors shadow-xs cursor-pointer"
            >
              <i className="fa-solid fa-calendar-check mr-1.5"></i> ĐẶT BÀN MỚI
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-8 space-y-8">
        
        {/* Row 1: Patron Pass Digital Card & Tier Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left 5 cols: Vintage Newspaper Patron Member Pass */}
          <div className="lg:col-span-5 space-y-6">
            <div className="editorial-card-press bg-[#FCFAF6] p-6 border-2 border-[#124874] shadow-[6px_6px_0px_rgba(18,72,116,0.95)] relative overflow-hidden">
              
              {/* Card Gold Ribbon */}
              <div 
                style={{ backgroundColor: '#124874', color: '#ffffff' }}
                className="py-1.5 px-4 text-center -mx-6 -mt-6 mb-6 border-b-2 border-[#0D3656]"
              >
                <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] font-bold text-[#C59B27]">
                  &mdash; BLEND ROASTERY &bull; PATRON PASS &mdash;
                </span>
              </div>

              {/* Avatar Monogram & Member Tier Header */}
              <div className="text-center pb-5 border-b border-[#D8D1C5]">
                <div className="relative inline-block mb-3">
                  <div 
                    style={{ backgroundColor: '#CF373D', borderColor: '#124874', color: '#ffffff' }}
                    className="w-20 h-20 border-4 mx-auto flex items-center justify-center font-display font-black text-4xl shadow-[3px_3px_0px_rgba(18,72,116,0.9)]"
                  >
                    {(user?.name || 'K').charAt(0).toUpperCase()}
                  </div>
                  <div 
                    style={{ backgroundColor: '#C59B27', borderColor: '#124874', color: '#ffffff' }}
                    className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] shadow-xs"
                    title="Thành viên chính thức"
                  >
                    <i className="fa-solid fa-crown"></i>
                  </div>
                </div>

                <h3 className="font-display text-2xl font-bold text-[#124874] tracking-tight">
                  {user?.name || 'Quý Khách Hàng'}
                </h3>
                <p className="font-serif italic text-sm text-[#CF373D] font-bold mt-0.5">
                  HỘI VIÊN HẠNG {tier.toUpperCase()}
                </p>
                <p className="font-mono text-xs text-[#6E675F] mt-1 font-semibold">
                  Mã Thẻ: #BLD-{String(user?.id || 108).padStart(5, '0')}
                </p>
              </div>

              {/* Patron Pass Details */}
              <div className="py-4 space-y-2.5 font-body text-xs border-b border-[#D8D1C5]">
                <div className="flex justify-between items-center">
                  <span className="font-cinzel uppercase text-[#6E675F] font-bold">CHI TIÊU TÍCH LŨY:</span>
                  <span className="font-mono font-bold text-base text-[#124874]">{spent}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-cinzel uppercase text-[#6E675F] font-bold">ƯU ĐÃI THỰC ĐƠN:</span>
                  <span className="font-serif font-bold text-[#CF373D]">
                    {tier === 'Kim Cương' ? 'Giảm 15%' : tier === 'Vàng' ? 'Giảm 10%' : tier === 'Bạc' ? 'Giảm 5%' : 'Tích 3% Điểm'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-cinzel uppercase text-[#6E675F] font-bold">ĐIỂM THƯỞNG ĐỔI QUÀ:</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {Math.floor((customerData?.spent_num || 0) * 0.03 / 1000)} Điểm
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-cinzel uppercase text-[#6E675F] font-bold">NGÀY GIA NHẬP:</span>
                  <span className="font-mono font-bold text-gray-700">Tháng 08/2026</span>
                </div>
              </div>

              {/* Barcode / QR Scan Box */}
              <div className="pt-4 text-center space-y-2">
                <span className="font-cinzel text-[9px] uppercase tracking-widest text-[#6E675F] font-bold block">
                  MÃ QUÉT TÍCH ĐIỂM TẠI QUẦY THU NGÂN:
                </span>
                <div className="p-3 bg-white border border-[#124874] flex flex-col items-center justify-center space-y-1">
                  {/* Decorative Barcode Lines */}
                  <div className="flex items-center justify-center gap-1 h-10 w-full px-4 overflow-hidden">
                    {[3, 1, 4, 2, 5, 2, 1, 3, 4, 1, 2, 5, 3, 2, 4, 1, 3, 2, 4, 1, 5, 2, 3, 1, 4].map((w, i) => (
                      <div 
                        key={i} 
                        style={{ width: `${w * 2.5}px` }} 
                        className="bg-[#124874] h-full"
                      ></div>
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-[#124874] font-bold tracking-widest">
                    * BLD-{String(user?.id || 108).padStart(6, '0')} *
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Right 7 cols: 4-Tier Loyalty System Progression & Benefits */}
          <div className="lg:col-span-7 space-y-6">
            <div className="editorial-card-press bg-white p-6 md:p-8 border border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.9)]">
              <div className="border-b border-[#D8D1C5] pb-3 mb-6 flex justify-between items-center">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#124874]">
                    Chính Sách Đặc Quyền &amp; Hạng Hội Viên Blend
                  </h3>
                  <p className="font-serif italic text-xs text-gray-500 mt-0.5">
                    Tự động nâng hạng khi chi tiêu tích lũy qua mỗi hóa đơn tại quầy bar và đặt món.
                  </p>
                </div>
                <span className="ink-stamp stamp-cerulean text-[10px] font-bold">
                  4 CẤP BẬC
                </span>
              </div>

              {/* 4 Tiers Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body">
                
                {/* Tier 1: Bronze */}
                <div className={`p-4 border-2 transition-all ${
                  tier === 'Đồng' ? 'border-[#CF373D] bg-[#FAF7F2] shadow-sm' : 'border-[#D8D1C5] bg-white'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-cinzel text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5">
                      <i className="fa-solid fa-medal text-amber-700"></i> HẠNG ĐỒNG
                    </span>
                    <span className="font-mono text-[10px] font-bold bg-[#EDE7DC] px-2 py-0.5 border border-[#D8D1C5]">
                      Mặc định
                    </span>
                  </div>
                  <ul className="text-xs font-serif text-gray-700 space-y-1.5 list-disc list-inside">
                    <li>Tích lũy 3% giá trị đơn hàng vào điểm thưởng.</li>
                    <li>Tặng 1 đồ uống đặc trưng vào ngày sinh nhật.</li>
                    <li>Nhận thư thông báo các mẻ rang hạt mới nhất.</li>
                  </ul>
                </div>

                {/* Tier 2: Silver */}
                <div className={`p-4 border-2 transition-all ${
                  tier === 'Bạc' ? 'border-[#CF373D] bg-[#FAF7F2] shadow-sm' : 'border-[#D8D1C5] bg-white'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-cinzel text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                      <i className="fa-solid fa-medal text-slate-500"></i> HẠNG BẠC
                    </span>
                    <span className="font-mono text-[10px] font-bold bg-[#EDE7DC] px-2 py-0.5 border border-[#D8D1C5]">
                      Từ 500.000đ
                    </span>
                  </div>
                  <ul className="text-xs font-serif text-gray-700 space-y-1.5 list-disc list-inside">
                    <li><strong className="text-[#CF373D]">Giảm 5%</strong> trực tiếp trên mọi hóa đơn đồ uống.</li>
                    <li>Miễn phí nâng cấp size (Size M lên Size L).</li>
                    <li>Ưu tiên chuẩn bị đơn hàng mang đi nhanh chóng.</li>
                  </ul>
                </div>

                {/* Tier 3: Gold */}
                <div className={`p-4 border-2 transition-all ${
                  tier === 'Vàng' ? 'border-[#CF373D] bg-[#FAF7F2] shadow-sm' : 'border-[#D8D1C5] bg-white'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-cinzel text-xs font-bold text-amber-600 uppercase flex items-center gap-1.5">
                      <i className="fa-solid fa-crown text-amber-500"></i> HẠNG VÀNG
                    </span>
                    <span className="font-mono text-[10px] font-bold bg-[#EDE7DC] px-2 py-0.5 border border-[#D8D1C5]">
                      Từ 2.000.000đ
                    </span>
                  </div>
                  <ul className="text-xs font-serif text-gray-700 space-y-1.5 list-disc list-inside">
                    <li><strong className="text-[#CF373D]">Giảm 10%</strong> toàn bộ thực đơn cà phê &amp; trà.</li>
                    <li>Ưu tiên đặt bàn đọc báo tại các vị trí view đẹp nhất.</li>
                    <li>1 vé mời tham gia buổi thử nếm cà phê mộc (*Cupping*).</li>
                  </ul>
                </div>

                {/* Tier 4: Diamond */}
                <div className={`p-4 border-2 transition-all ${
                  tier === 'Kim Cương' ? 'border-[#CF373D] bg-[#FAF7F2] shadow-sm' : 'border-[#D8D1C5] bg-white'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-cinzel text-xs font-bold text-purple-900 uppercase flex items-center gap-1.5">
                      <i className="fa-solid fa-gem text-purple-700"></i> KIM CƯƠNG
                    </span>
                    <span className="font-mono text-[10px] font-bold bg-[#EDE7DC] px-2 py-0.5 border border-[#D8D1C5]">
                      Từ 5.000.000đ
                    </span>
                  </div>
                  <ul className="text-xs font-serif text-gray-700 space-y-1.5 list-disc list-inside">
                    <li><strong className="text-[#CF373D]">Giảm 15%</strong> cao cấp cho mọi dịch vụ.</li>
                    <li>Tặng hộp quà cà phê hạt rang mộc thượng hạng hàng quý.</li>
                    <li>Khu vực bàn làm việc &amp; tiếp khách VIP riêng biệt.</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* My Table Bookings Quick Card */}
            <div className="editorial-card-press bg-white p-6 border border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.9)]">
              <div className="border-b border-[#D8D1C5] pb-3 mb-4 flex justify-between items-center">
                <h4 className="font-display text-lg font-bold text-[#124874]">
                  Lịch Sử Đặt Chỗ Của Quý Khách
                </h4>
                <span className="font-mono text-xs text-[#124874] font-bold">
                  {myReservations.length} LƯỢT ĐẶT
                </span>
              </div>

              {myReservations.length === 0 ? (
                <div className="p-6 text-center text-gray-500 font-serif italic bg-[#FAF7F2] border border-dashed border-[#D8D1C5]">
                  Quý khách chưa có lượt đặt bàn nào gần đây. Hãy chọn bàn để tận hưởng không gian đọc báo in cổ điển của Blend!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myReservations.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 bg-[#FAF7F2] border border-[#D8D1C5] flex items-center justify-between hover:border-[#124874] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          style={{ backgroundColor: '#124874', color: '#ffffff' }}
                          className="w-8 h-8 flex items-center justify-center text-xs flex-shrink-0"
                        >
                          <i className="fa-solid fa-calendar-day"></i>
                        </div>
                        <div>
                          <p className="font-serif font-bold text-sm text-[#161413]">
                            {r.area} &bull; {r.guests} Khách
                          </p>
                          <span className="font-mono text-[11px] text-gray-500">
                            {r.date} vào lúc {r.time}
                          </span>
                        </div>
                      </div>

                      <span className={`ink-stamp text-[9px] ${
                        r.status === 'Đã tiếp nhận' ? 'stamp-navy' : 'stamp-amber'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Row 2: Account Settings & Security Forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Form 1: Profile Information */}
          <div className="editorial-card-press bg-white p-6 md:p-8 border border-[#124874]">
            <div className="border-b border-[#D8D1C5] pb-3 mb-5">
              <h4 className="font-display text-xl font-bold text-[#124874]">
                Hồ Sơ Cá Nhân &amp; Nhận Quà Sinh Nhật
              </h4>
              <p className="font-serif italic text-xs text-gray-500 mt-0.5">
                Cập nhật ngày sinh và số điện thoại để hệ thống tự động gửi quà tặng sinh nhật cho hội viên.
              </p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                  Họ và Tên Quý Khách *
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-[#FCFAF6] border border-[#124874] px-3.5 py-2 font-serif text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                    Số Điện Thoại
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-[#FCFAF6] border border-[#124874] px-3.5 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                  />
                </div>

                <div>
                  <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                    Ngày Sinh (Nhận Quà)
                  </label>
                  <input
                    type="date"
                    value={profileForm.birthDate}
                    onChange={(e) => setProfileForm({ ...profileForm, birthDate: e.target.value })}
                    className="w-full bg-[#FCFAF6] border border-[#124874] px-3.5 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                  Địa Chỉ Email Liên Lạc
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full bg-[#FCFAF6] border border-[#124874] px-3.5 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  style={{ backgroundColor: '#124874', color: '#ffffff' }}
                  className="press-btn px-6 py-2 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-floppy-disk"></i> LƯU THAY ĐỔI
                </button>
              </div>
            </form>
          </div>

          {/* Form 2: Change Password & Security */}
          <div className="editorial-card-press bg-white p-6 md:p-8 border border-[#124874] flex flex-col justify-between">
            <div>
              <div className="border-b border-[#D8D1C5] pb-3 mb-5">
                <h4 className="font-display text-xl font-bold text-[#124874]">
                  Bảo Mật &amp; Đổi Mật Khẩu
                </h4>
                <p className="font-serif italic text-xs text-gray-500 mt-0.5">
                  Đổi mật khẩu định kỳ để bảo vệ quyền lợi tích điểm của tài khoản.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-3.5">
                <div>
                  <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                    Mật Khẩu Hiện Tại *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full bg-[#FCFAF6] border border-[#124874] px-3.5 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                      Mật Khẩu Mới *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full bg-[#FCFAF6] border border-[#124874] px-3.5 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                      Xác Nhận Mật Khẩu *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full bg-[#FCFAF6] border border-[#124874] px-3.5 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
                    className="press-btn px-6 py-2 font-cinzel text-xs font-bold hover:bg-[#AB282D] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-key"></i> ĐỔI MẬT KHẨU
                  </button>
                </div>
              </form>
            </div>

            {/* Logout Action Bar */}
            <div className="mt-6 pt-4 border-t border-[#D8D1C5] flex justify-between items-center">
              <span className="font-serif italic text-xs text-gray-500">
                Phiên đăng nhập: @{user?.username}
              </span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  addToast('Đã đăng xuất tài khoản hội viên. Hẹn sớm gặp lại quý khách tại Blend!', 'info');
                  if (onNavigateTab) onNavigateTab('home');
                }}
                className="press-btn px-4 py-1.5 bg-white border border-[#CF373D] text-[#CF373D] hover:bg-[#CF373D] hover:text-white font-cinzel text-xs font-bold transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-arrow-right-from-bracket mr-1.5"></i> ĐĂNG XUẤT
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MemberProfileView;
