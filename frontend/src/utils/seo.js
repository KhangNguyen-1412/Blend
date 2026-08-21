/**
 * Dynamic SEO & Structured Data Management Utility for Blend Roastery
 */

export const SEO_CONFIG = {
  defaultTitle: 'Blend. — Kỷ Nguyên Cà Phê Mộc & Trà Oolong Báo In Sài Gòn',
  siteName: 'Blend Roastery Gazette Saigon',
  baseUrl: 'https://blend-roastery.vn',
  defaultImage: 'https://blend-roastery.vn/og-image.jpg',
  author: 'Blend Roastery Editorial Board',
  
  pages: {
    home: {
      title: 'Blend. — Kỷ Nguyên Thưởng Thức Cà Phê & Trà Đậm Chất Báo In Cổ Điển',
      description: 'Khám phá Blend Roastery Sài Gòn — Nơi từng giọt Cà phê Muối đậm đà và búp trà Oolong ủ chậm giao hòa cùng văn hóa báo in cổ điển giữa lòng đô thị.',
      keywords: 'cà phê muối sài gòn, trà oolong kem phô mai, specialty coffee saigon, quán cà phê báo in, blend roastery, cà phê cầu đất',
      canonical: '/'
    },
    story: {
      title: 'Câu Chuyện Di Sản & Ký Sự Tòa Soạn 2024–2026 | Blend.',
      description: 'Hành trình khởi sinh của Blend Roastery: Từ mẻ cà phê rang củi đầu tiên tại Đồng Khởi đến nông trại Cầu Đất 1.600m và đồi chè mù sương Bảo Lộc.',
      keywords: 'câu chuyện blend, hành trình cà phê mộc, di sản nông nghiệp việt nam, cà phê cầu đất, trà bảo lộc',
      canonical: '/cau-chuyen'
    },
    menu: {
      title: 'Thực Phổ Báo Chí — Thực Đơn Đặc Tuyển 12 Món Chữ Ký | Blend.',
      description: 'Thực đơn đồ uống & điểm tâm thủ công 100% tự nhiên: Cà phê muối di sản, Cold Brew cam vàng, Trà Oolong Cheese Foam, Matcha Latte Kyoto, Croissant bơ Normandy.',
      keywords: 'thực đơn blend, cà phê muối, cold brew cam vàng, trà đào cam sả, matcha latte yến mạch, tiramisu cà phê muối',
      canonical: '/thuc-don'
    },
    roastery: {
      title: 'Kỹ Nghệ Rang Mộc 4 Giai Đoạn & Khoa Học Chiết Xuất | Blend.',
      description: 'Khám phá quy trình rang mộc 4 giai đoạn từ hạt nhân xanh 1.600m, thời gian degas 14 ngày, đến kỹ nghệ chiết xuất kép Synesso và máy xay Mahlkönig EK43.',
      keywords: 'kỹ thuật rang mộc, máy pha synesso, máy xay mahlkonig ek43, degas cà phê, chiết xuất espresso',
      canonical: '/nghe-thuat-rang'
    },
    booking: {
      title: 'Đặt Chỗ Thưởng Trà & Phòng Khách VIP Salon | Blend.',
      description: 'Giữ trước không gian đọc báo in cổ điển, quầy Barista trực tiếp hoặc phòng họp VIP Salon tại số 88 Đồng Khởi, Quận 1, TP. Hồ Chí Minh.',
      keywords: 'đặt bàn quán cà phê quận 1, không gian yên tĩnh sài gòn, quán cà phê đọc sách, reservation blend',
      canonical: '/dat-cho'
    },
    press: {
      title: 'Báo Giới & Góc Phê Bình Ẩm Thực Danh Tiếng | Blend.',
      description: 'Tổng hợp các bài đánh giá, phóng sự từ The Saigon Times, Coffee Enthusiast, Gastronomy Gazette về phong cách thưởng thức cà phê tại Blend.',
      keywords: 'đánh giá blend roastery, the saigon times cà phê muối, asia f&b awards, phê bình ẩm thực',
      canonical: '/bao-gioi'
    },
    auth: {
      title: 'Đăng Nhập Cổng Quản Trị & Hội Viên | Blend.',
      description: 'Cổng đăng nhập an toàn dành cho Quản lý, Thu ngân, Pha chế và Hội viên thân thiết của Blend Roastery.',
      keywords: 'đăng nhập blend, quản trị f&b, pos cà phê',
      canonical: '/dang-nhap'
    },
    dashboard: {
      title: 'Bảng Điều Khiển Vận Hành Trung Tâm | Blend Admin',
      description: 'Hệ thống quản trị điều phối F&B thời gian thực dành cho Quản trị viên.',
      keywords: 'dashboard blend, quản lý quán cafe',
      canonical: '/quan-tri'
    },
    products: {
      title: 'Quản Lý Thực Đơn & Công Thức Pha Chế | Blend Admin',
      description: 'Quản lý danh mục, biến thể và định lượng món nước.',
      keywords: 'quản lý món ăn, quản lý thực đơn',
      canonical: '/quan-tri/thuc-don'
    },
    orders: {
      title: 'Quản Lý Đơn Hàng & POS Gọi Món | Blend Admin',
      description: 'Sổ điều phối đơn hàng và tiếp nhận order tại quầy.',
      keywords: 'pos gọi món cafe, quản lý đơn hàng',
      canonical: '/quan-tri/don-hang'
    },
    inventory: {
      title: 'Kho Nguyên Liệu & Cảnh Báo Định Lượng | Blend Admin',
      description: 'Quản lý tồn kho hạt nhân xanh, lá trà và nguyên vật liệu.',
      keywords: 'quản lý kho nguyên liệu cafe',
      canonical: '/quan-tri/kho-nguyen-lieu'
    },
    reservations: {
      title: 'Sổ Điều Phối & Quản Lý Đặt Chỗ Thưởng Thức | Blend Admin',
      description: 'Quản lý danh sách đặt bàn, phòng VIP Salon và tiếp nhận yêu cầu từ trang giới thiệu.',
      keywords: 'quản lý đặt bàn, điều phối chỗ ngồi cafe',
      canonical: '/quan-tri/dat-cho'
    }
  }
};

