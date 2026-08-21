import React, { useState, useEffect } from 'react';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import DashboardView from './views/DashboardView';
import ProductsView from './views/ProductsView';
import OrdersView from './views/OrdersView';
import InventoryView from './views/InventoryView';
import CustomersView from './views/CustomersView';
import PromotionsView from './views/PromotionsView';
import StaffView from './views/StaffView';
import ReportsView from './views/ReportsView';
import ProfileView from './views/ProfileView';
import ReservationsView from './views/ReservationsView';
import SuppliersView from './views/SuppliersView';
import ArticlesView from './views/ArticlesView';
import CashierView from './views/CashierView';
import BaristaView from './views/BaristaView';
import FloorStaffView from './views/FloorStaffView';
import AuthView from './views/AuthView';
import LandingPageView from './views/LandingPageView';
import TermsView from './views/TermsView';
import MembershipPolicyView from './views/MembershipPolicyView';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { statsApi } from './services/api';
import { resolveCurrentRoute, pushRoute } from './utils/routes';
import { updateSEO } from './utils/seo';

export const getRoleDefaultTab = (role) => {
  if (!role) return 'dashboard';
  const r = role.toLowerCase();
  if (r.includes('quản lý') || r.includes('admin') || r.includes('chủ biên')) {
    return 'dashboard'; // Bảng điều khiển
  }
  if (r.includes('thu ngân') || r.includes('cashier')) {
    return 'cashier'; // Quầy thu ngân POS
  }
  if (r.includes('pha chế') || r.includes('barista')) {
    return 'barista'; // Trạm pha chế Barista KDS
  }
  if (r.includes('phục vụ') || r.includes('staff') || r.includes('waiter') || r.includes('server')) {
    return 'floor'; // Sơ đồ bàn & Phục vụ sảnh
  }
  if (r.includes('kho') || r.includes('thủ kho') || r.includes('inventory')) {
    return 'inventory'; // Kho nguyên liệu
  }
  return 'dashboard';
};

