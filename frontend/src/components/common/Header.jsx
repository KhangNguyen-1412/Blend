import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { fetchLiveWeather } from '../../services/weatherService';

export const Header = ({ 
  pendingOrdersCount = 0, 
  lowStockCount = 0, 
  isCollapsed, 
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  setActiveTab
}) => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [weather, setWeather] = useState({
    temp: '26°C',
    statusText: 'TRỜI MÁT',
    fullTextAdmin: '26°C TRỜI MÁT SÀI GÒN',
    icon: 'fa-cloud-sun'
  });

  useEffect(() => {
    fetchLiveWeather().then(w => {
      if (w) setWeather(w);
    });
    const interval = setInterval(() => {
      fetchLiveWeather().then(w => {
        if (w) setWeather(w);
      });
    }, 15 * 60 * 1000); // 15 mins refresh
    return () => clearInterval(interval);
  }, []);

  const isWarehouseStaff = user?.role && user.role.toLowerCase().includes('kho');
  const isCashierBarista = user?.role && (
    user.role.toLowerCase().includes('thu ngân') ||
    user.role.toLowerCase().includes('pha chế') ||
    user.role.toLowerCase().includes('phục vụ') ||
    user.role.toLowerCase().includes('barista') ||
    user.role.toLowerCase().includes('cashier')
  );

  const currentDate = new Date().toLocaleDateString('vi-VN', {
    weekday: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });

  const handleLogout = () => {
    if (window.confirm('Xác nhận kết thúc ca trực và đăng xuất khỏi hệ thống?')) {
      logout();
      addToast('Đã kết thúc ca trực và đăng xuất an toàn!', 'info');
    }
  };

  return (
    <header className="bg-[#FCFAF6] border-b-2 border-[#124874] sticky top-0 z-20 shadow-sm font-body">
      {/* Topmost Micro Header Strip in Rich Cerulean Blue */}
      <div 
        style={{ backgroundColor: '#124874', color: '#ffffff' }}
        className="text-[10px] sm:text-[11px] font-cinzel tracking-widest px-3 sm:px-6 py-1.5 flex justify-between items-center border-b border-[#0D3656] overflow-x-auto whitespace-nowrap scrollbar-none"
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="font-bold text-white">VOL. IV • NO. 88</span>
          <span style={{ color: '#CF373D' }} className="font-mono font-bold">•</span>
          <span className="text-white hidden sm:inline">SAIGON • VIỆT NAM</span>
          {user && (
            <>
              <span className="text-[#CF373D] font-bold hidden md:inline">•</span>
              <span className="text-white font-mono text-[10px] hidden md:inline">
                {isWarehouseStaff
                  ? `TRẠM KHO: ${user.name.toUpperCase()} (THỦ KHO)`
                  : isCashierBarista
                  ? `CA TRỰC POS: ${user.name.toUpperCase()} (${user.role.toUpperCase()})`
                  : `BÀN QUẢN TRỊ: ${user.name.toUpperCase()} (${user.role.toUpperCase()})`}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 text-white font-mono text-[9px] sm:text-[10px] flex-shrink-0">
          <span title={`Độ ẩm: ${weather.humidity || '80%'} • Cảm giác như: ${weather.feelsLike || weather.temp}`}>
            <i className={`fa-solid ${weather.icon || 'fa-temperature-three-quarters'} mr-1 text-[#CF373D]`}></i> {weather.fullTextAdmin}
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">GIÁ CÀ PHÊ: 112.000đ/KG</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-white font-bold"><i className="fa-solid fa-circle text-[6px] mr-1 text-[#CF373D]"></i>TRỰC TUYẾN</span>
        </div>
      </div>

      {/* Main Masthead Banner Bar */}
      <div className="px-3 sm:px-6 py-2.5 sm:py-3 flex flex-wrap justify-between items-center gap-3 bg-[#FAF7F2]">
        
        {/* Left Side: Sidebar Toggles & Date / Station Info */}
        <div className="flex items-center gap-2.5 sm:gap-4 flex-1 min-w-0">
          
          {/* Mobile Sidebar Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileOpen && setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden press-btn px-2.5 py-1.5 bg-white text-[#124874] border border-[#124874] hover:bg-[#124874] hover:text-white transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
            title="Mở thanh điều hướng (Menu)"
          >
            <i className="fa-solid fa-bars text-sm"></i>
          </button>

          {/* Desktop Collapse / Expand Toggle Button */}
          {setIsCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex press-btn px-2.5 py-1.5 bg-white text-[#124874] border border-[#124874]/40 hover:bg-[#124874] hover:text-white transition-colors items-center justify-center cursor-pointer"
              title={isCollapsed ? "Mở rộng thanh điều hướng" : "Thu nhỏ thanh điều hướng"}
            >
              <i className={`fa-solid ${isCollapsed ? 'fa-bars' : 'fa-bars-staggered'} text-sm`}></i>
            </button>
          )}

          {/* Today Date Badge */}
          <div className="border-r border-[#D8D1C5] pr-3 sm:pr-4 flex-shrink-0">
            <span className="font-mono text-[9px] sm:text-xs uppercase tracking-widest text-[#6E675F] block font-semibold">HÔM NAY</span>
            <span className="font-serif text-xs sm:text-sm font-bold text-[#124874] capitalize">
              <i className="fa-regular fa-calendar-check mr-1 text-[#CF373D]"></i>
              {currentDate}
            </span>
          </div>

          {/* Role Status Caption */}
          <div className="hidden xl:flex items-center gap-2 bg-white px-3 py-1 border border-[#124874] text-xs truncate">
            <span className="px-1.5 py-0.5 bg-[#124874] text-white font-cinzel text-[9px] font-bold flex-shrink-0">
              {isWarehouseStaff ? 'SỔ KHO' : isCashierBarista ? 'POS QUẦY' : 'QUẢN TRỊ'}
            </span>
            <span className="font-body text-gray-800 italic truncate max-w-xs text-xs">
              {isWarehouseStaff
                ? 'Trạm điều phối vật tư • Kiểm kê dự trữ hạt mộc Cầu Đất & lá trà.'
                : isCashierBarista
                ? 'Tiếp nhận order gọi món thời gian thực • Đồng bộ công thức quầy bar.'
                : 'Bản tin quản trị tòa soạn • Doanh số & vận hành toàn hệ thống.'}
            </span>
          </div>
        </div>

        {/* Right Side Action Badges (Alerts & Sign Out) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Inventory alert stamp (Click to open Inventory) */}
          <div 
            onClick={() => setActiveTab && setActiveTab('inventory')}
            role="button"
            tabIndex={0}
            className={`cursor-pointer transition-transform hover:scale-105 active:scale-95 select-none ink-stamp text-[9px] sm:text-[10px] font-bold ${
              lowStockCount > 0 
                ? 'stamp-jasper -rotate-2 animate-pulse' 
                : 'stamp-cerulean -rotate-1'
            }`}
            title="Nhấp để mở Quản Lý Kho Nguyên Liệu (The Pantry & Stock)"
          >
            <i className="fa-solid fa-boxes-stacked mr-1"></i>
            <span className="hidden sm:inline">KHO: </span>
            <span>{lowStockCount > 0 ? `${lowStockCount} CẢNH BÁO` : 'AN TOÀN'}</span>
          </div>

          {/* Pending orders alert stamp (Click to open Orders) */}
          {!isWarehouseStaff && (
            <div 
              onClick={() => setActiveTab && setActiveTab('orders')}
              role="button"
              tabIndex={0}
              className={`cursor-pointer transition-transform hover:scale-105 active:scale-95 select-none ink-stamp stamp-jasper text-[9px] sm:text-[10px] font-bold rotate-2 ${
                pendingOrdersCount > 0 ? 'animate-pulse' : ''
              }`}
              title="Nhấp để mở Quản Lý Đơn Hàng (Dispatches & Orders)"
            >
              <i className="fa-solid fa-bell mr-1"></i>
              <span className="hidden sm:inline">ĐƠN: </span>
              <span>{pendingOrdersCount > 0 ? `${pendingOrdersCount} CHỜ` : 'ĐÃ XỬ LÝ'}</span>
            </div>
          )}

          {/* Sign out letterpress button */}
          <button 
            type="button"
            onClick={handleLogout}
            className="press-btn px-2.5 sm:px-3 py-1 bg-white text-[#124874] border border-[#124874] font-cinzel text-xs font-bold hover:bg-[#CF373D] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            title="Đăng xuất & kết thúc ca trực"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span className="hidden xs:inline">THOÁT</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
