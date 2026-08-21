/**
 * Friendly URL Routing Engine & History Manager
 */

export const ROUTE_MAP = {
  // Landing Page Routes
  '/': { view: 'landing', tab: 'home', seoKey: 'home' },
  '/trang-chu': { view: 'landing', tab: 'home', seoKey: 'home' },
  '/cau-chuyen': { view: 'landing', tab: 'story', seoKey: 'story' },
  '/thuc-don': { view: 'landing', tab: 'menu', seoKey: 'menu' },
  '/nghe-thuat-rang': { view: 'landing', tab: 'roastery', seoKey: 'roastery' },
  '/dat-cho': { view: 'landing', tab: 'booking', seoKey: 'booking' },
  '/bao-gioi': { view: 'landing', tab: 'press', seoKey: 'press' },
  '/hoi-vien': { view: 'landing', tab: 'member', seoKey: 'auth' },
  '/trang-ca-nhan': { view: 'landing', tab: 'member', seoKey: 'auth' },

  // Auth Routes
  '/dang-nhap': { view: 'auth', tab: 'login', seoKey: 'auth' },
  '/dang-ky': { view: 'auth', tab: 'register', seoKey: 'auth' },
  '/quen-mat-khau': { view: 'auth', tab: 'forgot', seoKey: 'auth' },

  // Dedicated Full Pages for Terms & Membership Policy
  '/dieu-khoan-dich-vu': { view: 'terms', tab: 'terms', seoKey: 'home' },
  '/terms': { view: 'terms', tab: 'terms', seoKey: 'home' },
  '/chinh-sach-hoi-vien': { view: 'policy', tab: 'policy', seoKey: 'home' },
  '/membership-policy': { view: 'policy', tab: 'policy', seoKey: 'home' },

  // Admin System Routes
  '/quan-tri': { view: 'app', tab: 'dashboard', seoKey: 'dashboard' },
  '/quan-tri/tong-quan': { view: 'app', tab: 'dashboard', seoKey: 'dashboard' },
  '/quan-tri/thuc-don': { view: 'app', tab: 'products', seoKey: 'products' },
  '/quan-tri/don-hang': { view: 'app', tab: 'orders', seoKey: 'orders' },
  '/quan-tri/kho-nguyen-lieu': { view: 'app', tab: 'inventory', seoKey: 'inventory' },
  '/quan-tri/nha-cung-cap': { view: 'app', tab: 'suppliers', seoKey: 'inventory' },
  '/quan-tri/truyen-thong': { view: 'app', tab: 'articles', seoKey: 'dashboard' },
  '/quan-tri/khach-hang': { view: 'app', tab: 'customers', seoKey: 'dashboard' },
  '/quan-tri/dat-cho': { view: 'app', tab: 'reservations', seoKey: 'reservations' },
  '/quan-tri/khuyen-mai': { view: 'app', tab: 'promotions', seoKey: 'dashboard' },
  '/quan-tri/nhan-su': { view: 'app', tab: 'staff', seoKey: 'dashboard' },
  '/quan-tri/bao-cao': { view: 'app', tab: 'reports', seoKey: 'dashboard' },
  '/quan-tri/ho-so': { view: 'app', tab: 'profile', seoKey: 'dashboard' },
};

/**
 * Resolves current pathname into a structured view object
 */
export const resolveCurrentRoute = () => {
  let path = window.location.pathname.toLowerCase();
  // Strip trailing slash if not root
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  return ROUTE_MAP[path] || ROUTE_MAP['/'];
};

/**
 * Builds a friendly URL from view and tab
 */
export const getPathForRoute = (view, tab) => {
  if (view === 'landing') {
    if (tab === 'home' || !tab) return '/';
    if (tab === 'story') return '/cau-chuyen';
    if (tab === 'menu') return '/thuc-don';
    if (tab === 'roastery') return '/nghe-thuat-rang';
    if (tab === 'booking') return '/dat-cho';
    if (tab === 'press') return '/bao-gioi';
    if (tab === 'member') return '/hoi-vien';
    return `/${tab}`;
  }

  if (view === 'terms') {
    return '/dieu-khoan-dich-vu';
  }

  if (view === 'policy') {
    return '/chinh-sach-hoi-vien';
  }

  if (view === 'auth') {
    if (tab === 'register') return '/dang-ky';
    if (tab === 'forgot') return '/quen-mat-khau';
    return '/dang-nhap';
  }

  if (view === 'app') {
    if (tab === 'dashboard' || !tab) return '/quan-tri';
    if (tab === 'products') return '/quan-tri/thuc-don';
    if (tab === 'orders') return '/quan-tri/don-hang';
    if (tab === 'inventory') return '/quan-tri/kho-nguyen-lieu';
    if (tab === 'suppliers') return '/quan-tri/nha-cung-cap';
    if (tab === 'articles') return '/quan-tri/truyen-thong';
    if (tab === 'customers') return '/quan-tri/khach-hang';
    if (tab === 'reservations') return '/quan-tri/dat-cho';
    if (tab === 'promotions') return '/quan-tri/khuyen-mai';
    if (tab === 'staff') return '/quan-tri/nhan-su';
    if (tab === 'reports') return '/quan-tri/bao-cao';
    if (tab === 'profile') return '/quan-tri/ho-so';
    return `/quan-tri/${tab}`;
  }

  return '/';
};

/**
 * Navigates to a friendly URL and pushes state to browser history
 */
export const pushRoute = (view, tab) => {
  const newPath = getPathForRoute(view, tab);
  if (window.location.pathname !== newPath) {
    window.history.pushState({ view, tab }, '', newPath);
  }
};
