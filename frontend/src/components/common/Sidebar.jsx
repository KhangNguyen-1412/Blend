import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed, 
  isMobileOpen,
  setIsMobileOpen,
  onNavigateLanding 
}) => {
  const { user } = useAuth();

  const isWarehouseStaff = user?.role && user.role.toLowerCase().includes('kho');
  const isCashierBarista = user?.role && (
    user.role.toLowerCase().includes('thu ngân') ||
    user.role.toLowerCase().includes('pha chế') ||
    user.role.toLowerCase().includes('phục vụ') ||
    user.role.toLowerCase().includes('barista') ||
    user.role.toLowerCase().includes('cashier') ||
    user.role.toLowerCase().includes('staff') ||
    user.role.toLowerCase().includes('waiter') ||
    user.role.toLowerCase().includes('server')
  );

  let menu = [];
  let stationTitle = 'MỤC LỤC • INDEX';
  let stationSubtitle = 'The Coffee & Tea Gazette • Saigon';

  if (isWarehouseStaff) {
    stationTitle = 'SỔ KHO • PANTRY HUB';
    stationSubtitle = 'Trạm Điều Phối Kho Vật Tư • Saigon';
    menu = [
      { id: 'inventory', roman: 'I', name: 'Kho Nguyên Liệu', en: 'The Pantry & Stock', icon: 'fa-boxes-stacked' },
      { id: 'suppliers', roman: 'II', name: 'Nhà Cung Cấp', en: 'Vendors & Supply', icon: 'fa-truck-field' },
      { id: 'reports', roman: 'III', name: 'Báo Cáo Sổ Kho', en: 'Warehouse Audit Ledger', icon: 'fa-book-bookmark' },
      { id: 'products', roman: 'IV', name: 'Thực Phổ Tra Cứu', en: 'Gastronomy Reference', icon: 'fa-mug-saucer' },
    ];
  } else if (isCashierBarista) {
    stationTitle = 'CA TRỰC • SẢNH & QUẦY BAR';
    stationSubtitle = 'Ca Trực Phục Vụ, Pha Chế & Bán Hàng • Saigon';
    menu = [
      { id: 'floor', roman: 'I', name: 'Sơ Đồ Bàn & Phục Vụ', en: 'Floor & Table Dispatch', icon: 'fa-bell-concierge' },
      { id: 'cashier', roman: 'II', name: 'Quầy Thu Ngân (POS)', en: 'Cashier & POS Desk', icon: 'fa-cash-register' },
      { id: 'barista', roman: 'III', name: 'Trạm Pha Chế (KDS)', en: 'Barista Dispatch Desk', icon: 'fa-mug-hot' },
      { id: 'orders', roman: 'IV', name: 'Quản Lý Đơn Hàng', en: 'Dispatches & Orders', icon: 'fa-scroll' },
      { id: 'products', roman: 'V', name: 'Thực Đơn Menu', en: 'Gastronomy & Goods', icon: 'fa-mug-saucer' },
      { id: 'reservations', roman: 'VI', name: 'Sổ Đặt Chỗ', en: 'Table Reservations', icon: 'fa-calendar-check' },
    ];
  } else {
    // Admin / Manager / Full Access
    stationTitle = 'MỤC LỤC • INDEX';
    stationSubtitle = 'The Coffee & Tea Gazette • Saigon';
    menu = [
      { id: 'dashboard', roman: 'I', name: 'Bảng Điều Khiển', en: 'Front Page Overview', icon: 'fa-feather' },
      { id: 'floor', roman: 'II', name: 'Sơ Đồ Bàn & Phục Vụ', en: 'Floor & Table Dispatch', icon: 'fa-bell-concierge' },
      { id: 'cashier', roman: 'III', name: 'Quầy Thu Ngân (POS)', en: 'Cashier & POS Desk', icon: 'fa-cash-register' },
      { id: 'barista', roman: 'IV', name: 'Trạm Pha Chế (KDS)', en: 'Barista Dispatch Desk', icon: 'fa-mug-hot' },
      { id: 'products', roman: 'V', name: 'Thực Đơn Menu', en: 'Gastronomy & Goods', icon: 'fa-mug-saucer' },
      { id: 'orders', roman: 'VI', name: 'Quản Lý Đơn Hàng', en: 'Dispatches & Orders', icon: 'fa-scroll' },
      { id: 'inventory', roman: 'VII', name: 'Kho Nguyên Liệu', en: 'The Pantry & Stock', icon: 'fa-boxes-stacked' },
      { id: 'suppliers', roman: 'VIII', name: 'Nhà Cung Cấp', en: 'Farms & Suppliers', icon: 'fa-truck-field' },
      { id: 'articles', roman: 'IX', name: 'Truyền Thông & Báo Chí', en: 'Media & Press Desk', icon: 'fa-newspaper' },
      { id: 'customers', roman: 'X', name: 'Khách Hàng', en: 'Society & Patrons', icon: 'fa-address-book' },
      { id: 'reservations', roman: 'XI', name: 'Sổ Đặt Chỗ', en: 'Table Reservations', icon: 'fa-calendar-check' },
      { id: 'promotions', roman: 'XII', name: 'Mã Khuyến Mãi', en: 'Vouchers & Deals', icon: 'fa-stamp' },
      { id: 'staff', roman: 'XIII', name: 'Nhân Sự & Quyền', en: 'Guild & Personnel', icon: 'fa-users-gear' },
      { id: 'reports', roman: 'XIV', name: 'Báo Cáo & Sổ Sách', en: 'The Roastery Ledger', icon: 'fa-book-bookmark' },
    ];
  }

  const isProfileActive = activeTab === 'profile';
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'B';
  const displayName = user?.name || (isWarehouseStaff ? 'ĐẶNG GIA BẢO' : 'CHỦ BIÊN • ADMIN');
  const displayRole = user?.role 
    ? isWarehouseStaff 
      ? 'THỦ KHO & ĐIỀU PHỐI VẬT TƯ' 
      : `QUẢN TRỊ (${user.role.toUpperCase()})` 
    : 'QUẢN TRỊ TRƯỞNG CA';

  const handleItemClick = (id) => {
    setActiveTab(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Dark Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Aside */}
      <aside 
        className={`${
          isCollapsed ? 'w-20' : 'w-72'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } bg-[#FAF7F2] text-brand-dark flex flex-col h-screen fixed left-0 top-0 border-r-2 border-[#124874] z-50 lg:z-30 font-body shadow-2xl lg:shadow-lg transition-all duration-300 ease-in-out`}
      >

        {/* Newspaper Brand Masthead */}
        <div className="relative border-b-2 border-[#124874] bg-[#FCFAF6] transition-all duration-300">
          
          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className="lg:hidden absolute right-2.5 top-2.5 w-7 h-7 bg-white border border-[#124874] text-[#124874] hover:bg-[#CF373D] hover:text-white flex items-center justify-center font-bold text-xs transition-colors cursor-pointer z-10"
            title="Đóng thanh điều hướng"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div 
            onClick={() => {
              if (onNavigateLanding) onNavigateLanding();
              else if (setActiveTab) setActiveTab('landing');
              if (setIsMobileOpen) setIsMobileOpen(false);
            }}
            title="Mở Trang Chủ Giới Thiệu (Landing Page) • Nhấp để xem"
            role="button"
            tabIndex={0}
            className={`text-center cursor-pointer hover:bg-[#FAF7F2] group transition-colors ${
              isCollapsed ? 'p-3 flex flex-col items-center justify-center' : 'p-5 sm:p-6'
            }`}
          >
            {isCollapsed ? (
              /* Collapsed Clean Logo Icon */
              <div className="py-1 flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
                <img 
                  src="/logo.png" 
                  alt="Blend System Logo" 
                  className="w-10 h-10 object-contain drop-shadow-sm" 
                />
                <span className="font-cinzel text-[7px] font-bold text-[#124874] mt-1 tracking-widest uppercase">
                  BLEND
                </span>
              </div>
            ) : (
              /* Expanded Full Masthead with Logo */
              <div className="group-hover:scale-102 transition-transform flex flex-col items-center">
                <div className="text-[10px] font-cinzel uppercase tracking-[0.25em] text-[#6E675F] mb-2 font-bold text-center">
                  {isWarehouseStaff ? '— WAREHOUSE DISPATCH —' : '— SPECIAL ROASTERY EDITION —'}
                </div>
                
                <div className="flex items-center justify-center gap-2.5 mb-1">
                  <img 
                    src="/logo.png" 
                    alt="Blend System Logo" 
                    className="w-10 h-10 object-contain drop-shadow-sm" 
                  />
                  <h1 className="font-display text-3xl font-black tracking-tighter text-[#124874] leading-none">
                    Blend<span className="text-[#CF373D] font-mono">.</span>
                  </h1>
                </div>
                
                <div className="w-full flex items-center justify-center my-1.5 text-[#CF373D] text-xs">
                  <span className="h-[1px] bg-[#124874] flex-1"></span>
                  <span className="px-2 font-cinzel text-[9px] tracking-widest text-[#6E675F] font-bold">EST. 2024</span>
                  <span className="h-[1px] bg-[#124874] flex-1"></span>
                </div>
                
                <p className="font-serif italic text-xs text-gray-600 text-center">
                  {stationSubtitle}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Index Navigation Banner in Cerulean Blue */}
        <div 
          style={{ backgroundColor: '#124874', color: '#ffffff' }}
          className={`py-2 text-[11px] font-cinzel tracking-widest uppercase flex ${
            isCollapsed ? 'justify-center px-1' : 'justify-between px-4'
          } items-center border-b border-[#0D3656] font-bold`}
        >
          {!isCollapsed && <span className="text-white font-bold tracking-wider">{stationTitle}</span>}
          <span 
            style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
            className="font-mono text-[9px] px-1.5 py-0.5 rounded-xs font-bold shadow-xs"
          >
            VOL. IV
          </span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {menu.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => handleItemClick(item.id)}
                  style={isActive ? { backgroundColor: '#124874', color: '#ffffff', borderColor: '#0D3656' } : {}}
                  className={`w-full transition-all flex items-center border ${
                    isCollapsed ? 'justify-center p-3' : 'justify-between px-3 py-2'
                  } text-left font-body relative cursor-pointer ${
                    isActive
                      ? 'shadow-xs font-bold'
                      : 'bg-transparent text-[#161413] border-transparent hover:bg-[#FAF7F2] hover:border-[#124874]'
                  }`}
                >
                  {/* Left Active Oxford Red Indicator Strip */}
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#CF373D]"></span>
                  )}

                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-5 text-center flex-shrink-0 flex items-center justify-center">
                      <i 
                        style={isActive ? { color: '#ffffff' } : { color: '#124874' }}
                        className={`fa-solid ${item.icon} text-sm transition-transform group-hover:scale-110`}
                      ></i>
                    </div>
                    {!isCollapsed && (
                      <div className="overflow-hidden">
                        <span className="block truncate font-serif text-sm font-semibold tracking-normal">
                          {item.name}
                        </span>
                        <span 
                          style={isActive ? { color: '#d0e1f0' } : { color: '#6E675F' }}
                          className="block truncate text-[10px] font-cinzel uppercase tracking-wider"
                        >
                          {item.en}
                        </span>
                      </div>
                    )}
                  </div>

                  {!isCollapsed && (
                    <span 
                      style={isActive ? { color: '#C59B27' } : { color: '#6E675F' }}
                      className="font-cinzel text-xs font-bold pl-2 flex-shrink-0"
                    >
                      {item.roman}
                    </span>
                  )}
                </button>

                {/* Floating Tooltip in Collapsed Mode (Desktop Only) */}
                {isCollapsed && (
                  <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#124874] text-white border border-[#0D3656] shadow-xl text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 rounded-xs">
                    <p className="font-serif font-bold text-white text-xs">{item.name}</p>
                    <p className="font-cinzel text-[9px] text-[#C59B27] uppercase">{item.en}</p>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar User Profile Footer Strip */}
        <div className="p-3 border-t-2 border-[#124874] bg-[#FAF7F2] relative">
          <div className="relative group">
            <button
              onClick={() => handleItemClick('profile')}
              style={isProfileActive ? { backgroundColor: '#124874', color: '#ffffff', borderColor: '#0D3656' } : {}}
              className={`w-full flex items-center justify-between border ${
                isCollapsed ? 'p-2 justify-center' : 'p-2.5'
              } transition-all rounded-xs text-left cursor-pointer ${
                isProfileActive 
                  ? 'shadow-sm' 
                  : 'border-[#D8D1C5] bg-white hover:border-[#124874] hover:bg-[#FAF7F2]'
              }`}
              title={isCollapsed ? `${displayName} - ${displayRole}` : 'Xem trang cá nhân & thiết lập tài khoản'}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div 
                  style={{ backgroundColor: '#CF373D', borderColor: '#124874', color: '#ffffff' }}
                  className={`${
                    isCollapsed ? 'w-8 h-8 text-base' : 'w-9 h-9 text-lg'
                  } border-2 flex items-center justify-center font-display font-bold shadow-sm flex-shrink-0`}
                >
                  {initial}
                </div>

                {!isCollapsed && (
                  <div className="overflow-hidden font-body">
                    <p 
                      style={isProfileActive ? { color: '#ffffff' } : { color: '#124874' }}
                      className="font-bold text-xs truncate font-serif"
                    >
                      {displayName}
                    </p>
                    <p 
                      style={isProfileActive ? { color: '#d0e1f0' } : { color: '#6E675F' }}
                      className="text-[10px] font-mono truncate uppercase font-semibold"
                    >
                      {displayRole}
                    </p>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <i 
                  style={isProfileActive ? { color: '#C59B27' } : { color: '#124874' }}
                  className={`fa-solid ${isProfileActive ? 'fa-id-badge text-sm' : 'fa-gear text-xs text-gray-400 hover:text-[#124874]'}`}
                ></i>
              )}
            </button>

            {/* Floating Tooltip for User Profile in Collapsed Mode */}
            {isCollapsed && (
              <div className="hidden lg:block absolute left-full bottom-2 ml-3 px-3 py-1.5 bg-[#124874] text-white border border-[#0D3656] shadow-xl text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 rounded-xs">
                <p className="font-serif font-bold text-white text-xs">{displayName}</p>
                <p className="font-mono text-[9px] text-[#C59B27] uppercase">{displayRole}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