const MainLayout = ({ activeTab, setActiveTab, onNavigateLanding }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('blend_sidebar_collapsed') === 'true';
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  // Sync collapsed state to localStorage
  const toggleCollapse = (collapsed) => {
    setIsCollapsed(collapsed);
    localStorage.setItem('blend_sidebar_collapsed', String(collapsed));
  };

  const fetchGlobalAlertCounts = async () => {
    try {
      const res = await statsApi.getOverview();
      if (res.success && res.data?.alerts) {
        const orderAlerts = res.data.alerts.filter((a) => a.type === 'order').length;
        const invAlerts = res.data.alerts.filter((a) => a.type === 'inventory').length;
        setPendingOrdersCount(orderAlerts);
        setLowStockCount(invAlerts);
      }
    } catch {
      // Background count fetch fallback
    }
  };

  useEffect(() => {
    fetchGlobalAlertCounts();
    const interval = setInterval(fetchGlobalAlertCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'cashier':
        return <CashierView />;
      case 'barista':
        return <BaristaView />;
      case 'floor':
        return <FloorStaffView />;
      case 'products':
        return <ProductsView />;
      case 'orders':
        return <OrdersView />;
      case 'inventory':
        return <InventoryView />;
      case 'suppliers':
        return <SuppliersView />;
      case 'articles':
        return <ArticlesView />;
      case 'customers':
        return <CustomersView />;
      case 'reservations':
        return <ReservationsView />;
      case 'promotions':
        return <PromotionsView />;
      case 'staff':
        return <StaffView />;
      case 'reports':
        return <ReportsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F4EE] text-brand-dark font-body antialiased selection:bg-jasper selection:text-white">
      {/* Left Broadside Index Column */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={toggleCollapse} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onNavigateLanding={onNavigateLanding}
      />
      
      {/* Main Gazette Content Sheet with Smooth Width Transition */}
      <main className={`flex-1 transition-all duration-300 ease-in-out flex flex-col min-h-screen w-full min-w-0 overflow-x-hidden ml-0 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        <Header 
          pendingOrdersCount={pendingOrdersCount} 
          lowStockCount={lowStockCount} 
          isCollapsed={isCollapsed}
          setIsCollapsed={toggleCollapse}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          setActiveTab={setActiveTab}
        />

        <div className="p-3.5 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full flex-1 min-w-0">
          {renderContent()}
        </div>

        {/* Newspaper Colophon Footer */}
        <footer className="py-6 text-center text-xs font-serif text-gray-500 border-t-2 border-cerulean bg-[#FAF7F2]">
          <div className="flex items-center justify-center gap-3 text-[11px] font-cinzel tracking-widest text-cerulean mb-1 font-bold">
            <span>BLEND COFFEE &amp; TEA CHRONICLE</span>
            <span className="text-jasper">&bull;</span>
            <span>SAIGON ROASTERY PRESS</span>
            <span className="text-jasper">&bull;</span>
            <span>EDITION 2026</span>
          </div>
          <p className="italic text-[11px] text-gray-500 px-4">
            Hệ thống quản trị phong cách Báo chí Cổ điển &bull; Sắc màu chủ đạo: Xanh Cerulean (#124874) &amp; Đỏ Jasper (#CF373D).
          </p>
        </footer>
      </main>
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated, user } = useAuth();

  // Parse initial route from friendly URL
  const initialRoute = resolveCurrentRoute();
  const [currentView, setCurrentView] = useState(initialRoute.view || 'landing');
  const [activeTab, setActiveTab] = useState(initialRoute.tab || 'home');

  // Sync SEO & URL when view or tab changes
  useEffect(() => {
    pushRoute(currentView, activeTab);
    updateSEO(activeTab);
  }, [currentView, activeTab]);

  // Handle Browser Back / Forward Button Navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const resolved = resolveCurrentRoute();
      setCurrentView(resolved.view);
      setActiveTab(resolved.tab);
      updateSEO(resolved.seoKey || resolved.tab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigateLanding = (tab = 'home') => {
    setCurrentView('landing');
    setActiveTab(tab);
  };

  const handleOpenAuth = (authMode = 'login') => {
    setCurrentView('auth');
    setActiveTab(authMode);
  };

  const handleEnterApp = (role) => {
    if (!isAuthenticated) {
      setCurrentView('auth');
      setActiveTab('login');
      return;
    }
    const targetRole = role || user?.role;
    const targetTab = getRoleDefaultTab(targetRole);
    setCurrentView('app');
    setActiveTab(targetTab);
  };

  const handleAppTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  const handleNavigateTerms = () => {
    setCurrentView('terms');
    setActiveTab('terms');
  };

  const handleNavigatePolicy = () => {
    setCurrentView('policy');
    setActiveTab('policy');
  };

  // 1. Dedicated Terms of Service Page View
  if (currentView === 'terms') {
    return (
      <TermsView 
        onNavigateBack={() => handleOpenAuth('register')}
        onNavigateLanding={() => handleNavigateLanding('home')}
        onNavigateRegister={() => handleOpenAuth('register')}
      />
    );
  }

  // 2. Dedicated Membership Policy Page View
  if (currentView === 'policy') {
    return (
      <MembershipPolicyView 
        onNavigateBack={() => handleOpenAuth('register')}
        onNavigateLanding={() => handleNavigateLanding('home')}
        onNavigateRegister={() => handleOpenAuth('register')}
      />
    );
  }

  // 3. Landing Page View
  if (currentView === 'landing') {
    return (
      <LandingPageView 
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab)}
        onEnterApp={handleEnterApp} 
        onOpenAuth={() => handleOpenAuth('login')}
        onNavigateTerms={handleNavigateTerms}
        onNavigatePolicy={handleNavigatePolicy}
      />
    );
  }

  // 4. Auth Page View (Unauthenticated or Explicit Login View)
  if (currentView === 'auth' || !isAuthenticated) {
    return (
      <AuthView 
        initialMode={activeTab === 'register' ? 'register' : activeTab === 'forgot' ? 'forgot' : 'login'}
        onNavigateLanding={() => handleNavigateLanding('home')} 
        onNavigateTerms={handleNavigateTerms}
        onNavigatePolicy={handleNavigatePolicy}
        onLoginSuccess={(loggedUser) => {
          const r = (loggedUser?.role || '').toLowerCase();
          if (r.includes('customer') || r.includes('khách') || r.includes('thành viên')) {
            setCurrentView('landing');
            setActiveTab('home');
          } else {
            const roleTab = getRoleDefaultTab(loggedUser?.role);
            setCurrentView('app');
            setActiveTab(roleTab);
          }
        }}
      />
    );
  }

  // 5. Authenticated App Layout
  return (
    <MainLayout 
      activeTab={activeTab}
      setActiveTab={handleAppTabChange}
      onNavigateLanding={() => handleNavigateLanding('home')} 
    />
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
