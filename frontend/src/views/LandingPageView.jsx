import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { reservationsApi, productsApi, articlesApi } from '../services/api';
import { firestoreReservations, firestoreGuestbook } from '../services/firestoreService';
import ProductDetailModal from '../components/landing/ProductDetailModal';
import ArticleDetailModal from '../components/landing/ArticleDetailModal';
import TermsModal from '../components/common/TermsModal';
import MembershipPolicyModal from '../components/common/MembershipPolicyModal';
import MemberProfileView from './MemberProfileView';
import { fetchLiveWeather } from '../services/weatherService';

export const LandingPageView = ({ 
  activeTab: controlledTab, 
  setActiveTab: setControlledTab, 
  onEnterApp, 
  onOpenAuth,
  onNavigateTerms,
  onNavigatePolicy
}) => {
  const { user, isAuthenticated, logout } = useAuth();

  // Active Landing Tab: 'home' | 'story' | 'menu' | 'roastery' | 'booking' | 'press'
  const [internalTab, setInternalTab] = useState('home');
  const activeTab = controlledTab || internalTab;
  const setActiveTab = setControlledTab || setInternalTab;
  const [activeMenuCategory, setActiveMenuCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [articlesList, setArticlesList] = useState([]);
  const [emailSub, setEmailSub] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [weather, setWeather] = useState({
    temp: '26°C',
    statusText: 'TRỜI MÁT',
    fullTextLanding: '26°C TRỜI MÁT SÀI GÒN',
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
    }, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    articlesApi.getAll({ status: 'Đã xuất bản' })
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setArticlesList(res.data);
        }
      })
      .catch(() => {});
  }, []);
  
  // Story Interactive State
  const [selectedEra, setSelectedEra] = useState('2024');
  const [selectedTerroir, setSelectedTerroir] = useState('caudat');
  const [isPlayingAmbience, setIsPlayingAmbience] = useState(false);
  const [guestbookForm, setGuestbookForm] = useState({ name: '', memory: '' });

  const [tableBooking, setTableBooking] = useState({
    name: '',
    phone: '',
    email: '',
    guests: '2',
    date: '2026-08-21',
    time: '18:30',
    area: 'Khu vực đọc báo in cổ điển',
    note: ''
  });
  const { addToast } = useToast();

  const NAV_ITEMS = [
    { id: 'story', label: 'CÂU CHUYỆN' },
    { id: 'menu', label: 'THỰC ĐƠN' },
    { id: 'roastery', label: 'NGHỆ THUẬT RANG' },
    { id: 'booking', label: 'ĐẶT CHỖ' },
    { id: 'press', label: 'BÁO GIỚI' },
  ];

  // Timeline Eras Data
  const ERAS_DATA = {
    '2024': {
      title: 'Mẻ Rang Mộc Đầu Tiên & Tiếng Máy Báo Cũ',
      subtitle: 'Khởi sinh từ căn nhà cổ tại Đồng Khởi, Sài Gòn',
      tag: 'ORIGIN & HERITAGE',
      stamp: 'EST. MARCH 2024',
      content: 'Trong một buổi sớm mù sương tháng 3/2024, mẻ cà phê Robusta rang mộc đầu tiên của Blend chính thức ra lò bên chiếc máy đánh chữ cổ Remington. Chúng tôi quyết định mang văn hóa đọc báo in cùng tách cà phê muối đậm đà trở lại nhịp sống người Sài Gòn.',
      metricLabel: 'Mẻ Rang Thử Nghiệm',
      metricVal: '120 Mẻ Mộc',
      flavor: 'Vị đậm sôcôla đen & muối hồng',
      quote: '"Một góc phố nhỏ, một tờ báo mới in, và một tách cà phê thơm nồng đánh thức mọi giác quan."'
    },
    '2025': {
      title: 'Hành Trình Lên Đỉnh Cầu Đất 1.600m & Bảo Lộc',
      subtitle: 'Gắn kết bền vững cùng nông hộ cao nguyên',
      tag: 'ETHICAL SOURCING',
      stamp: 'FARM TO CUP 2025',
      content: 'Đội ngũ Blend trực tiếp lặn lội lên những sườn đồi dốc đứng tại Cầu Đất và Bảo Lộc để ký hợp đồng thương mại công bằng với các hộ nông dân trồng Arabica và Oolong hữu cơ. Toàn bộ quả cà phê được cam kết hái chín 100% bằng tay.',
      metricLabel: 'Diện Tích Nông Hộ Hợp Tác',
      metricVal: '15 Hécta Hữu Cơ',
      flavor: 'Axit citric hoa cỏ & hậu vị mật ong rừng',
      quote: '"Chất lượng của tách cà phê bắt đầu từ sự tôn trọng đối với mồ hôi của người nông dân trên đất bazan."'
    },
    '2026': {
      title: 'Kỷ Nguyên Giao Thoa Di Sản & Công Nghệ Vận Hành',
      subtitle: 'Số hóa quản trị F&B chuẩn xác thời gian thực',
      tag: 'DIGITAL INNOVATION',
      stamp: 'EDITION 2026',
      content: 'Blend nâng cấp toàn diện hệ thống chiết xuất Synesso đa nồi hơi và ứng dụng bảng điều phối điện tử quản lý nguyên liệu, đơn hàng và khách hàng theo thời gian thực mà vẫn bảo tồn trọn vẹn nét thanh lịch của không gian báo chí cổ điển.',
      metricLabel: 'Lượt Phục Vụ Hàng Tháng',
      metricVal: '15.000+ Khách',
      flavor: 'Chuẩn xác từng giọt chiết xuất',
      quote: '"Cổ điển trong tâm hồn, hiện đại và chuẩn xác trong từng thao tác vận hành."'
    }
  };

  // Terroirs Soil Data
  const TERROIRS_DATA = {
    'caudat': {
      name: 'Cầu Đất, Đà Lạt',
      altitude: '1.600m so với mực nước biển',
      soil: 'Đất đỏ Bazan phong hóa màu mỡ',
      climate: 'Quanh năm mát lạnh, sương mù phủ dày',
      harvest: 'Thu hoạch thủ công tháng 11 - tháng 1',
      products: 'Cold Brew Cam Vàng, Espresso Hổ Phách, Latte Cầu Đất',
      badge: 'ARABICA SPECIALTY',
      desc: 'Được mệnh danh là thiên đường của Arabica Việt Nam, biên độ nhiệt ngày đêm cao giúp hạt tích tụ lượng đường và axit hữu cơ phong phú nhất.'
    },
    'gialai': {
      name: 'Chư Prông, Gia Lai',
      altitude: '750m cao nguyên Trung Phần',
      soil: 'Đất Bazan tầng dày thoát nước tốt',
      climate: 'Nắng gió nhiệt đới, mùa khô rõ rệt',
      harvest: 'Thu hoạch mẻ chín tháng 10 - tháng 12',
      products: 'Cà Phê Muối Di Sản Sài Gòn, Cà Phê Trứng Hà Nội',
      badge: 'ROBUSTA FINE',
      desc: 'Hạt Robusta mộc đậm đà, hạt chắc nịch, hậu vị hạt dẻ cười và cacao nguyên chất, tạo nên linh hồn cho món Cà phê Muối đặc trưng.'
    },
    'baoloc': {
      name: 'Cao Nguyên Trà Bảo Lộc',
      altitude: '1.000m đồi chè mù sương',
      soil: 'Đất phù sa cổ giàu khoáng chất',
      climate: 'Mưa nhiều, độ ẩm 85% lý tưởng cho trà',
      harvest: 'Hái 1 tôm 2 lá vào sáng sớm tinh mơ',
      products: 'Trà Oolong Kem Phô Mai Hoàng Gia, Trà Lài Dưa Lưới',
      badge: 'ORGANIC OOLONG',
      desc: 'Những búp trà Oolong bán lên men 12 tiếng tạo hương hoa lài ngào ngạt, giữ nguyên chất chống oxy hóa tự nhiên.'
    },
    'kyoto': {
      name: 'Uji, Kyoto (Nhật Bản)',
      altitude: 'Đồi chè phủ râm truyền thống',
      soil: 'Đất đồi dốc thoát nước tối ưu',
      climate: '4 mùa phân minh, nguồn nước ngầm thanh khiết',
      harvest: 'Thu hoạch lá trà non đầu mùa (Ichibancha)',
      products: 'Matcha Latte Yến Mạch Kyoto',
      badge: 'CEREMONIAL MATCHA',
      desc: 'Lá trà được che phủ râm 20 ngày trước khi thu hái và nghiền bằng cối đá granite thủ công siêu mịn chuẩn cấp độ Trà Đạo.'
    }
  };

  // Real Database Products State (No Mock Data)
  const [liveProducts, setLiveProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    setProductsLoading(true);
    productsApi.getAll()
      .then((res) => {
        if (res.success && res.data) {
          const mapped = res.data.map((item) => {
            const isCoffee = item.category.toLowerCase().includes('cà phê');
            const isFruit = item.category.toLowerCase().includes('trái cây') || item.category.toLowerCase().includes('quả');
            const isBakery = item.category.toLowerCase().includes('bánh') || item.category.toLowerCase().includes('ngọt');
            const isTea = item.category.toLowerCase().includes('trà');

            let catKey = 'tea';
            if (isCoffee) catKey = 'coffee';
            else if (isFruit) catKey = 'fruit_tea';
            else if (isBakery) catKey = 'bakery';

            let iconName = 'fa-glass-water';
            if (isCoffee) iconName = 'fa-mug-hot';
            else if (isFruit) iconName = 'fa-lemon';
            else if (isBakery) iconName = 'fa-cake-candles';

            return {
              id: item.id,
              name: item.name,
              category: catKey,
              categoryLabel: item.category.toUpperCase(),
              price: item.price || `${(item.price_num || 0).toLocaleString('vi-VN')}đ`,
              tag: item.status === 'Hết hàng' ? 'HẾT HÀNG' : 'ĐANG PHỤC VỤ',
              desc: item.variants ? `Quy chuẩn: ${item.variants}.` : 'Đồ uống đặc sản pha chế tươi mộc mỗi ngày.',
              tastingNotes: ['Nguyên liệu tươi sạch', 'Đậm đà chuẩn vị', 'Pha chế thủ công'],
              origin: item.category,
              icon: iconName,
              status: item.status,
              image: item.image || ''
            };
          });
          setLiveProducts(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setProductsLoading(false));
  }, []);

  const filteredProducts = activeMenuCategory === 'all'
    ? liveProducts
    : liveProducts.filter(p => p.category === activeMenuCategory);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailSub.trim()) return;
    addToast(`Cảm ơn bạn! Bản tin tuần của Tòa soạn Blend đã được gửi tới: ${emailSub}`, 'success');
    setEmailSub('');
  };

  const handleGuestbookSubmit = (e) => {
    e.preventDefault();
    if (!guestbookForm.name || !guestbookForm.memory) {
      addToast('Vui lòng điền họ tên và cảm nghĩ của bạn!', 'error');
      return;
    }
    // Dual-sync to Cloud Firestore
    firestoreGuestbook.create(guestbookForm);
    addToast(`Cảm ơn ${guestbookForm.name}! Lưu bút của bạn đã được ghi vào Cloud Firestore & Biên Niên Sử Blend!`, 'success');
    setGuestbookForm({ name: '', memory: '' });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!tableBooking.name || !tableBooking.phone) {
      addToast('Vui lòng điền đầy đủ họ tên và số điện thoại liên lạc!', 'error');
      return;
    }
    try {
      const res = await reservationsApi.create(tableBooking);
      // Dual-sync directly to Cloud Firestore in realtime
      firestoreReservations.create(tableBooking);
      addToast(
        res.message || `Đã ghi nhận yêu cầu đặt chỗ cho ${tableBooking.name} (${tableBooking.guests} khách) vào lúc ${tableBooking.time} ngày ${tableBooking.date}! (Đồng bộ Cloud Firestore)`, 
        'success'
      );
      setTableBooking({
        name: '',
        phone: '',
        email: '',
        guests: '2',
        date: '2026-08-21',
        time: '18:30',
        area: 'Khu vực đọc báo in cổ điển',
        note: ''
      });
    } catch (err) {
      // Fallback direct to Cloud Firestore if SQLite local backend is offline
      try {
        await firestoreReservations.create(tableBooking);
        addToast(`Đã lưu phiếu đặt chỗ của ${tableBooking.name} lên Cloud Firestore!`, 'success');
        setTableBooking({
          name: '',
          phone: '',
          email: '',
          guests: '2',
          date: '2026-08-21',
          time: '18:30',
          area: 'Khu vực đọc báo in cổ điển',
          note: ''
        });
      } catch (cloudErr) {
        addToast(err.message || 'Không thể gửi phiếu đặt chỗ. Vui lòng thử lại!', 'error');
      }
    }
  };

  const FAQS = [
    {
      q: 'Blend có phục vụ hạt cà phê mang về đóng gói không?',
      a: 'Có, toàn bộ các dòng hạt Arabica Cầu Đất và Robusta Gia Lai rang mộc đều được đóng gói túi zip van 1 chiều 250g/500g kèm tem ghi rõ ngày rang mẻ mới.'
    },
    {
      q: 'Quán có không gian làm việc và Wi-Fi tốc độ cao không?',
      a: 'Không gian tại Blend được bố trí ổ cắm điện đầy đủ tại từng bàn đọc báo, trang bị Wi-Fi cáp quang chuyên dụng và âm nhạc jazz/indie nhẹ nhàng.'
    },
    {
      q: 'Chính sách đặt chỗ cho nhóm trên 10 người như thế nào?',
      a: 'Quý khách vui lòng đặt trước ít nhất 4 tiếng hoặc liên hệ Hotline (028) 3822 8899 để được sắp xếp phòng VIP Salon riêng biệt và chuẩn bị set bánh trà chu đáo.'
    },
    {
      q: 'Blend có hỗ trợ tùy chỉnh mức đường, đá và sữa hạt cho người ăn kiêng không?',
      a: 'Có, thực khách có thể tùy biến 0-100% lượng đường, không đá hoặc đổi sang sữa yến mạch hữu cơ hoàn toàn miễn phí.'
    }
  ];

  return (
    <div className="bg-[#FAF7F2] text-[#161413] font-body min-h-screen selection:bg-[#CF373D] selection:text-white antialiased">
      
      {/* =========================================================================
          TOP GAZETTE MASTHEAD HEADER
          ========================================================================= */}
      <header className="border-b-2 border-[#124874] bg-[#FCFAF6] sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-95">
        
        {/* Newspaper Issue Ticker */}
        <div className="bg-[#124874] text-white px-4 py-1.5 text-[10px] font-cinzel tracking-widest uppercase flex justify-between items-center border-b border-[#0D3656]">
          <div className="flex items-center gap-3">
            <span className="bg-[#CF373D] text-white px-2 py-0.5 font-bold shadow-2xs">VOL. XXIV</span>
            <span>SAIGON &bull; SỐ BÁO ĐẶC BIỆT 2026</span>
            <span className="hidden sm:inline text-white/70">&bull; THE COFFEE &amp; TEA GAZETTE</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-amber-300 font-bold" title={`Độ ẩm: ${weather.humidity || '80%'} • Cảm giác như: ${weather.feelsLike || weather.temp}`}>
              <i className={`fa-solid ${weather.icon || 'fa-sun'} mr-1`}></i> {weather.fullTextLanding}
            </span>
            <span className="text-white/80 font-mono">EST. 2024</span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Masthead Brand Logo (Click takes to Home) */}
          <div 
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group"
            title="Nhấp để về Trang Chủ Blend"
          >
            <img 
              src="/logo.png" 
              alt="Blend Logo" 
              className="w-10 h-10 md:w-11 md:h-11 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" 
            />
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-black text-[#124874] tracking-tight leading-none">
                Blend<span className="text-[#CF373D] font-mono">.</span>
              </h1>
              <span className="font-cinzel text-[9px] tracking-[0.2em] text-[#6E675F] uppercase font-bold block mt-0.5">
                THE ROASTERY GAZETTE &bull; SAIGON
              </span>
            </div>
          </div>

          {/* Individual Page Navigation Links (Clean Editorial Typography) */}
          <nav className="flex items-center gap-5 sm:gap-7 md:gap-8 font-cinzel text-xs font-bold tracking-wider whitespace-nowrap">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`relative py-1.5 uppercase transition-colors duration-200 group flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#CF373D] font-black'
                      : 'text-[#124874] hover:text-[#CF373D]'
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CF373D] animate-pulse"></span>
                  )}
                  <span>{item.label}</span>
                  
                  {/* Subtle Red Underline Indicator */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#CF373D] transition-all duration-200 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </button>
              );
            })}
          </nav>

          {/* Action CTA: Dynamic based on authentication & user role */}
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                {/* Specific Button For Thủ Kho / Warehouse Staff */}
                {user.role && user.role.toLowerCase().includes('kho') ? (
                  <button
                    onClick={() => onEnterApp && onEnterApp('Thủ kho')}
                    style={{ backgroundColor: '#124874', color: '#ffffff' }}
                    className="press-btn px-4 py-2 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-all flex items-center gap-2 shadow-xs whitespace-nowrap group cursor-pointer border-2 border-[#124874]"
                    title="Nhấp để vào Trạm Điều Phối Kho Hàng (Thủ Kho)"
                  >
                    <i className="fa-solid fa-boxes-stacked"></i>
                    <span>TRẠM ĐIỀU PHỐI KHO: {user.name} (THỦ KHO)</span>
                    <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                  </button>
                ) : user.role && (user.role.toLowerCase().includes('quản lý') || user.role.toLowerCase().includes('admin')) ? (
                  <button
                    onClick={() => onEnterApp && onEnterApp('Quản lý')}
                    style={{ backgroundColor: '#124874', color: '#ffffff' }}
                    className="press-btn px-4 py-2 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-all flex items-center gap-2 shadow-xs whitespace-nowrap group cursor-pointer"
                    title="Nhấp để vào Trang Quản Trị"
                  >
                    <i className="fa-solid fa-gauge-high"></i>
                    <span>VÀO TRANG QUẢN TRỊ</span>
                    <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                  </button>
                ) : user.role && (user.role.toLowerCase() === 'customer' || user.role.toLowerCase().includes('khách') || user.role.toLowerCase().includes('thành viên')) ? (
                  <button
                    onClick={() => {
                      setActiveTab('member');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{ backgroundColor: '#124874', color: '#ffffff' }}
                    className="press-btn px-4 py-2 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-all flex items-center gap-2 shadow-xs whitespace-nowrap group cursor-pointer border border-[#C59B27]"
                    title="Nhấp để vào Trang Cá Nhân & Thẻ Hội Viên của bạn"
                  >
                    <i className="fa-solid fa-gem text-[#C59B27]"></i>
                    <span>HỘI VIÊN: {user.name}</span>
                    <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                  </button>
                ) : (
                  <button
                    onClick={() => onEnterApp && onEnterApp(user.role)}
                    style={{ backgroundColor: '#124874', color: '#ffffff' }}
                    className="press-btn px-4 py-2 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-all flex items-center gap-2 shadow-xs whitespace-nowrap group cursor-pointer"
                    title={`Nhấp để vào ca trực đúng vai trò: ${user.role}`}
                  >
                    <i className="fa-solid fa-mug-hot"></i>
                    <span>VÀO CA TRỰC: {user.name} ({user.role})</span>
                    <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const isCust = user?.role && (user.role.toLowerCase() === 'customer' || user.role.toLowerCase().includes('khách') || user.role.toLowerCase().includes('thành viên'));
                    logout();
                    if (isCust) {
                      addToast('Đã đăng xuất tài khoản hội viên. Hẹn sớm gặp lại quý khách!', 'info');
                    } else {
                      addToast('Đã kết thúc ca trực và đăng xuất an toàn!', 'info');
                    }
                  }}
                  title={user?.role && (user.role.toLowerCase() === 'customer' || user.role.toLowerCase().includes('khách') || user.role.toLowerCase().includes('thành viên')) ? "Đăng xuất tài khoản hội viên" : "Đăng xuất khỏi ca trực"}
                  className="px-3 py-2 bg-white border border-[#D8D1C5] text-[#CF373D] font-cinzel text-xs font-bold hover:bg-[#CF373D] hover:text-white transition-colors shadow-xs cursor-pointer"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth || onEnterApp}
                style={{ backgroundColor: '#124874', color: '#ffffff' }}
                className="press-btn px-5 py-2 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-all flex items-center gap-2 shadow-xs whitespace-nowrap group cursor-pointer"
                title="Đăng nhập để vào hệ thống điều phối theo vai trò của bạn"
              >
                <i className="fa-solid fa-key"></i>
                <span>ĐĂNG NHẬP HỆ THỐNG</span>
                <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </button>
            )}
          </div>
        </div>

      </header>

      {/* =========================================================================
          PAGE CONTENT SWITCHER (RENDER TỪNG TRANG VỚI HIỆU ỨNG CHUYỂN TRANG MƯỢT MÀ)
          ========================================================================= */}
      <main key={activeTab} className="animate-page-turn min-h-[calc(100vh-280px)]">

        {/* -----------------------------------------------------------------------
            TRANG 1: TRANG CHỦ (HOME - BẢN TIN TOÀN CẢNH)
            ----------------------------------------------------------------------- */}
        {activeTab === 'home' && (
          <div className="space-y-16 pb-12">
            
            {/* Frontpage Hero Header */}
            <section className="border-b-2 border-[#124874] bg-[#FCFAF6] py-14 px-4 sm:px-8">
              <div className="max-w-6xl mx-auto text-center space-y-4">
                <span className="font-cinzel text-xs font-bold text-[#CF373D] tracking-[0.25em] uppercase block">
                  &mdash; ẤN BẢN TRANG NHẤT TOÀN CẢNH &mdash;
                </span>
                
                <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-[#124874] tracking-tight leading-[1.1] max-w-5xl mx-auto uppercase">
                  KỶ NGUYÊN THƯỞNG THỨC CÀ PHÊ &amp; TRÀ ĐẬM CHẤT NGHỆ THUẬT
                </h2>

                <div className="flex items-center justify-center my-4">
                  <span className="h-[2px] bg-[#124874] w-24"></span>
                  <span className="px-4 font-cinzel text-xs tracking-widest text-[#6E675F] font-bold">✦ ❖ ✦</span>
                  <span className="h-[2px] bg-[#124874] w-24"></span>
                </div>

                <p className="font-serif italic text-lg md:text-xl text-[#6E675F] max-w-3xl mx-auto leading-relaxed">
                  "Nơi từng giọt cà phê muối đậm đà và búp trà Oolong ủ chậm giao hòa cùng văn hóa báo in cổ điển giữa trung tâm Sài Gòn phồn hoa."
                </p>

                {/* Main Action Pills */}
                <div className="flex flex-wrap justify-center gap-4 pt-6">
                  <button
                    onClick={() => {
                      setActiveTab('menu');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
                    className="press-btn px-6 py-3 font-cinzel text-xs font-bold hover:bg-[#AB282D] transition-colors shadow-sm flex items-center gap-2"
                  >
                    <i className="fa-solid fa-mug-hot"></i> KHÁM PHÁ THỰC ĐƠN ĐẶC BẢN
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('booking');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="press-btn px-6 py-3 bg-white text-[#124874] border-2 border-[#124874] font-cinzel text-xs font-bold hover:bg-[#124874] hover:text-white transition-colors flex items-center gap-2"
                  >
                    <i className="fa-solid fa-calendar-days"></i> ĐẶT CHỖ THƯỞNG TRÀ
                  </button>
                </div>
              </div>
            </section>

            {/* 3-Column Broadsheet Highlights */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              
              <div className="editorial-card-press bg-white p-7 border-2 border-[#124874] shadow-[6px_6px_0px_rgba(18,72,116,0.95)] flex flex-col justify-between">
                <div>
                  <div className="border-b border-[#124874] pb-2 mb-4 flex justify-between items-center">
                    <span className="font-cinzel text-xs font-bold text-[#124874] uppercase">01 &bull; DI SẢN CÀ PHÊ</span>
                    <span className="ink-stamp stamp-jasper text-[8px] font-bold">ROASTERY</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#124874] mb-3">
                    Hạt Mộc Cầu Đất &amp; Cà Phê Muối Di Sản
                  </h3>
                  <p className="font-serif text-xs text-gray-700 leading-relaxed text-justify">
                    Tuyển lựa từ nông hộ độ cao 1.600m, rang mộc mẻ nhỏ kết hợp lớp kem sữa muối hồng Himalaya bồng bềnh, tạo nên dấu ấn vị giác khó quên cho người Sài Gòn.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('story');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-6 font-cinzel text-xs font-bold text-[#124874] hover:text-[#CF373D] flex items-center gap-1.5"
                >
                  <span>ĐỌC CÂU CHUYỆN KHỞI NGUỒN</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>

              <div className="editorial-card-press bg-white p-7 border-2 border-[#124874] shadow-[6px_6px_0px_rgba(18,72,116,0.95)] flex flex-col justify-between">
                <div>
                  <div className="border-b border-[#124874] pb-2 mb-4 flex justify-between items-center">
                    <span className="font-cinzel text-xs font-bold text-[#124874] uppercase">02 &bull; TRÀ BẢO LỘC</span>
                    <span className="ink-stamp stamp-green text-[8px] font-bold">ORGANIC</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#124874] mb-3">
                    Lá Trà Oolong Cao Nguyên &amp; Cheese Foam
                  </h3>
                  <p className="font-serif text-xs text-gray-700 leading-relaxed text-justify">
                    Quy trình ủ chậm 12 tiếng giữ trọn hương hoa lài và vị chát thanh, phủ lớp kem phô mai béo ngậy được đánh tươi mới mỗi buổi sớm mai.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-6 font-cinzel text-xs font-bold text-[#124874] hover:text-[#CF373D] flex items-center gap-1.5"
                >
                  <span>XEM BẢNG GIÁ THỰC ĐƠN</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>

              <div className="editorial-card-press bg-white p-7 border-2 border-[#124874] shadow-[6px_6px_0px_rgba(18,72,116,0.95)] flex flex-col justify-between">
                <div>
                  <div className="border-b border-[#124874] pb-2 mb-4 flex justify-between items-center">
                    <span className="font-cinzel text-xs font-bold text-[#124874] uppercase">03 &bull; VẬN HÀNH CHUẨN XÁC</span>
                    <span className="ink-stamp stamp-cerulean text-[8px] font-bold">DIGITAL POS</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#124874] mb-3">
                    Hệ Thống Quản Lý F&amp;B Báo Chí Toàn Diện
                  </h3>
                  <p className="font-serif text-xs text-gray-700 leading-relaxed text-justify">
                    Sổ điều phối gọi món, cảnh báo tồn kho tự động, quản lý hội viên và sổ cái tài chính chuẩn mực được số hóa tức thì thời gian thực.
                  </p>
                </div>
                <button
                  onClick={onEnterApp}
                  className="mt-6 font-cinzel text-xs font-bold text-[#CF373D] hover:underline flex items-center gap-1.5"
                >
                  <span>MỞ TRÌNH QUẢN TRỊ ADMIN</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>

            </section>

            {/* Statistics Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8">
              <div className="bg-[#124874] text-white p-8 border-2 border-[#0D3656] shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <span className="font-display text-3xl sm:text-4xl font-black text-amber-300 block">15.000+</span>
                  <span className="font-cinzel text-[10px] uppercase tracking-wider text-white/80 font-bold">TÁCH PHỤC VỤ MỖI THÁNG</span>
                </div>
                <div>
                  <span className="font-display text-3xl sm:text-4xl font-black text-white block">1.600m</span>
                  <span className="font-cinzel text-[10px] uppercase tracking-wider text-white/80 font-bold">ĐỘ CAO NÔNG TRẠI CẦU ĐẤT</span>
                </div>
                <div>
                  <span className="font-display text-3xl sm:text-4xl font-black text-amber-300 block">14 NGÀY</span>
                  <span className="font-cinzel text-[10px] uppercase tracking-wider text-white/80 font-bold">QUY TRÌNH DEGAS HẠT MỘC</span>
                </div>
                <div>
                  <span className="font-display text-3xl sm:text-4xl font-black text-white block">4.9 ★</span>
                  <span className="font-cinzel text-[10px] uppercase tracking-wider text-white/80 font-bold">ĐÁNH GIÁ BÁO GIỚI &amp; KHÁCH</span>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* -----------------------------------------------------------------------
            TRANG 2: CÂU CHUYỆN THƯƠNG HIỆU (MAGAZINE GRADE HERITAGE DISPATCH)
            ----------------------------------------------------------------------- */}
        {activeTab === 'story' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-16">
            
            {/* Story Masthead Banner */}
            <div className="text-center border-b-2 border-[#124874] pb-8 space-y-3">
              <span className="font-cinzel text-xs font-bold text-[#CF373D] tracking-[0.3em] uppercase block">
                ✦ BIÊN NIÊN SỬ TÒA SOẠN &bull; THE FOUNDING CHRONICLES ✦
              </span>
              <h2 className="font-display text-4xl sm:text-6xl font-black text-[#124874] tracking-tight max-w-4xl mx-auto leading-tight">
                Hành Trình Khởi Khắc &amp; Tôn Vinh Di Sản Sài Gòn
              </h2>
              <div className="flex items-center justify-center gap-3">
                <span className="h-[2px] bg-[#124874] w-20"></span>
                <span className="font-cinzel text-[11px] font-bold text-[#6E675F] tracking-widest uppercase">2024 &mdash; 2026</span>
                <span className="h-[2px] bg-[#124874] w-20"></span>
              </div>
              <p className="font-serif italic text-base sm:text-lg text-[#6E675F] max-w-3xl mx-auto leading-relaxed">
                "Một hành trình kiếm tìm sự tĩnh lặng giữa phố thị, nơi từng trang báo in và tách cà phê mộc tìm thấy tiếng nói chung."
              </p>

              {/* Interactive Atmosphere Mood Bar */}
              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlayingAmbience(!isPlayingAmbience);
                    addToast(
                      !isPlayingAmbience
                        ? 'Đã bật âm hưởng tòa soạn: Tiếng máy gõ chữ & đĩa than Jazz êm dịu.'
                        : 'Đã tạm dừng âm hưởng tòa soạn.',
                      'info'
                    );
                  }}
                  className={`px-5 py-2.5 rounded-full font-cinzel text-xs font-bold border-2 transition-all flex items-center gap-3 shadow-xs ${
                    isPlayingAmbience
                      ? 'bg-[#124874] text-white border-[#0D3656]'
                      : 'bg-white text-[#124874] border-[#124874] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <i className={`fa-solid ${isPlayingAmbience ? 'fa-volume-high text-amber-300 animate-pulse' : 'fa-headphones text-[#CF373D]'}`}></i>
                  <span>{isPlayingAmbience ? 'ĐANG PHÁT: KHÔNG GIAN BÁO IN & JAZZ SÀI GÒN' : 'BẬT ÂM HƯỞNG TÒA SOẠN & TIẾNG MÁY RANG'}</span>
                  {isPlayingAmbience && (
                    <span className="flex items-center gap-0.5">
                      <span className="w-1 h-3 bg-amber-300 animate-bounce"></span>
                      <span className="w-1 h-4 bg-amber-300 animate-bounce delay-100"></span>
                      <span className="w-1 h-2 bg-amber-300 animate-bounce delay-200"></span>
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Interactive Timeline Epoch Selector */}
            <div className="bg-white p-6 sm:p-8 border-2 border-[#124874] shadow-[8px_8px_0px_rgba(18,72,116,0.95)] space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#124874] pb-4">
                <div>
                  <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider block">
                    BIÊN NIÊN CỘT MỐC THỜI GIAN
                  </span>
                  <span className="font-serif italic text-xs text-gray-500">Nhấp chọn từng mốc để xem tài liệu lưu trữ</span>
                </div>
                
                {/* Year Buttons */}
                <div className="flex gap-2">
                  {['2024', '2025', '2026'].map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedEra(year)}
                      className={`px-4 py-2 font-mono font-bold text-xs border-2 transition-all ${
                        selectedEra === year
                          ? 'bg-[#CF373D] text-white border-[#AB282D] shadow-xs scale-105'
                          : 'bg-[#FAF7F2] text-[#124874] border-[#D8D1C5] hover:border-[#124874]'
                      }`}
                    >
                      NĂM {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exhibit Active Card */}
              <div className="bg-[#FCFAF6] p-6 border-2 border-[#D8D1C5] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="ink-stamp stamp-jasper text-[9px] font-bold">{ERAS_DATA[selectedEra].tag}</span>
                    <span className="font-mono text-xs text-gray-500 font-bold">{ERAS_DATA[selectedEra].stamp}</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-black text-[#124874]">
                    {ERAS_DATA[selectedEra].title}
                  </h3>
                  <p className="font-cinzel text-xs text-[#CF373D] font-bold tracking-wide">
                    {ERAS_DATA[selectedEra].subtitle}
                  </p>
                  <p className="font-serif text-sm text-gray-700 leading-relaxed text-justify">
                    {ERAS_DATA[selectedEra].content}
                  </p>
                  <blockquote className="p-3 bg-white border-l-4 border-[#124874] font-serif italic text-xs text-gray-800">
                    {ERAS_DATA[selectedEra].quote}
                  </blockquote>
                </div>

                <div className="lg:col-span-4 bg-white p-5 border border-[#124874] text-center space-y-3 shadow-xs">
                  <span className="font-cinzel text-[10px] text-gray-500 font-bold uppercase block">CHỈ SỐ TIÊU BIỂU</span>
                  <span className="font-display text-3xl font-black text-[#124874] block">
                    {ERAS_DATA[selectedEra].metricVal}
                  </span>
                  <span className="font-cinzel text-[10px] text-[#CF373D] font-bold uppercase block border-t border-[#D8D1C5] pt-2">
                    {ERAS_DATA[selectedEra].metricLabel}
                  </span>
                  <div className="p-2 bg-[#FAF7F2] font-serif text-[11px] text-gray-600 italic">
                    <i className="fa-solid fa-seedling text-emerald-700 mr-1"></i> {ERAS_DATA[selectedEra].flavor}
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Feature Story Chapters */}
            <div className="space-y-10">
              <div className="text-center">
                <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-widest block">
                  &mdash; 4 HỒI KÝ SỰ KHỞI SINH THƯƠNG HIỆU &mdash;
                </span>
              </div>

              {/* Chapter I */}
              <article className="editorial-card-press bg-white p-6 sm:p-10 border-2 border-[#124874] shadow-[8px_8px_0px_rgba(18,72,116,0.95)] space-y-4">
                <div className="border-b-2 border-[#124874] pb-3 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#124874] text-white font-cinzel text-[10px] font-bold">HỒI 01</span>
                    <span className="font-cinzel text-xs font-bold text-[#124874] uppercase">TIẾNG LÁCH TÁCH GIỮA SỚM MAI SÀI GÒN</span>
                  </div>
                  <span className="ink-stamp stamp-jasper text-[8px] font-bold">SAIGON HERITAGE</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-8 space-y-3">
                    <p className="font-serif text-sm text-gray-800 leading-relaxed text-justify">
                      <span className="float-left text-6xl font-display font-black text-[#124874] leading-none pr-3 pt-1">S</span>
                      ài Gòn luôn thức giấc bằng mùi hương cà phê nồng nàn từ những góc phố quen. Nhưng tại Blend, chúng tôi khao khát một trải nghiệm sâu lắng hơn &mdash; nơi thực khách có thể chậm lại, lắng nghe tiếng hạt cà phê nổ tí tách trong lồng rang và lật mở từng trang báo giấy còn vương mùi mực in tươi.
                    </p>
                    <p className="font-serif text-sm text-gray-800 leading-relaxed text-justify">
                      Khởi đầu từ xưởng rang mộc nhỏ tại Quận 1, đội ngũ Blend kiên định với tôn chỉ không sử dụng bất kỳ chất phụ gia hương liệu nào. Mỗi hạt Arabica và Robusta được đối xử như một tác phẩm nghệ thuật, tôn vinh công sức của những người nông dân bền bỉ trên mảnh đất đỏ bazan Cầu Đất và Bảo Lộc.
                    </p>
                  </div>
                  <div className="md:col-span-4 p-5 bg-[#FAF7F2] border-2 border-[#D8D1C5] text-center space-y-2">
                    <i className="fa-solid fa-mug-saucer text-4xl text-[#124874]"></i>
                    <h4 className="font-display font-bold text-base text-[#124874]">Hương Vị Nguyên Bản</h4>
                    <p className="font-serif italic text-xs text-gray-600 leading-relaxed">
                      "Không phụ gia, không bắp rang cháy, chỉ có vị đắng ngọt nguyên thủy của hạt cà phê mộc."
                    </p>
                  </div>
                </div>
              </article>

              {/* Chapter II */}
              <article className="editorial-card-press bg-white p-6 sm:p-10 border-2 border-[#124874] shadow-[8px_8px_0px_rgba(18,72,116,0.95)] space-y-4">
                <div className="border-b-2 border-[#124874] pb-3 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#CF373D] text-white font-cinzel text-[10px] font-bold">HỒI 02</span>
                    <span className="font-cinzel text-xs font-bold text-[#124874] uppercase">NÔNG TRẠI CẦU ĐẤT 1.600M &amp; GIỌT SƯƠNG CAO NGUYÊN</span>
                  </div>
                  <span className="ink-stamp stamp-green text-[8px] font-bold">ALTITUDE 1.600M</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-8 space-y-3">
                    <p className="font-serif text-sm text-gray-800 leading-relaxed text-justify">
                      <span className="float-left text-6xl font-display font-black text-[#CF373D] leading-none pr-3 pt-1">Đ</span>
                      ỉnh Cầu Đất quanh năm sương phủ, đất đỏ bazan phì nhiêu tạo nên vùng vi khí hậu độc nhất vô nhị. Chúng tôi trực tiếp đồng hành cùng nông dân, chỉ thu hoạch những quả cà phê chín mọng 100% bằng tay, ngâm ủ lên men tự nhiên 48 giờ để bảo lưu trọn vẹn tầng hương hoa cỏ và mật ong rừng.
                    </p>
                    <p className="font-serif text-sm text-gray-800 leading-relaxed text-justify">
                      Từng mẻ nhân xanh chuyển về Sài Gòn đều trải qua quy trình kiểm định độ ẩm nghiêm ngặt 10.5% trước khi bước vào lò rang đối lưu.
                    </p>
                  </div>
                  <div className="md:col-span-4 p-5 bg-[#FAF7F2] border-2 border-[#D8D1C5] text-center space-y-2">
                    <i className="fa-solid fa-mountain text-4xl text-emerald-800"></i>
                    <h4 className="font-display font-bold text-base text-[#124874]">Độ Cao Lý Tưởng</h4>
                    <p className="font-serif italic text-xs text-gray-600 leading-relaxed">
                      "Biên độ nhiệt ngày đêm 15°C trên cao nguyên giúp hạt cà phê tích lũy trọn vẹn vị ngọt mật ong."
                    </p>
                  </div>
                </div>
              </article>

              {/* Chapter III */}
              <article className="editorial-card-press bg-white p-6 sm:p-10 border-2 border-[#124874] shadow-[8px_8px_0px_rgba(18,72,116,0.95)] space-y-4">
                <div className="border-b-2 border-[#124874] pb-3 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-800 text-white font-cinzel text-[10px] font-bold">HỒI 03</span>
                    <span className="font-cinzel text-xs font-bold text-[#124874] uppercase">LÁ TRÀ CỔ THỤ BẢO LỘC &amp; CHEESE FOAM HOÀNG GIA</span>
                  </div>
                  <span className="ink-stamp stamp-cerulean text-[8px] font-bold">ARTISANAL TEA</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-8 space-y-3">
                    <p className="font-serif text-sm text-gray-800 leading-relaxed text-justify">
                      <span className="float-left text-6xl font-display font-black text-emerald-800 leading-none pr-3 pt-1">B</span>
                      ên cạnh cà phê rang mộc, trà là một nửa linh hồn của Blend. Những búp trà Oolong một tôm hai lá tại Bảo Lộc được ủ lạnh chậm 12 giờ ở nhiệt độ 4°C để chiết xuất vị ngọt umami tự nhiên mà không đắng gắt. Kết hợp cùng lớp kem phô mai béo mặn đánh bông thủ công tạo nên tuyệt phẩm được yêu thích nhất.
                    </p>
                  </div>
                  <div className="md:col-span-4 p-5 bg-[#FAF7F2] border-2 border-[#D8D1C5] text-center space-y-2">
                    <i className="fa-solid fa-leaf text-4xl text-[#CF373D]"></i>
                    <h4 className="font-display font-bold text-base text-[#124874]">Ủ Chậm 12 Tiếng</h4>
                    <p className="font-serif italic text-xs text-gray-600 leading-relaxed">
                      "Giữ trọn hương hoa lài thơm ngát và lớp bọt phô mai sánh mịn như lụa."
                    </p>
                  </div>
                </div>
              </article>

              {/* Chapter IV */}
              <article className="editorial-card-press bg-white p-6 sm:p-10 border-2 border-[#124874] shadow-[8px_8px_0px_rgba(18,72,116,0.95)] space-y-4">
                <div className="border-b-2 border-[#124874] pb-3 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#124874] text-white font-cinzel text-[10px] font-bold">HỒI 04</span>
                    <span className="font-cinzel text-xs font-bold text-[#124874] uppercase">TÒA SOẠN BÁO IN &amp; HỆ THỐNG VẬN HÀNH THỜI ĐẠI SỐ</span>
                  </div>
                  <span className="ink-stamp stamp-jasper text-[8px] font-bold">PRESS ARCHITECTURE</span>
                </div>

                <p className="font-serif text-sm text-gray-800 leading-relaxed text-justify">
                  <span className="float-left text-6xl font-display font-black text-[#124874] leading-none pr-3 pt-1">B</span>
                  lend được thiết kế mô phỏng kiến trúc một tòa soạn báo chí cổ điển của thế kỷ trước: tường gạch thô, kệ trưng bày báo in mới mỗi ngày, máy phát đĩa than và ánh đèn vàng ấm cúng. Nhưng ẩn sau sự hoài niệm ấy là một bộ máy vận hành chuẩn xác thời gian thực: sổ cái điện tử, cảnh báo định lượng pha chế và kiểm soát chất lượng đồng nhất tuyệt đối cho từng lượt khách.
                </p>
              </article>
            </div>

            {/* Interactive Terroir Soil Explorer */}
            <div className="bg-[#FCFAF6] p-6 sm:p-8 border-2 border-[#124874] shadow-xs space-y-6">
              <div className="border-b border-[#124874] pb-3 flex justify-between items-center">
                <div>
                  <span className="font-cinzel text-xs font-bold text-[#CF373D] uppercase tracking-wider block">
                    BẢN ĐỒ THỔ NHƯỠNG &amp; NGUỒN GỐC NGUYÊN LIỆU
                  </span>
                  <span className="font-serif italic text-xs text-gray-500">Khám phá xuất xứ từng nguyên liệu thượng hạng</span>
                </div>
                <span className="ink-stamp stamp-green text-[8px] font-bold">TERROIR</span>
              </div>

              {/* Terroir Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'caudat', label: 'CẦU ĐẤT (1.600M)', icon: 'fa-mountain' },
                  { id: 'gialai', label: 'GIA LAI (750M)', icon: 'fa-sun' },
                  { id: 'baoloc', label: 'BẢO LỘC (1.000M)', icon: 'fa-leaf' },
                  { id: 'kyoto', label: 'KYOTO (NHẬT BẢN)', icon: 'fa-torii-gate' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTerroir(t.id)}
                    className={`p-3 font-cinzel text-xs font-bold border transition-all text-center flex flex-col items-center gap-1.5 ${
                      selectedTerroir === t.id
                        ? 'bg-[#124874] text-white border-[#0D3656] shadow-xs font-black'
                        : 'bg-white text-[#124874] border-[#D8D1C5] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <i className={`fa-solid ${t.icon}`}></i>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Active Terroir Details */}
              <div className="bg-white p-6 border-2 border-[#124874] grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-xs">
                <div className="md:col-span-7 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="ink-stamp stamp-jasper text-[8px] font-bold">{TERROIRS_DATA[selectedTerroir].badge}</span>
                    <strong className="font-display text-xl text-[#124874]">{TERROIRS_DATA[selectedTerroir].name}</strong>
                  </div>
                  <p className="font-serif text-xs text-gray-700 leading-relaxed">
                    {TERROIRS_DATA[selectedTerroir].desc}
                  </p>
                  <div className="pt-2">
                    <span className="font-cinzel text-[10px] text-gray-500 uppercase font-bold block">SẢN PHẨM TIÊU BIỂU:</span>
                    <span className="font-serif text-xs text-[#CF373D] font-bold">{TERROIRS_DATA[selectedTerroir].products}</span>
                  </div>
                </div>

                <div className="md:col-span-5 bg-[#FAF7F2] p-4 border border-[#D8D1C5] space-y-2 font-serif text-xs">
                  <div>
                    <strong className="text-[#124874] block font-cinzel text-[10px]">ĐỘ CAO:</strong>
                    <span>{TERROIRS_DATA[selectedTerroir].altitude}</span>
                  </div>
                  <div>
                    <strong className="text-[#124874] block font-cinzel text-[10px]">THỔ NHƯỠNG:</strong>
                    <span>{TERROIRS_DATA[selectedTerroir].soil}</span>
                  </div>
                  <div>
                    <strong className="text-[#124874] block font-cinzel text-[10px]">KHÍ HẬU:</strong>
                    <span>{TERROIRS_DATA[selectedTerroir].climate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* The 3 Core Manifestos */}
            <div className="space-y-6">
              <div className="text-center">
                <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-widest block">
                  &mdash; TUYÊN NGÔN 3 GIÁ TRỊ BẤT BIẾN CỦA BLEND &mdash;
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 border-2 border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.95)] space-y-2 text-center">
                  <div className="w-12 h-12 bg-[#124874] text-white rounded-full flex items-center justify-center mx-auto text-lg font-display font-black mb-2">
                    01
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#124874]">Sự Thuần Khiết Tuyệt Đối</h4>
                  <p className="font-serif text-xs text-gray-600 leading-relaxed">
                    100% cà phê rang mộc và lá trà nguyên bản, không phụ gia, không chất bảo quản, không hương liệu nhân tạo.
                  </p>
                </div>

                <div className="bg-white p-6 border-2 border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.95)] space-y-2 text-center">
                  <div className="w-12 h-12 bg-[#CF373D] text-white rounded-full flex items-center justify-center mx-auto text-lg font-display font-black mb-2">
                    02
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#124874]">Thương Mại Công Bằng</h4>
                  <p className="font-serif text-xs text-gray-600 leading-relaxed">
                    Cam kết thu mua giá cao hơn 30% thị trường trực tiếp từ nông hộ để hỗ trợ nông dân gìn giữ giống chè &amp; cà phê quý.
                  </p>
                </div>

                <div className="bg-white p-6 border-2 border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.95)] space-y-2 text-center">
                  <div className="w-12 h-12 bg-emerald-800 text-white rounded-full flex items-center justify-center mx-auto text-lg font-display font-black mb-2">
                    03
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#124874]">Di Sản Giao Hòa Hiện Đại</h4>
                  <p className="font-serif text-xs text-gray-600 leading-relaxed">
                    Không gian văn hóa báo in hoài niệm kết hợp cùng chuẩn mực chiết xuất và công nghệ vận hành số hóa tân tiến.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Guestbook Note */}
            <div className="bg-white p-6 sm:p-8 border-2 border-[#124874] shadow-[8px_8px_0px_rgba(18,72,116,0.95)]">
              <div className="border-b border-[#124874] pb-3 mb-6 flex justify-between items-center">
                <div>
                  <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider block">
                    SỔ LƯU BÚT ĐỘC GIẢ &bull; GUESTBOOK CHRONICLE
                  </span>
                  <span className="font-serif italic text-xs text-gray-500">Gửi gắm cảm nhận của bạn về hương vị cà phê &amp; văn hóa đọc báo</span>
                </div>
                <i className="fa-solid fa-feather-pointed text-2xl text-[#CF373D]"></i>
              </div>

              <form onSubmit={handleGuestbookSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                      Tên của bạn *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Minh Thư (Độc giả Sài Gòn)"
                      value={guestbookForm.name}
                      onChange={(e) => setGuestbookForm({ ...guestbookForm, name: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#124874] px-3.5 py-2 font-serif text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                  </div>
                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                      Cảm nghĩ &amp; Kỷ niệm với tách cà phê *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Cà phê muối tại đây gợi lại trọn vẹn ký ức tuổi thơ..."
                      value={guestbookForm.memory}
                      onChange={(e) => setGuestbookForm({ ...guestbookForm, memory: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#124874] px-3.5 py-2 font-serif text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    style={{ backgroundColor: '#124874', color: '#ffffff' }}
                    className="press-btn px-6 py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-xs flex items-center gap-2"
                  >
                    <i className="fa-solid fa-stamp text-amber-300"></i>
                    <span>ĐÓNG DẤU LƯU BÚT TÒA SOẠN</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Founder Wax Seal Letter */}
            <div className="bg-[#FCFAF6] p-8 sm:p-12 border-4 border-[#124874] text-center space-y-4 shadow-md relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 opacity-10 text-9xl font-serif select-none pointer-events-none">
                B.
              </div>

              <span className="font-cinzel text-xs font-bold text-[#CF373D] uppercase tracking-[0.3em] block">
                ✦ BẢN GIAO ƯỚC VĂN HÓA CỦA BAN SÁNG LẬP ✦
              </span>

              <p className="font-serif italic text-base sm:text-lg text-gray-800 max-w-2xl mx-auto leading-relaxed text-justify sm:text-center">
                "Chúng tôi tin rằng trong một thế giới ngày càng vội vã, những giá trị nguyên bản, sự tĩnh lặng và lòng trắc ẩn với hạt ngọc quê hương vẫn luôn tìm được chỗ đứng trong trái tim mỗi người yêu cái đẹp."
              </p>

              <div className="pt-4 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#CF373D] text-white flex items-center justify-center font-display font-black text-xl shadow-md border-2 border-white mb-2">
                  B.
                </div>
                <span className="font-display font-bold text-lg text-[#124874]">
                  Ban Sáng Lập &amp; Hội Đồng Chủ Biên Blend Roastery
                </span>
                <span className="font-cinzel text-[10px] text-gray-500 font-bold tracking-widest mt-0.5">
                  SAIGON &bull; VIETNAM &bull; 2024 &mdash; 2026
                </span>
              </div>
            </div>

          </div>
        )}

        {/* -----------------------------------------------------------------------
            TRANG 3: THỰC ĐƠN ĐẶC TUYỂN (MENU & GASTRONOMY)
            ----------------------------------------------------------------------- */}
        {activeTab === 'menu' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
            
            <div className="text-center border-b-2 border-[#124874] pb-6">
              <span className="font-cinzel text-xs font-bold text-[#CF373D] tracking-[0.2em] uppercase block mb-1">
                THỰC PHỔ BÁO CHÍ &bull; GASTRONOMY GAZETTE
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-[#124874] tracking-tight">
                Tuyển Tập Đồ Uống &amp; Điểm Tâm Đặc Bản
              </h2>
              <div className="h-[2px] bg-[#124874] w-20 mx-auto my-3"></div>
              <p className="font-serif italic text-sm text-gray-600 max-w-xl mx-auto">
                Tất cả đồ uống được pha chế thủ công theo công thức độc quyền, sử dụng 100% nguyên liệu tự nhiên không hóa chất bảo quản.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { id: 'all', label: 'TẤT CẢ DANH MỤC (12)' },
                { id: 'coffee', label: 'CÀ PHÊ RANG MỘC' },
                { id: 'tea', label: 'TRÀ SỮA & CHEESE TEA' },
                { id: 'fruit_tea', label: 'TRÀ TRÁI CÂY TƯƠI' },
                { id: 'bakery', label: 'BÁNH ĐIỂM TÂM' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveMenuCategory(cat.id)}
                  className={`px-4 py-2 font-cinzel text-xs font-bold border transition-all ${
                    activeMenuCategory === cat.id
                      ? 'bg-[#124874] text-white border-[#0D3656] shadow-sm font-black'
                      : 'bg-white text-[#124874] border-[#D8D1C5] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Product Cards Grid (12 Items) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className="editorial-card-press bg-white p-6 border-2 border-[#124874] shadow-[6px_6px_0px_rgba(18,72,116,0.95)] hover:border-[#CF373D] hover:shadow-[8px_8px_0px_rgba(207,55,61,0.95)] transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start border-b border-[#D8D1C5] pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xs bg-[#FAF7F2] border border-[#124874] text-[#124874] flex items-center justify-center text-xs">
                          <i className={`fa-solid ${p.icon}`}></i>
                        </div>
                        <div>
                          <span className="font-cinzel text-[9px] uppercase tracking-wider text-[#6E675F] block font-bold">
                            {p.categoryLabel}
                          </span>
                          <span className="font-mono text-[10px] text-[#CF373D] font-bold">#{p.id}</span>
                        </div>
                      </div>
                      <span className="ink-stamp stamp-jasper text-[8px] font-bold">{p.tag}</span>
                    </div>

                    {p.image && (
                      <div className="w-full h-36 border border-[#124874] overflow-hidden bg-[#FAF7F2] relative shadow-2xs">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <h3 className="font-display text-xl font-bold text-[#124874] group-hover:text-[#CF373D] transition-colors leading-snug">
                      {p.name}
                    </h3>
                    <p className="font-serif text-xs text-gray-600 leading-relaxed">
                      {p.desc}
                    </p>

                    {/* Origin Badge */}
                    <div className="text-[10px] font-cinzel text-gray-500 font-bold">
                      <i className="fa-solid fa-location-dot text-[#CF373D] mr-1"></i> {p.origin}
                    </div>

                    {/* Tasting Notes */}
                    <div className="pt-2">
                      <span className="font-cinzel text-[9px] uppercase tracking-wider text-gray-500 font-bold block mb-1">
                        TẦNG HƯƠNG VỊ:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {p.tastingNotes.map((tn, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-[#FAF7F2] border border-[#D8D1C5] font-serif text-[10px] text-gray-700">
                            &bull; {tn}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#D8D1C5] flex items-center justify-between gap-2">
                    <div>
                      <span className="font-cinzel text-[9px] text-gray-500 uppercase block font-bold">GIÁ BÁN</span>
                      <span className="font-mono text-lg font-black text-[#124874]">{p.price}</span>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToast(`Đã thêm món "${p.name}" vào danh sách yêu thích của bạn!`, 'success');
                        }}
                        className="press-btn px-2.5 py-1.5 bg-white border border-[#124874] text-[#124874] font-cinzel text-xs font-bold hover:bg-[#124874] hover:text-white transition-colors cursor-pointer"
                        title="Lưu yêu thích"
                      >
                        <i className="fa-solid fa-heart text-[#CF373D]"></i>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(p);
                        }}
                        style={{ backgroundColor: '#124874', color: '#ffffff' }}
                        className="press-btn px-3 py-1.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <i className="fa-solid fa-book-open"></i>
                        <span>CHI TIẾT MÓN</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Customization Options Box */}
            <div className="bg-[#FAF7F2] p-6 border-2 border-[#124874] shadow-xs space-y-4">
              <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider block border-b border-[#D8D1C5] pb-2">
                HƯỚNG DẪN TÙY BIẾN KHẨU VỊ TẠI QUẦY
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-serif text-gray-700">
                <div className="p-3 bg-white border border-[#D8D1C5]">
                  <strong className="text-[#124874] block font-cinzel text-xs mb-1">MỨC ĐƯỜNG MÍA TỰ NHIÊN:</strong>
                  <span>0% (Không đường) &bull; 30% (Ít ngọt) &bull; 50% (Tiêu chuẩn) &bull; 70% &bull; 100%.</span>
                </div>
                <div className="p-3 bg-white border border-[#D8D1C5]">
                  <strong className="text-[#124874] block font-cinzel text-xs mb-1">LƯỢNG ĐÁ &amp; NHIỆT ĐỘ:</strong>
                  <span>Không đá &bull; 50% đá &bull; 100% đá hoặc Phục vụ Nóng ấm ly giữ nhiệt.</span>
                </div>
                <div className="p-3 bg-white border border-[#D8D1C5]">
                  <strong className="text-[#124874] block font-cinzel text-xs mb-1">TOPPING LÀM TƯƠI:</strong>
                  <span>Trân châu đen (+5k) &bull; Kem Phô Mai Macchiato (+10k) &bull; Thạch củ năng (+7k) &bull; Hạt sen (+8k).</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* -----------------------------------------------------------------------
            TRANG 4: NGHỆ THUẬT RANG MỘC (ROASTERY CRAFT)
            ----------------------------------------------------------------------- */}
        {activeTab === 'roastery' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-12">
            
            <div className="text-center border-b-2 border-[#124874] pb-6">
              <span className="font-cinzel text-xs font-bold text-[#CF373D] tracking-[0.25em] uppercase block mb-1">
                KỸ NGHỆ RANG MỘC &bull; ARTISANAL ROASTING
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-[#124874] tracking-tight">
                Nghệ Thuật Rang Mộc &amp; Chiết Xuất Độc Bản
              </h2>
              <div className="h-[2px] bg-[#124874] w-20 mx-auto my-3"></div>
              <p className="font-serif italic text-sm text-gray-600 max-w-xl mx-auto">
                Khám phá quy trình 4 giai đoạn từ nông trại Cầu Đất đến từng giọt cà phê đậm đà trên bàn thưởng thức.
              </p>
            </div>

            {/* 4 Roasting Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white p-6 border-2 border-[#124874] shadow-[6px_6px_0px_rgba(18,72,116,0.95)] space-y-3">
                <div className="flex justify-between items-center border-b border-[#124874] pb-2">
                  <span className="font-cinzel text-xs font-bold text-[#CF373D]">GIAI ĐOẠN 01</span>
                  <span className="ink-stamp stamp-cerulean text-[8px] font-bold">SELECTION</span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#124874]">
                  Tuyển Chọn Hạt Nhân Xanh Thượng Hạng
                </h3>
                <p className="font-serif text-xs text-gray-700 leading-relaxed text-justify">
                  Chỉ những quả cà phê chín mọng 100% từ độ cao 1.600m Cầu Đất và Gia Lai mới được thu hái thủ công, qua công đoạn sơ chế ướt và lên men chậm 48 giờ để phát triển tầng axit trái cây hữu cơ.
                </p>
              </div>

              <div className="bg-white p-6 border-2 border-[#124874] shadow-[6px_6px_0px_rgba(18,72,116,0.95)] space-y-3">
                <div className="flex justify-between items-center border-b border-[#124874] pb-2">
                  <span className="font-cinzel text-xs font-bold text-[#CF373D]">GIAI ĐOẠN 02</span>
                  <span className="ink-stamp stamp-jasper text-[8px] font-bold">ROAST CRAFT</span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#124874]">
                  Thăng Hoa Nhiệt Độ &amp; Mẻ Rang Nhỏ
                </h3>
                <p className="font-serif text-xs text-gray-700 leading-relaxed text-justify">
                  Sử dụng máy rang trống gia nhiệt đối lưu, kiểm soát đường cong nhiệt độ (Roast Profile) chuẩn xác từng giây để đánh thức tầng hương mật ong và sôcôla mà không làm cháy khét hạt.
                </p>
              </div>

              <div className="bg-white p-6 border-2 border-[#124874] shadow-[6px_6px_0px_rgba(18,72,116,0.95)] space-y-3">
                <div className="flex justify-between items-center border-b border-[#124874] pb-2">
                  <span className="font-cinzel text-xs font-bold text-[#CF373D]">GIAI ĐOẠN 03</span>
                  <span className="ink-stamp stamp-green text-[8px] font-bold">DEGAS 14 DAYS</span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#124874]">
                  Ủ Thoát Khí Degas 14 Ngày
                </h3>
                <p className="font-serif text-xs text-gray-700 leading-relaxed text-justify">
                  Hạt sau khi rang được ủ trong van một chiều đúng 14 ngày để giải phóng khí CO2 tự nhiên, giúp cà phê đạt độ chín muồi, mượt mà và êm dịu nhất trước khi xay và chiết xuất.
                </p>
              </div>

              <div className="bg-white p-6 border-2 border-[#124874] shadow-[6px_6px_0px_rgba(18,72,116,0.95)] space-y-3">
                <div className="flex justify-between items-center border-b border-[#124874] pb-2">
                  <span className="font-cinzel text-xs font-bold text-[#CF373D]">GIAI ĐOẠN 04</span>
                  <span className="ink-stamp stamp-cerulean text-[8px] font-bold">EXTRACTION</span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#124874]">
                  Kỹ Nghệ Chiết Xuất Chuẩn Áp Suất Kép
                </h3>
                <p className="font-serif text-xs text-gray-700 leading-relaxed text-justify">
                  Mỗi shot Espresso được chiết xuất trong 28 giây ở áp suất 9 bar và nhiệt độ 93.5°C, đảm bảo lớp Crema vàng óng ánh, vị ngọt tự nhiên và hậu vị sâu lắng kéo dài.
                </p>
              </div>

            </div>

            {/* Equipment Showcase */}
            <div className="bg-[#FCFAF6] p-8 border-2 border-[#124874] shadow-xs space-y-6">
              <div className="border-b border-[#124874] pb-2 flex justify-between items-center">
                <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider">
                  TRANG THIẾT BỊ RANG &amp; CHIẾT XUẤT ĐẲNG CẤP
                </span>
                <span className="ink-stamp stamp-jasper text-[8px] font-bold">EQUIPMENT</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-serif text-xs">
                <div className="p-4 bg-white border border-[#D8D1C5] space-y-2">
                  <strong className="text-[#124874] font-cinzel text-xs block font-bold">MÁY PHA SYNESSO CYNCRA</strong>
                  <p className="text-gray-600 leading-relaxed">Hệ thống đa nồi hơi độc lập kiểm soát nhiệt độ nước chính xác đến 0.2°C cho từng họng chiết xuất.</p>
                </div>
                <div className="p-4 bg-white border border-[#D8D1C5] space-y-2">
                  <strong className="text-[#124874] font-cinzel text-xs block font-bold">MÁY XAY MAHLKÖNIG EK43</strong>
                  <p className="text-gray-600 leading-relaxed">Lưỡi dao phẳng 98mm của Đức đảm bảo kích thước bột cà phê đồng đều 99%, chống tắc nghẽn.</p>
                </div>
                <div className="p-4 bg-white border border-[#D8D1C5] space-y-2">
                  <strong className="text-[#124874] font-cinzel text-xs block font-bold">LỌC NƯỚC RO 5 CẤP BVT</strong>
                  <p className="text-gray-600 leading-relaxed">Tái cân bằng khoáng chất Magiê &amp; Canxi đạt chuẩn SCA giúp kích hoạt trọn vẹn tầng hương vị.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* -----------------------------------------------------------------------
            TRANG 5: ĐẶT BÀN & TRẢI NGHIỆM (RESERVATION LOUNGE)
            ----------------------------------------------------------------------- */}
        {activeTab === 'booking' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-12">
            
            <div className="text-center border-b-2 border-[#124874] pb-6">
              <span className="font-cinzel text-xs font-bold text-[#CF373D] tracking-[0.25em] uppercase block mb-1">
                ĐẶT CHỖ THƯỞNG THỨC &bull; RESERVATION SALON
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-[#124874] tracking-tight">
                Giữ Chỗ Không Gian Báo Chí Cổ Điển
              </h2>
              <div className="h-[2px] bg-[#124874] w-20 mx-auto my-3"></div>
              <p className="font-serif italic text-sm text-gray-600 max-w-xl mx-auto">
                Đặt trước vị trí yêu thích tại Blend để trải nghiệm không gian đọc báo yên tĩnh và dịch vụ pha chế độc bản.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Form (7 Cols) */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 border-2 border-[#124874] shadow-[8px_8px_0px_rgba(18,72,116,0.95)]">
                <div className="border-b border-[#124874] pb-3 mb-6">
                  <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider">
                    PHIẾU GHI DANH ĐẶT CHỖ TRỰC TUYẾN
                  </span>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4 font-body">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                        Họ và Tên *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="VD: Nguyễn Hoàng Phúc"
                        value={tableBooking.name}
                        onChange={(e) => setTableBooking({ ...tableBooking, name: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#124874] px-3.5 py-2 font-serif text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                      />
                    </div>

                    <div>
                      <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                        Số Điện Thoại *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="VD: 0901234567"
                        value={tableBooking.phone}
                        onChange={(e) => setTableBooking({ ...tableBooking, phone: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#124874] px-3.5 py-2 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                        Số Khách
                      </label>
                      <select
                        value={tableBooking.guests}
                        onChange={(e) => setTableBooking({ ...tableBooking, guests: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#124874] px-3 py-2 font-serif text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                      >
                        <option value="1">1 Người (Bàn đơn)</option>
                        <option value="2">2 Người (Bàn đôi)</option>
                        <option value="4">4 Người (Bàn nhóm)</option>
                        <option value="6+">6+ Người (Họp mặt)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                        Ngày Đến
                      </label>
                      <input
                        type="date"
                        value={tableBooking.date}
                        onChange={(e) => setTableBooking({ ...tableBooking, date: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#124874] px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                      />
                    </div>

                    <div>
                      <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                        Khung Giờ
                      </label>
                      <input
                        type="time"
                        value={tableBooking.time}
                        onChange={(e) => setTableBooking({ ...tableBooking, time: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#124874] px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                      Khu Vực Ưu Tiên
                    </label>
                    <select
                      value={tableBooking.area}
                      onChange={(e) => setTableBooking({ ...tableBooking, area: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#124874] px-3.5 py-2 font-serif text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    >
                      <option value="Khu vực đọc báo in cổ điển">Khu vực đọc báo in cổ điển</option>
                      <option value="Quầy Barista trực tiếp">Quầy Barista trực tiếp xem pha chế</option>
                      <option value="Sân vườn thoáng mát">Sân vườn thoáng mát ngoài trời</option>
                      <option value="Phòng họp riêng VIP Salon">Phòng họp riêng VIP Salon</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                      Ghi Chú Đặc Biệt (Tùy chọn)
                    </label>
                    <textarea
                      rows="2"
                      placeholder="VD: Cần chuẩn bị bàn yên tĩnh để làm việc, ăn kiêng không sữa bò..."
                      value={tableBooking.note}
                      onChange={(e) => setTableBooking({ ...tableBooking, note: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#124874] p-2.5 font-serif text-xs focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    style={{ backgroundColor: '#124874', color: '#ffffff' }}
                    className="press-btn w-full py-3 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-sm mt-2 flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-calendar-check"></i>
                    <span>XÁC NHẬN GỬI PHIẾU ĐẶT BÀN</span>
                  </button>
                </form>
              </div>

              {/* Right Details (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="bg-[#FCFAF6] p-6 border-2 border-[#124874] shadow-xs space-y-4">
                  <span className="font-cinzel text-xs font-bold text-[#CF373D] uppercase tracking-wider block border-b border-[#D8D1C5] pb-2">
                    ĐẶC QUYỀN KHI ĐẶT TRƯỚC
                  </span>

                  <ul className="space-y-3 font-serif text-xs text-gray-700">
                    <li className="flex items-start gap-2">
                      <i className="fa-solid fa-check text-[#CF373D] mt-0.5"></i>
                      <span>Giữ chỗ tốt nhất trong vòng 20 phút trước giờ hẹn.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fa-solid fa-check text-[#CF373D] mt-0.5"></i>
                      <span>Tặng kèm 1 phần bánh quy bơ nướng tươi dùng kèm trà.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fa-solid fa-check text-[#CF373D] mt-0.5"></i>
                      <span>Ưu tiên thưởng thức các mẻ rang thử nghiệm giới hạn.</span>
                    </li>
                  </ul>
                </div>

                {/* FAQ Accordion */}
                <div className="bg-white p-6 border-2 border-[#124874] shadow-xs space-y-3">
                  <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider block border-b border-[#D8D1C5] pb-2">
                    CÂU HỎI THƯỜNG GẶP (FAQ)
                  </span>

                  <div className="space-y-2">
                    {FAQS.map((faq, idx) => (
                      <div key={idx} className="border border-[#D8D1C5] bg-[#FAF7F2]">
                        <button
                          type="button"
                          onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                          className="w-full p-2.5 text-left font-serif font-bold text-xs text-[#124874] flex justify-between items-center"
                        >
                          <span>{faq.q}</span>
                          <i className={`fa-solid ${activeFaq === idx ? 'fa-minus' : 'fa-plus'} text-[10px] text-[#CF373D]`}></i>
                        </button>
                        {activeFaq === idx && (
                          <div className="p-2.5 pt-0 text-[11px] font-serif text-gray-600 border-t border-[#D8D1C5]/60 bg-white">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* -----------------------------------------------------------------------
            TRANG 6: BÁO GIỚI & GÓC PHÊ BÌNH (PRESS & CRITIQUES)
            ----------------------------------------------------------------------- */}
        {activeTab === 'press' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-12">
            
            <div className="text-center border-b-2 border-[#124874] pb-6">
              <span className="font-cinzel text-xs font-bold text-[#CF373D] tracking-[0.25em] uppercase block mb-1">
                GÓC BÁO GIỚI &bull; PRESS &amp; REVIEWS
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-[#124874] tracking-tight">
                Báo Giới &amp; Giới Mộ Điệu Nói Gì Về Blend
              </h2>
              <div className="h-[2px] bg-[#124874] w-20 mx-auto my-3"></div>
              <p className="font-serif italic text-sm text-gray-600 max-w-xl mx-auto">
                Những bài bình luận và đánh giá từ các ấn phẩm ẩm thực danh tiếng về phong cách thưởng thức tại Blend.
              </p>
            </div>

            {/* Press Articles Cutout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(articlesList.length > 0 ? articlesList : [
                {
                  id: 1,
                  publisher: 'THE SAIGON TIMES',
                  badge: '5.0 ★ EXCELLENT',
                  category: 'Ẩm Thực & Di Sản',
                  author: 'Chuyên mục Ẩm Thực & Di Sản • Số Tháng 06/2025',
                  title: 'Khi Cà Phê Muối Trở Thành Một Biểu Tượng Văn Hóa Mới Giữa Sài Gòn',
                  summary: 'Blend đã định nghĩa lại khái niệm thưởng thức cà phê muối. Không chỉ đơn thuần là đồ uống, đó là sự hòa quyện tinh tế giữa ký ức Sài Gòn xưa và kỹ nghệ pha chế hiện đại.',
                  published_date: 'Tháng 06/2025'
                },
                {
                  id: 2,
                  publisher: 'COFFEE ENTHUSIAST VIETNAM',
                  badge: 'GOLD STANDARD',
                  category: 'Nghệ Thuật Rang',
                  author: 'Nhà Phê Bình Nguyễn Quang Huy • Tạp Chí Barista',
                  title: 'Sự Chuẩn Xác Tuyệt Đối Trong Từng Mẻ Rang Mộc Cầu Đất',
                  summary: 'Rất hiếm nơi nào kiểm soát độ ẩm và quá trình degas hạt cà phê nghiêm ngặt như Blend. Mỗi shot Espresso đều giữ trọn vẹn tầng hương hoa cỏ tự nhiên.',
                  published_date: 'Tháng 07/2025'
                },
                {
                  id: 3,
                  publisher: 'GASTRONOMY GAZETTE',
                  badge: 'MUST-VISIT',
                  category: 'Văn Hóa Sài Gòn',
                  author: 'BTV Trần Mai Lan • Ấn Phẩm Sống Đẹp',
                  title: 'Không Gian Đọc Báo In Và Thưởng Trà Độc Nhất Vô Nhị',
                  summary: 'Bước vào Blend như bước vào một tòa soạn báo in của thập niên trước. Mùi thơm của giấy báo hòa cùng mùi trà Oolong kem phô mai tạo nên một chốn an yên tuyệt đối.',
                  published_date: 'Tháng 08/2025'
                },
                {
                  id: 4,
                  publisher: 'ASIA F&B AWARDS',
                  badge: 'NOMINEE 2026',
                  category: 'Vinh Danh & Giải Thưởng',
                  author: 'Hội Đồng Giám Khảo Asia Culinary Committee',
                  title: 'Top 10 Quán Cà Phê Độc Bản Đáng Trải Nghiệm Nhất Đông Nam Á',
                  summary: 'Được vinh danh nhờ sự kết hợp đột phá giữa di sản nông sản bản địa Việt Nam và hệ thống quản trị công nghệ vận hành chuẩn mực.',
                  published_date: 'Tháng 08/2026'
                }
              ]).map((art) => (
                <div 
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className="bg-white p-7 border-2 border-[#124874] shadow-[6px_6px_0px_rgba(18,72,116,0.95)] space-y-3 relative cursor-pointer hover:border-[#CF373D] hover:-translate-y-1 transition-all group flex flex-col justify-between"
                  title="Nhấp để đọc toàn văn bài báo"
                >
                  <div className="space-y-3">
                    <div className="border-b border-[#124874] pb-2 flex justify-between items-center">
                      <span className="font-cinzel text-xs font-bold text-[#124874]">
                        {art.publisher}
                      </span>
                      {art.badge && (
                        <span className="ink-stamp stamp-jasper text-[8px] font-bold">
                          {art.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#124874] group-hover:text-[#CF373D] transition-colors leading-snug">
                      "{art.title}"
                    </h3>
                    <p className="font-serif text-xs text-gray-700 leading-relaxed italic">
                      "{art.summary}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#D8D1C5]/60 flex justify-between items-center">
                    <span className="font-mono text-[10px] text-gray-500 truncate max-w-[200px]">
                      &mdash; {art.author || art.publisher}
                    </span>
                    <span className="font-cinzel text-[11px] font-bold text-[#CF373D] group-hover:underline flex items-center gap-1">
                      ĐỌC BÀI BÁO <i className="fa-solid fa-arrow-right text-[9px] group-hover:translate-x-1 transition-transform"></i>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Media Kit Contact */}
            <div className="bg-[#FAF7F2] p-8 border-2 border-[#124874] shadow-xs text-center space-y-3">
              <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider block">
                LIÊN HỆ TRUYỀN THÔNG &amp; BÁO CHÍ &bull; MEDIA INQUIRIES
              </span>
              <p className="font-serif text-xs text-gray-600 max-w-lg mx-auto leading-relaxed">
                Tòa soạn Blend hân hạnh đón tiếp các đơn vị báo chí, nhiếp ảnh gia và phóng viên ẩm thực đến trải nghiệm, tác nghiệp và phỏng vấn.
              </p>
              <div className="font-mono text-xs font-bold text-[#CF373D]">
                Email: press@blend-roastery.com &bull; Hotline: (028) 3822 8899
              </div>
            </div>

          </div>
        )}

        {/* -----------------------------------------------------------------------
            TRANG 7: TRANG CÁ NHÂN HỘI VIÊN (PATRON MEMBER PROFILE & LOYALTY)
            ----------------------------------------------------------------------- */}
        {activeTab === 'member' && (
          <MemberProfileView 
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

      </main>

      {/* =========================================================================
          EDITORIAL FOOTER (CỘT BÁO CHÂN TRANG)
          ========================================================================= */}
      <footer className="border-t-4 border-[#124874] bg-[#FCFAF6] pt-12 pb-8 px-4 sm:px-8 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#D8D1C5]">
          
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo.png" 
                alt="Blend Logo" 
                className="w-8 h-8 object-contain drop-shadow-sm" 
              />
              <h4 className="font-display text-2xl font-black text-[#124874]">
                Blend<span className="text-[#CF373D]">.</span>
              </h4>
            </div>
            <p className="font-serif italic text-xs text-gray-600 leading-relaxed">
              Tòa soạn cà phê và không gian ẩm thực giao hòa văn hóa báo chí cổ điển giữa trung tâm Sài Gòn.
            </p>
            <div className="font-cinzel text-[10px] text-gray-500 font-bold">
              ESTABLISHED IN 2024 &bull; SAIGON
            </div>
          </div>

          <div>
            <h5 className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-3">
              ĐỊA ĐIỂM &bull; ADDRESS
            </h5>
            <p className="font-serif text-xs text-gray-700 leading-relaxed">
              Số 88 Đường Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh.
            </p>
            <p className="font-mono text-xs text-[#CF373D] font-bold mt-2">
              Hotline: (028) 3822 8899
            </p>
          </div>

          <div>
            <h5 className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-3">
              GIỜ PHỤC VỤ &bull; HOURS
            </h5>
            <ul className="font-serif text-xs text-gray-700 space-y-1">
              <li>Thứ 2 &mdash; Thứ 6: 06:30 - 22:30</li>
              <li>Thứ 7 &mdash; Chủ Nhật: 07:00 - 23:00</li>
              <li className="italic text-[#CF373D] font-semibold pt-1">Phục vụ xuyên suốt các ngày lễ</li>
            </ul>
          </div>

          <div>
            <h5 className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-3">
              HỆ THỐNG QUẢN TRỊ
            </h5>
            <p className="font-serif text-xs text-gray-600 mb-3">
              Bảng điều khiển vận hành F&amp;B chuyên sâu dành cho Quản lý &amp; Nhân viên pha chế.
            </p>
            {isAuthenticated && user ? (
              user.role && (user.role.toLowerCase() === 'customer' || user.role.toLowerCase().includes('khách') || user.role.toLowerCase().includes('thành viên')) ? (
                <button
                  onClick={() => {
                    setActiveTab('member');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ backgroundColor: '#124874', color: '#ffffff' }}
                  className="press-btn w-full py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#C59B27]"
                >
                  <i className="fa-solid fa-gem text-[#C59B27]"></i>
                  <span>TRANG CÁ NHÂN HỘI VIÊN ({user.name.toUpperCase()})</span>
                </button>
              ) : (
                <button
                  onClick={() => onEnterApp && onEnterApp(user.role)}
                  style={{ backgroundColor: '#124874', color: '#ffffff' }}
                  className="press-btn w-full py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className={`fa-solid ${
                    user.role && user.role.toLowerCase().includes('kho') 
                      ? 'fa-boxes-stacked' 
                      : user.role && (user.role.toLowerCase().includes('quản lý') || user.role.toLowerCase().includes('admin')) 
                      ? 'fa-gauge-high' 
                      : 'fa-mug-hot'
                  }`}></i>
                  <span>
                    {user.role && user.role.toLowerCase().includes('kho')
                      ? 'TRẠM ĐIỀU PHỐI KHO VẬT TƯ'
                      : user.role && (user.role.toLowerCase().includes('quản lý') || user.role.toLowerCase().includes('admin'))
                      ? 'VÀO TRANG QUẢN TRỊ'
                      : `VÀO CA TRỰC (${user.role?.toUpperCase()})`}
                  </span>
                </button>
              )
            ) : (
              <button
                onClick={onOpenAuth || onEnterApp}
                style={{ backgroundColor: '#124874', color: '#ffffff' }}
                className="press-btn w-full py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-key"></i>
                <span>ĐĂNG NHẬP HỆ THỐNG</span>
              </button>
            )}
          </div>

        </div>

        {/* Bottom Colophon */}
        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] font-serif text-gray-500 gap-2">
          <span>&copy; 2026 BLEND ROASTERY PRESS. TẤT CẢ QUYỀN ĐƯỢC BẢO LƯU.</span>
          <div className="flex flex-wrap items-center gap-3 font-cinzel text-[10px] font-bold text-[#124874]">
            <button onClick={() => { setActiveTab('story'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:underline cursor-pointer">CÂU CHUYỆN</button>
            <span>&bull;</span>
            <button onClick={() => { setActiveTab('menu'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:underline cursor-pointer">THỰC ĐƠN</button>
            <span>&bull;</span>
            <button onClick={() => { setActiveTab('booking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:underline cursor-pointer">ĐẶT CHỖ</button>
            <span>&bull;</span>
            <button onClick={() => onNavigateTerms ? onNavigateTerms() : setIsTermsOpen(true)} className="hover:underline cursor-pointer text-[#CF373D]">ĐIỀU KHOẢN DỊCH VỤ</button>
            <span>&bull;</span>
            <button onClick={() => onNavigatePolicy ? onNavigatePolicy() : setIsPolicyOpen(true)} className="hover:underline cursor-pointer text-[#CF373D]">CHÍNH SÁCH HỘI VIÊN</button>
          </div>
        </div>
      </footer>

      {/* Product Gastronomy Dossier Detail Modal */}
      <ProductDetailModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onNavigateToBooking={(prodName) => {
          setActiveTab('booking');
          setTableBooking((prev) => ({
            ...prev,
            note: `Thực khách đặt bàn muốn thưởng thức món: ${prodName}`
          }));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Press Article Full Reader Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onBookingNavigate={() => {
          setActiveTab('booking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Terms of Service & Membership Policy Modals */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      <MembershipPolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
      />

    </div>
  );
};

export default LandingPageView;
