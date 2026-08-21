import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TermsModal from '../components/common/TermsModal';
import MembershipPolicyModal from '../components/common/MembershipPolicyModal';

export const AuthView = ({ 
  initialMode = 'login', 
  onNavigateLanding, 
  onNavigateTerms,
  onNavigatePolicy,
  onLoginSuccess 
}) => {
  const { login, register, forgotPassword, loading } = useAuth();
  const { addToast } = useToast();

  // Screen Mode: 'login' | 'register' | 'forgot'
  const [mode, setMode] = useState(initialMode || 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [recoveryStep, setRecoveryStep] = useState(1);
  const [otpCode, setOtpCode] = useState('');

  // Modals for Terms & Membership Policy
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isMembershipPolicyModalOpen, setIsMembershipPolicyModalOpen] = useState(false);

  // Form States
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [forgotForm, setForgotForm] = useState({
    identity: ''
  });
  const [unlocked, setUnlocked] = useState(false);
  const unlock = () => setUnlocked(true);

  // Reset all forms when switching modes and wipe any browser autofill
  useEffect(() => {
    setLoginForm({ username: '', password: '' });
    setRegisterForm({
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setForgotForm({ identity: '' });

    const t1 = setTimeout(() => {
      setLoginForm({ username: '', password: '' });
      setRegisterForm({ name: '', username: '', email: '', phone: '', password: '', confirmPassword: '' });
    }, 40);

    const t2 = setTimeout(() => {
      setLoginForm({ username: '', password: '' });
      setRegisterForm({ name: '', username: '', email: '', phone: '', password: '', confirmPassword: '' });
    }, 150);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [mode]);

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.username.trim() || !loginForm.password) {
      addToast('Vui lòng nhập tên đăng nhập/email và mật khẩu', 'error');
      return;
    }
    try {
      const res = await login(loginForm);
      addToast(res.message || 'Đăng nhập thành công!', 'success');
      if (onLoginSuccess && res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      addToast(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.', 'error');
    }
  };

  // Handle Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerForm.name.trim() || !registerForm.username.trim() || !registerForm.password) {
      addToast('Vui lòng điền đầy đủ các thông tin bắt buộc (*)', 'error');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      addToast('Mật khẩu xác nhận không khớp!', 'error');
      return;
    }
    if (registerForm.password.length < 6) {
      addToast('Mật khẩu phải có tối thiểu 6 ký tự', 'error');
      return;
    }
    if (!agreeTerms) {
      addToast('Vui lòng đồng ý với điều khoản dịch vụ của Blend', 'error');
      return;
    }
    try {
      const res = await register({
        ...registerForm,
        role: 'customer'
      });
      addToast(res.message || 'Tạo tài khoản thành công! Chào mừng quý khách đến với Blend.', 'success');
      if (onLoginSuccess && res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      addToast(err.message || 'Không thể tạo tài khoản. Vui lòng thử lại.', 'error');
    }
  };

  // Handle Forgot Password
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotForm.identity.trim()) {
      addToast('Vui lòng nhập email hoặc tên đăng nhập của bạn', 'error');
      return;
    }
    try {
      await forgotPassword(forgotForm);
      setRecoveryStep(2);
      addToast('Đã gửi mã xác minh khôi phục mật khẩu!', 'success');
    } catch (err) {
      addToast(err.message || 'Không tìm thấy thông tin tài khoản', 'error');
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      addToast('Vui lòng nhập đầy đủ mã xác minh OTP', 'error');
      return;
    }
    addToast('Xác thực thành công! Mật khẩu mới đã được cập nhật.', 'success');
    setMode('login');
    setRecoveryStep(1);
    setForgotForm({ identity: '' });
    setOtpCode('');
  };

  // =========================================================================
  // BỐ CỤC 1: ĐĂNG NHẬP (SPLITSCREEN CỔ ĐIỂN 50/50 - XANH CERULEAN #124874)
  // =========================================================================
  if (mode === 'login') {
    return (
      <div 
        key="auth-login-screen" 
        className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F7F4EE] font-body text-[#161413] selection:bg-[#CF373D] selection:text-white animate-auth-page"
      >
        {/* NỬA TRÁI (50%): Báo in trang nhất Cerulean Blue */}
        <div 
          style={{ backgroundColor: '#124874' }}
          className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden border-b-4 lg:border-b-0 lg:border-r-4 border-[#0D3656] shadow-2xl animate-auth-slide-left"
        >
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          ></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between text-[11px] font-cinzel tracking-[0.2em] text-[#C59B27] border-b border-white/20 pb-3 mb-6 font-bold">
              <button
                type="button"
                onClick={onNavigateLanding}
                className="px-3 py-1 bg-white/15 hover:bg-white text-white hover:text-[#124874] border border-white/30 font-cinzel text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs group cursor-pointer"
                title="Quay lại Trang Chủ Giới Thiệu (Landing Page)"
              >
                <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                <span>QUAY LẠI TRANG CHỦ</span>
              </button>
              <span className="font-mono text-white/80">VOL. IV &bull; 2026</span>
            </div>

            <div 
              onClick={onNavigateLanding}
              className="flex items-center gap-3.5 cursor-pointer group hover:opacity-90 transition-opacity mb-2"
              title="Nhấp để quay lại Trang Chủ"
            >
              <img 
                src="/logo.png" 
                alt="Blend Logo" 
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-md group-hover:scale-105 transition-transform" 
              />
              <div>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
                  Blend<span style={{ color: '#CF373D' }} className="font-mono">.</span>
                </h1>
                <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.2em] text-[#C59B27] font-bold block mt-1 uppercase">
                  THE SYSTEM &bull; SAIGON 2026
                </span>
              </div>
            </div>

            <div className="flex items-center my-3 text-xs">
              <span className="h-[1px] bg-white/30 flex-1"></span>
              <span className="px-3 font-cinzel text-[10px] tracking-widest text-[#C59B27] font-bold">ẤN BẢN TRANG NHẤT</span>
              <span className="h-[1px] bg-white/30 flex-1"></span>
            </div>

            <p className="font-serif italic text-base text-blue-100 mb-8 max-w-md">
              Cổng Đăng Nhập Quản Trị &amp; Tài Khoản Thành Viên Blend.
            </p>
          </div>

          {/* Center Broadsheet News Card */}
          <div className="relative z-10 bg-[#FCFAF6] text-[#161413] border-2 border-white p-6 sm:p-8 shadow-[6px_6px_0px_rgba(0,0,0,0.35)] my-6">
            <div className="border-b-2 border-[#124874] pb-3 mb-4 flex justify-between items-start">
              <div>
                <span className="font-cinzel text-[10px] uppercase tracking-widest text-[#6E675F] block font-bold">
                  BẢN TIN CHÀO NGÀY MỚI
                </span>
                <h2 className="font-display text-2xl font-bold text-[#124874] tracking-tight">
                  Khởi Động Ngày Mới Cùng Hương Vị Thủ Công
                </h2>
              </div>
              <span className="ink-stamp stamp-cerulean text-[10px] font-bold">
                XÁC THỰC
              </span>
            </div>

            <p className="drop-cap text-base leading-relaxed text-gray-800 font-serif mb-4">
              Mỗi mẻ cà phê Arabica Cầu Đất rang mộc và lá trà Oolong tuyển chọn được pha chế đều ghi dấu sự tỉ mỉ của nghệ nhân Blend. Hãy đăng nhập để tiếp tục hành trình trải nghiệm hương vị và theo dõi tài khoản của bạn.
            </p>

            <div className="pt-3 border-t border-[#D8D1C5] flex justify-between items-center text-xs font-mono text-[#124874] font-bold">
              <span><i className="fa-solid fa-clock mr-1 text-[#CF373D]"></i> HỆ THỐNG MỞ CỬA: 06:30 &mdash; 22:30</span>
              <span className="text-[#CF373D]">SAIGON FLAGSHIP</span>
            </div>
          </div>

          <div className="relative z-10 border-t border-white/20 pt-4 flex justify-between items-center text-xs font-serif text-blue-100">
            <span>&bull; Trực tuyến an toàn với mã hóa chuẩn</span>
            <span className="font-cinzel text-[10px] tracking-widest text-white font-bold">BLEND SAIGON PRESS</span>
          </div>
        </div>

        {/* NỬA PHẢI (50%): Form Đăng nhập Đơn Cột */}
        <div className="w-full lg:w-1/2 p-6 sm:p-12 md:p-16 flex flex-col justify-center bg-[#F7F4EE] animate-auth-slide-right">
          <div className="max-w-md w-full mx-auto">
            <div className="editorial-card-press bg-[#FCFAF6] p-6 sm:p-10 border-2 border-[#124874] shadow-[8px_8px_0px_rgba(18,72,116,0.95)]">
              
              {/* Back to Home Quick Bar */}
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#D8D1C5]">
                <button
                  type="button"
                  onClick={onNavigateLanding}
                  className="font-cinzel text-xs font-bold text-[#124874] hover:text-[#CF373D] flex items-center gap-1.5 transition-colors group cursor-pointer"
                  title="Quay lại Trang Chủ Giới Thiệu"
                >
                  <i className="fa-solid fa-arrow-left text-[11px] group-hover:-translate-x-1 transition-transform"></i>
                  <span>QUAY LẠI TRANG CHỦ</span>
                </button>
                <span className="font-mono text-[10px] text-gray-500 font-bold">PORTAL 2026</span>
              </div>

              <div className="border-b-2 border-[#124874] pb-4 mb-6">
                <span className="font-cinzel text-[10px] tracking-widest text-[#6E675F] uppercase font-bold block mb-1">
                  ĐĂNG NHẬP HỆ THỐNG
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-[#124874] tracking-tight">
                  Chào Mừng Trở Lại
                </h2>
                <p className="font-serif italic text-sm text-gray-600 mt-1">
                  Nhập thông tin tài khoản của bạn để tiếp tục ca trực.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4 font-body">
                {/* Decoy fields to capture aggressive browser autofill */}
                <input type="text" name="bld_decoy_user_login" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
                <input type="password" name="bld_decoy_pwd_login" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

                <div>
                  <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
                    Tên Đăng Nhập Hoặc Email *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="blend_login_user_field"
                      autoComplete="new-password"
                      readOnly={!unlocked}
                      onFocus={unlock}
                      onMouseDown={unlock}
                      onTouchStart={unlock}
                      required
                      placeholder="Nhập tên đăng nhập hoặc email..."
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      className="w-full bg-white border border-[#124874] pl-10 pr-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                    <i className="fa-solid fa-user absolute left-3.5 top-3.5 text-[#124874] text-xs"></i>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider">
                      Mật Khẩu *
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="font-serif italic text-xs text-[#CF373D] hover:underline"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="blend_login_pwd_field"
                      autoComplete="new-password"
                      readOnly={!unlocked}
                      onFocus={unlock}
                      onMouseDown={unlock}
                      onTouchStart={unlock}
                      required
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full bg-white border border-[#124874] pl-10 pr-10 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                    <i className="fa-solid fa-lock absolute left-3.5 top-3.5 text-[#124874] text-xs"></i>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-gray-400 hover:text-[#124874]"
                    >
                      <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 accent-[#124874]"
                    />
                    <span className="font-serif text-gray-700">Ghi nhớ phiên đăng nhập</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: '#124874', color: '#ffffff' }}
                  className="press-btn w-full py-3 font-cinzel text-sm font-bold hover:bg-[#CF373D] transition-colors shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  {loading ? (
                    <span><i className="fa-solid fa-spinner fa-spin mr-2"></i>ĐANG XÁC THỰC...</span>
                  ) : (
                    <span><i className="fa-solid fa-right-to-bracket mr-2"></i>ĐĂNG NHẬP VÀO HỆ THỐNG</span>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-[#D8D1C5] text-center">
                <p className="font-serif text-sm text-gray-700">
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="font-bold text-[#CF373D] hover:underline font-serif ml-1 cursor-pointer"
                  >
                    Đăng ký tài khoản mới &rarr;
                  </button>
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Interactive Legal Modals Mounted Directly in Login View */}
        <TermsModal
          isOpen={isTermsModalOpen}
          onClose={() => setIsTermsModalOpen(false)}
        />

        <MembershipPolicyModal
          isOpen={isMembershipPolicyModalOpen}
          onClose={() => setIsMembershipPolicyModalOpen(false)}
        />

      </div>
    );
  }

  // =========================================================================
  // BỐ CỤC 2: ĐĂNG KÝ (BỐ CỤC ĐẢO CHIỀU 55/45 - ĐỎ JASPER #CF373D)
  // Form nằm bên TRÁI (55%), Bằng Chứng Nhận Hội Viên Khổng Lồ bên PHẢI (45%)
  // =========================================================================
  if (mode === 'register') {
    return (
      <div 
        key="auth-register-screen"
        className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F7F4EE] font-body text-[#161413] selection:bg-[#124874] selection:text-white animate-auth-page"
      >
        {/* BÊN TRÁI (55%): Form Đăng Ký Rộng 2 Cột Giấy Báo */}
        <div className="w-full lg:w-[55%] p-6 sm:p-10 md:p-14 flex flex-col justify-center bg-[#F7F4EE] border-b-4 lg:border-b-0 lg:border-r-4 border-[#D8D1C5] animate-auth-slide-left">
          <div className="max-w-xl w-full mx-auto">
            <div className="editorial-card-press bg-[#FCFAF6] p-6 sm:p-8 md:p-10 border-2 border-[#CF373D] shadow-[8px_8px_0px_rgba(207,55,61,0.95)]">
              
              {/* Back to Home Quick Bar */}
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#D8D1C5]">
                <button
                  type="button"
                  onClick={onNavigateLanding}
                  className="font-cinzel text-xs font-bold text-[#124874] hover:text-[#CF373D] flex items-center gap-1.5 transition-colors group cursor-pointer"
                  title="Quay lại Trang Chủ Giới Thiệu"
                >
                  <i className="fa-solid fa-arrow-left text-[11px] group-hover:-translate-x-1 transition-transform"></i>
                  <span>QUAY LẠI TRANG CHỦ</span>
                </button>
                <span className="font-mono text-[10px] text-gray-500 font-bold">BLEND SAIGON GUILD</span>
              </div>

              <div className="border-b-2 border-[#CF373D] pb-4 mb-6 flex justify-between items-start gap-3">
                <div className="flex items-center gap-3">
                  <img 
                    src="/logo.png" 
                    alt="Blend Logo" 
                    className="w-11 h-11 object-contain drop-shadow-sm flex-shrink-0" 
                  />
                  <div>
                    <span className="font-cinzel text-[10px] tracking-widest text-[#6E675F] uppercase font-bold block mb-0.5">
                      ĐĂNG KÝ HỘI VIÊN MỚI
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#CF373D] tracking-tight leading-tight">
                      Tạo Tài Khoản
                    </h2>
                  </div>
                </div>
                <span className="ink-stamp stamp-jasper text-[9px] font-bold flex-shrink-0">
                  HỒ SƠ MỚI
                </span>
              </div>

              <form onSubmit={handleRegisterSubmit} autoComplete="off" className="space-y-3.5 font-body">
                {/* Decoy fields to capture aggressive browser autofill */}
                <input type="text" name="bld_decoy_user_reg" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
                <input type="password" name="bld_decoy_pwd_reg" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

                <div>
                  <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                    Họ và Tên Đầy Đủ *
                  </label>
                  <input
                    type="text"
                    name="blend_reg_fullname"
                    autoComplete="off"
                    required
                    placeholder="VD: Nguyễn Hoàng Phúc"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    className="w-full bg-white border border-[#124874] px-4 py-2 font-serif text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                      Tên Đăng Nhập (Username) *
                    </label>
                    <input
                      type="text"
                      name="blend_reg_usr_field"
                      autoComplete="new-password"
                      readOnly={!unlocked}
                      onFocus={unlock}
                      onMouseDown={unlock}
                      onTouchStart={unlock}
                      required
                      placeholder="VD: hoangphuc"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                      className="w-full bg-white border border-[#124874] px-3.5 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                      Số Điện Thoại
                    </label>
                    <input
                      type="text"
                      name="blend_reg_phone"
                      autoComplete="off"
                      placeholder="0908xxxxxx"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                      className="w-full bg-white border border-[#124874] px-3.5 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                    Địa Chỉ Email
                  </label>
                  <input
                    type="email"
                    name="blend_reg_email_field"
                    autoComplete="off"
                    placeholder="email@vidu.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="w-full bg-white border border-[#124874] px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                      Mật Khẩu *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="blend_reg_pwd_field"
                        autoComplete="new-password"
                        readOnly={!unlocked}
                        onFocus={unlock}
                        onMouseDown={unlock}
                        onTouchStart={unlock}
                        required
                        placeholder="Tối thiểu 6 ký tự"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        className="w-full bg-white border border-[#124874] px-3.5 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-gray-400 hover:text-[#124874]"
                      >
                        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                      Xác Nhận Mật Khẩu *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="blend_reg_cpwd_field"
                        autoComplete="new-password"
                        readOnly={!unlocked}
                        onFocus={unlock}
                        onMouseDown={unlock}
                        onTouchStart={unlock}
                        required
                        placeholder="Nhập lại mật khẩu"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        className="w-full bg-white border border-[#124874] px-3.5 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-2.5 text-gray-400 hover:text-[#124874]"
                      >
                        <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-1 flex items-start gap-2 text-xs">
                  <input
                    id="agreeTermsInput"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-[#CF373D] cursor-pointer flex-shrink-0"
                  />
                  <div className="font-serif text-gray-700 leading-snug">
                    <label htmlFor="agreeTermsInput" className="cursor-pointer">
                      Tôi đồng ý với các{' '}
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onNavigateTerms) onNavigateTerms();
                        else setIsTermsModalOpen(true);
                      }}
                      className="text-[#CF373D] font-bold underline hover:text-[#124874] cursor-pointer inline p-0 bg-transparent border-none text-xs align-baseline"
                    >
                      Điều khoản dịch vụ
                    </button>
                    <label htmlFor="agreeTermsInput" className="cursor-pointer">
                      {' '}&amp;{' '}
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onNavigatePolicy) onNavigatePolicy();
                        else setIsMembershipPolicyModalOpen(true);
                      }}
                      className="text-[#CF373D] font-bold underline hover:text-[#124874] cursor-pointer inline p-0 bg-transparent border-none text-xs align-baseline"
                    >
                      Chính sách hội viên
                    </button>
                    <label htmlFor="agreeTermsInput" className="cursor-pointer">
                      {' '}của Blend.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
                  className="press-btn w-full py-3 font-cinzel text-sm font-bold hover:bg-[#AB282D] transition-colors shadow-md flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <span><i className="fa-solid fa-spinner fa-spin mr-2"></i>ĐANG XỬ LÝ...</span>
                  ) : (
                    <span><i className="fa-solid fa-user-plus mr-2"></i>HOÀN TẤT ĐĂNG KÝ HỘI VIÊN</span>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-[#D8D1C5] text-center">
                <p className="font-serif text-sm text-gray-700">
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-bold text-[#124874] hover:underline font-serif ml-1"
                  >
                    Đăng nhập ngay &rarr;
                  </button>
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* BÊN PHẢI (45%): Bằng Chứng Nhận Hội Viên Nền Đỏ Jasper (#CF373D) */}
        <div 
          style={{ backgroundColor: '#CF373D' }}
          className="w-full lg:w-[45%] p-8 sm:p-12 lg:p-14 flex flex-col justify-between text-white relative overflow-hidden shadow-2xl animate-auth-slide-right"
        >
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          ></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between text-[11px] font-cinzel tracking-[0.25em] text-amber-200 border-b border-white/20 pb-2 mb-6 font-bold">
              <span>&mdash; PATRONS &amp; MEMBERSHIP GUILD &mdash;</span>
              <span className="font-mono text-white/80">SAIGON 2026</span>
            </div>

            <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2 leading-tight">
              Gia Nhập Cộng Đồng Thưởng Thức Blend
            </h3>
            <p className="font-serif italic text-sm text-red-100 mb-6">
              Đặc quyền thưởng thức &amp; chính sách tích lũy trọn đời tại Blend.
            </p>
          </div>

          {/* Certificate Docket */}
          <div className="relative z-10 bg-[#FCFAF6] text-[#161413] border-2 border-white p-6 shadow-[6px_6px_0px_rgba(0,0,0,0.35)] my-4">
            <div className="border-b border-[#CF373D] pb-3 mb-3 text-center">
              <span className="font-cinzel text-[9px] uppercase tracking-widest text-[#6E675F] block font-bold">
                BẢN CAM KẾT ĐẶC QUYỀN
              </span>
              <h3 className="font-display text-xl font-bold text-[#CF373D]">
                Quyền Lợi Hội Viên Danh Dự
              </h3>
            </div>

            <ul className="space-y-2.5 font-serif text-xs text-gray-800">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-crown text-amber-700 mt-0.5"></i>
                <span><strong>Tích lũy 5% &mdash; 10%</strong> giá trị đơn vào ví thưởng.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-mug-hot text-[#CF373D] mt-0.5"></i>
                <span><strong>Nếm thử menu mùa vụ:</strong> Vé thử nghiệm các dòng trà ủ lạnh độc quyền.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-gift text-emerald-700 mt-0.5"></i>
                <span><strong>Quà tặng sinh nhật:</strong> Voucher giảm giá 30% và ấn phẩm đặc san Blend.</span>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-[#D8D1C5] flex justify-between items-center text-[10px] font-mono text-[#CF373D] font-bold">
              <span><i className="fa-solid fa-users mr-1"></i> 1,280+ HỘI VIÊN ĐÃ GIA NHẬP</span>
              <span className="text-gray-500">EST. 2024</span>
            </div>
          </div>

          <div className="relative z-10 border-t border-white/20 pt-3 flex justify-between items-center text-xs font-serif text-red-100">
            <span>&bull; Kích hoạt tức thì ngay sau khi đăng ký</span>
            <span className="font-cinzel text-[10px] tracking-widest text-white font-bold">JOIN THE GUILD</span>
          </div>
        </div>

        {/* Interactive Legal Modals Mounted Directly in Register View */}
        <TermsModal
          isOpen={isTermsModalOpen}
          onClose={() => setIsTermsModalOpen(false)}
        />

        <MembershipPolicyModal
          isOpen={isMembershipPolicyModalOpen}
          onClose={() => setIsMembershipPolicyModalOpen(false)}
        />

      </div>
    );
  }

  // =========================================================================
  // BỐ CỤC 3: QUÊN MẬT KHẨU (BỐ CỤC KHUNG BẢO MẬT CĂN GIỮA - CENTERED FLOATING VAULT DOCKET)
  // Không chia đôi toàn màn hình, mà là 1 Thẻ Hồ Sơ Bảo Mật Lớn Nổi Chính Giữa!
  // =========================================================================
  return (
    <div 
      key="auth-forgot-screen"
      className="min-h-screen w-full bg-[#F7F4EE] font-body text-[#161413] flex flex-col justify-between selection:bg-[#124874] selection:text-white animate-auth-page"
    >
      {/* Top Banner Navigation Strip */}
      <header 
        style={{ backgroundColor: '#0D2C44', color: '#ffffff' }}
        className="px-6 py-3.5 flex justify-between items-center border-b-2 border-[#071927] shadow-md flex-shrink-0"
      >
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Blend Logo" 
            className="w-8 h-8 object-contain drop-shadow-sm" 
          />
          <h1 
            onClick={onNavigateLanding}
            className="font-display text-2xl font-black tracking-tight text-white leading-none cursor-pointer hover:opacity-90 transition-opacity"
            title="Quay lại Trang Chủ"
          >
            Blend<span style={{ color: '#CF373D' }} className="font-mono">.</span>
          </h1>
          <span className="text-white/40 hidden sm:inline">&bull;</span>
          <span className="font-cinzel text-[11px] tracking-widest text-cyan-300 font-bold hidden sm:inline uppercase">
            SECURITY ARCHIVAL DESK &bull; HỒ SƠ CỨU HỘ
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateLanding}
            className="press-btn px-3 py-1.5 bg-white/10 text-white border border-white/20 font-cinzel text-xs font-bold hover:bg-white hover:text-[#0D2C44] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <i className="fa-solid fa-arrow-left text-[10px]"></i>
            <span>QUAY LẠI TRANG CHỦ</span>
          </button>
          <button
            onClick={() => { setMode('login'); setRecoveryStep(1); }}
            className="press-btn px-3.5 py-1.5 bg-white text-[#0D2C44] font-cinzel text-xs font-bold hover:bg-[#CF373D] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <i className="fa-solid fa-key text-[10px]"></i>
            <span>ĐĂNG NHẬP</span>
          </button>
        </div>
      </header>

      {/* Main Centered Floating Archival Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 my-auto">
        <div className="w-full max-w-4xl bg-[#FCFAF6] border-2 border-[#0D2C44] shadow-[12px_12px_0px_rgba(13,44,68,0.95)] overflow-hidden animate-auth-scale">
          
          {/* Card Header Strip */}
          <div 
            style={{ backgroundColor: '#0D2C44', color: '#ffffff' }}
            className="p-6 border-b-2 border-[#071927] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <span className="font-cinzel text-[10px] tracking-widest text-cyan-300 uppercase font-bold block mb-0.5">
                QUY TRÌNH BẢO MẬT &amp; CẤP LẠI MẬT KHẨU
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Khôi Phục Quyền Truy Cập Tài Khoản
              </h2>
            </div>
            <span className="ink-stamp stamp-amber text-[10px] font-bold self-start sm:self-center">
              MÃ HÓA 256-BIT
            </span>
          </div>

          {/* Card Interior Split: Left 5 Cols (Roadmap) + Right 7 Cols (Form) */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#D8D1C5]">
            
            {/* Left Column (5 Cols): 3-Step Verification Roadmap */}
            <div className="md:col-span-5 p-6 sm:p-8 bg-[#FAF7F2] space-y-4">
              <span className="font-cinzel text-xs font-bold text-[#0D2C44] uppercase tracking-wider block border-b border-[#D8D1C5] pb-2">
                TIẾN TRÌNH 3 BƯỚC AN TOÀN
              </span>

              <div className="space-y-3 font-body text-xs text-gray-800">
                <div className={`flex items-start gap-3 p-2.5 border transition-colors ${
                  recoveryStep === 1 ? 'bg-white border-[#0D2C44] shadow-xs' : 'bg-transparent border-transparent'
                }`}>
                  <span className="w-5 h-5 bg-[#0D2C44] text-white rounded-full flex items-center justify-center font-mono font-bold text-[10px] flex-shrink-0 mt-0.5">1</span>
                  <div>
                    <p className="font-bold text-[#0D2C44]">Nhập thông tin định danh</p>
                    <p className="text-gray-600 text-[11px]">Cung cấp email hoặc tên đăng nhập tài khoản.</p>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-2.5 border transition-colors ${
                  recoveryStep === 2 ? 'bg-white border-[#CF373D] shadow-xs' : 'bg-transparent border-transparent'
                }`}>
                  <span className="w-5 h-5 bg-[#CF373D] text-white rounded-full flex items-center justify-center font-mono font-bold text-[10px] flex-shrink-0 mt-0.5">2</span>
                  <div>
                    <p className="font-bold text-[#CF373D]">Nhận mã xác minh (OTP)</p>
                    <p className="text-gray-600 text-[11px]">Hệ thống gửi mã khẩn cấp 6 số đến hộp thư của bạn.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 border border-transparent">
                  <span className="w-5 h-5 bg-emerald-800 text-white rounded-full flex items-center justify-center font-mono font-bold text-[10px] flex-shrink-0 mt-0.5">3</span>
                  <div>
                    <p className="font-bold text-emerald-900">Thiết lập lại mật khẩu</p>
                    <p className="text-gray-600 text-[11px]">Cập nhật mật khẩu mới và đăng nhập lại.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D8D1C5] text-[11px] font-serif italic text-gray-600">
                <i className="fa-solid fa-headset mr-1 text-[#CF373D]"></i>
                Hỗ trợ khẩn cấp: <strong>1900 8899</strong> (Tổng đài kỹ thuật nội bộ Blend).
              </div>
            </div>

            {/* Right Column (7 Cols): The Form itself */}
            <div className="md:col-span-7 p-6 sm:p-10 bg-white flex flex-col justify-center">
              
              {/* STEP 1: Identification Input */}
              {recoveryStep === 1 && (
                <form onSubmit={handleForgotSubmit} className="space-y-4 font-body">
                  <div>
                    <span className="font-cinzel text-[10px] tracking-widest text-[#6E675F] uppercase font-bold block mb-1">
                      BƯỚC 1: TRA CỨU HỒ SƠ
                    </span>
                    <label className="block font-cinzel text-xs font-bold text-[#0D2C44] uppercase tracking-wider mb-1.5">
                      Email Hoặc Tên Đăng Nhập Đã Đăng Ký *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="VD: email@vidu.com hoặc tên username..."
                        value={forgotForm.identity}
                        onChange={(e) => setForgotForm({ ...forgotForm, identity: e.target.value })}
                        className="w-full bg-[#FCFAF6] border border-[#0D2C44] pl-10 pr-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                      />
                      <i className="fa-solid fa-envelope absolute left-3.5 top-3.5 text-[#0D2C44] text-xs"></i>
                    </div>
                  </div>

                  <p className="text-xs font-serif text-gray-500 italic">
                    * Hệ thống sẽ tự động đối soát cơ sở dữ liệu SQLite và gửi mã OTP 6 số để xác nhận chính chủ.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: '#0D2C44', color: '#ffffff' }}
                    className="press-btn w-full py-3 font-cinzel text-sm font-bold hover:bg-[#CF373D] transition-colors shadow-md flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <span><i className="fa-solid fa-spinner fa-spin mr-2"></i>ĐANG TRA CỨU...</span>
                    ) : (
                      <span><i className="fa-solid fa-paper-plane mr-2"></i>GỬI MÃ XÁC MINH OTP</span>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: OTP Verification Input */}
              {recoveryStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 font-body">
                  <div className="p-3.5 bg-blue-50 border border-blue-200 text-xs text-blue-900 font-serif">
                    <i className="fa-solid fa-circle-check text-blue-700 mr-1.5"></i>
                    Mã xác minh đã được phát lệnh gửi tới: <strong>{forgotForm.identity}</strong>. (Mã thử nghiệm nhanh: <strong>888888</strong>)
                  </div>

                  <div>
                    <span className="font-cinzel text-[10px] tracking-widest text-[#6E675F] uppercase font-bold block mb-1">
                      BƯỚC 2: NHẬP MÃ XÁC MINH
                    </span>
                    <label className="block font-cinzel text-xs font-bold text-[#0D2C44] uppercase tracking-wider mb-1.5">
                      Mã Xác Thực OTP (6 Số) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="888888"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full bg-[#FCFAF6] border border-[#0D2C44] px-4 py-2.5 font-mono text-2xl font-bold tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                  </div>

                  <button
                    type="submit"
                    style={{ backgroundColor: '#0D2C44', color: '#ffffff' }}
                    className="press-btn w-full py-3 font-cinzel text-sm font-bold hover:bg-[#CF373D] transition-colors shadow-md flex items-center justify-center gap-2 mt-4"
                  >
                    <i className="fa-solid fa-key mr-1"></i>
                    <span>XÁC THỰC &amp; ĐẶT LẠI MẬT KHẨU</span>
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      </main>

      {/* Footer Colophon */}
      <footer className="py-4 text-center text-xs font-serif text-gray-500 border-t border-[#D8D1C5] bg-[#FAF7F2] flex-shrink-0">
        <span>BLEND SECURITY PROTOCOL &bull; SAIGON ROASTERY PRESS &bull; 2026</span>
      </footer>

      {/* Interactive Modals */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      <MembershipPolicyModal
        isOpen={isMembershipPolicyModalOpen}
        onClose={() => setIsMembershipPolicyModalOpen(false)}
      />

    </div>
  );
};

export default AuthView;