/**
 * Updates browser title, meta description, keywords, canonical, and JSON-LD schema
 */
export const updateSEO = (pageKey) => {
  const page = SEO_CONFIG.pages[pageKey] || SEO_CONFIG.pages.home;
  
  // 1. Update Title
  document.title = page.title;

  // 2. Helper to set or update meta tag
  const setMeta = (name, content, attribute = 'name') => {
    let element = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 3. Set Standard Meta Tags
  setMeta('description', page.description);
  setMeta('keywords', page.keywords || '');
  setMeta('author', SEO_CONFIG.author);
  setMeta('robots', pageKey.startsWith('dashboard') || pageKey.startsWith('admin') ? 'noindex, nofollow' : 'index, follow');

  // 4. OpenGraph Meta Tags
  setMeta('og:title', page.title, 'property');
  setMeta('og:description', page.description, 'property');
  setMeta('og:type', 'website', 'property');
  setMeta('og:site_name', SEO_CONFIG.siteName, 'property');
  setMeta('og:url', `${SEO_CONFIG.baseUrl}${page.canonical}`, 'property');
  setMeta('og:image', SEO_CONFIG.defaultImage, 'property');
  setMeta('og:locale', 'vi_VN', 'property');

  // 5. Twitter Card Meta Tags
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', page.title);
  setMeta('twitter:description', page.description);
  setMeta('twitter:image', SEO_CONFIG.defaultImage);

  // 6. Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', `${SEO_CONFIG.baseUrl}${page.canonical}`);

  // 7. Structured Data (Schema.org JSON-LD)
  updateStructuredData(pageKey);
};

/**
 * Inserts or updates Schema.org JSON-LD Structured Data
 */
const updateStructuredData = (pageKey) => {
  let scriptEl = document.getElementById('blend-schema-jsonld');
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'blend-schema-jsonld';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CoffeeShop',
    'name': 'Blend Roastery & Tea Press',
    'image': 'https://blend-roastery.vn/images/masthead.jpg',
    '@id': 'https://blend-roastery.vn',
    'url': 'https://blend-roastery.vn',
    'telephone': '+842838228899',
    'priceRange': '30.000đ - 65.000đ',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '88 Đồng Khởi, Phường Bến Nghé, Quận 1',
      'addressLocality': 'TP. Hồ Chí Minh',
      'postalCode': '700000',
      'addressCountry': 'VN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 10.7769,
      'longitude': 106.7009
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'opens': '06:30',
        'closes': '22:30'
      },
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Saturday', 'Sunday'],
        'opens': '07:00',
        'closes': '23:00'
      }
    ],
    'servesCuisine': ['Vietnamese Specialty Coffee', 'Organic Oolong Tea', 'French Bakery'],
    'hasMenu': 'https://blend-roastery.vn/thuc-don'
  };

  scriptEl.textContent = JSON.stringify(structuredData);
};
