import React from 'react';

export const MembershipPolicyView = ({ onNavigateBack, onNavigateLanding, onNavigateRegister }) => {
  return (
    <div className="min-h-screen bg-[#F7F4EE] font-body text-[#161413] selection:bg-[#124874] selection:text-white flex flex-col justify-between animate-editorial-in">
      
      {/* Top Gazette Navigation Masthead (Hidden on Print) */}
      <header className="border-b-4 border-[#CF373D] bg-[#FCFAF6] shadow-sm sticky top-0 z-30 no-print">
        
        {/* Newspaper Meta Top Ribbon */}
        <div 
          style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
          className="py-1 px-4 sm:px-8 text-center text-[10px] font-cinzel font-bold tracking-[0.2em] flex justify-between items-center"
        >
          <span>BLEND PATRONS &amp; GUILD &bull; VOL. IV 2026</span>
          <span className="hidden sm:inline">CHÍNH SÁCH ĐẶC QUYỀN &amp; PHÂN HẠNG HỘI VIÊN TRỌN ĐỜI</span>
          <span className="font-mono text-amber-200">NIÊN KHÓA 2026</span>
        </div>

        {/* Header Main Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onNavigateBack || onNavigateLanding}
              className="press-btn px-3 py-1.5 bg-white border border-[#124874] text-[#124874] font-cinzel text-xs font-bold hover:bg-[#124874] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>QUAY LẠI</span>
            </button>

            <div 
              onClick={onNavigateLanding}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <img 
                src="/logo.png" 
                alt="Blend Logo" 
                className="w-9 h-9 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" 
              />
              <h1 className="font-display text-3xl sm:text-4xl font-black text-[#124874] leading-none">
                Blend<span className="text-[#CF373D] font-mono">.</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="press-btn px-3.5 py-1.5 bg-white border border-[#6E675F] text-[#6E675F] font-cinzel text-xs font-bold hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-print"></i>
              <span className="hidden sm:inline">IN VĂN BẢN (A4)</span>
            </button>

            <button
              type="button"
              onClick={onNavigateRegister || onNavigateLanding}
              style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
              className="press-btn px-4 py-1.5 font-cinzel text-xs font-bold hover:bg-[#AB282D] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <i className="fa-solid fa-user-plus"></i>
              <span>ĐĂNG KÝ HỘI VIÊN NGAY</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Broadside Content */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 flex-1">
        
        <article className="editorial-card-press bg-[#FCFAF6] p-6 sm:p-10 md:p-12 border-2 border-[#CF373D] shadow-[8px_8px_0px_rgba(207,55,61,0.95)] space-y-8">
          
          {/* Print-Only Official Letterhead Header */}
          <div className="print-only mb-6 pb-4 border-b-2 border-[#CF373D] text-center space-y-1">
            <div className="text-[10pt] font-cinzel font-bold tracking-[0.2em] uppercase text-[#CF373D]">
              CÂU LẠC BỘ THƯỞNG THỨC &bull; BLEND PATRONS GUILD SAIGON
            </div>
            <div className="font-display text-3xl font-black text-[#124874]">
              CHÍNH SÁCH ĐẶC QUYỀN &amp; PHÂN HẠNG HỘI VIÊN
            </div>
            <div className="text-[9pt] font-serif italic text-gray-700">
              Số 88 Đường Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh &bull; Hotline: (028) 3822 8899
            </div>
            <div className="text-[8pt] font-mono text-gray-500 pt-1">
              QUY CHẾ HỘI VIÊN TRỌN ĐỜI &bull; ÁP DỤNG TRÊN TOÀN HỆ THỐNG POS &bull; NGÀY IN: {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>

          {/* Screen Masthead Banner */}
          <div className="text-center border-b-2 border-[#CF373D] pb-6 space-y-2 screen-only">
            <span className="ink-stamp stamp-jasper text-xs font-bold inline-block mb-1">
              &bull; QUY CHẾ HỘI VIÊN &bull; BLEND PATRONS GUILD &bull;
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#124874] tracking-tight">
              Chính Sách Hội Viên &amp; Bảng Đặc Quyền Tích Lũy
            </h2>
            <p className="font-serif italic text-sm text-gray-600 max-w-2xl mx-auto">
              Chương trình tri ân những tâm hồn đồng điệu, yêu thích cà phê rang mộc và văn hóa đọc báo in với cơ chế tích lũy điểm thưởng và chiết khấu trọn đời.
            </p>
          </div>

          {/* Print-Only Comparison Table (Clean & Ink-Saving for A4 Paper) */}
          <div className="print-only space-y-3">
            <h3 className="font-cinzel text-xs font-bold text-black uppercase tracking-wider">
              BẢNG TỔNG HỢP QUY CHẾ 4 BẬC HẠNG HỘI VIÊN:
            </h3>
            <table className="w-full border-collapse border border-black text-[10pt] font-serif">
              <thead>
                <tr className="bg-gray-100 font-cinzel text-[9pt] font-bold">
                  <th className="border border-black p-2 text-left">HẠNG HỘI VIÊN</th>
                  <th className="border border-black p-2 text-left">ĐIỀU KIỆN TÍCH LŨY</th>
                  <th className="border border-black p-2 text-center">CHIẾT KHẤU</th>
                  <th className="border border-black p-2 text-left">ĐẶC QUYỀN THƯỞNG THỨC &amp; SALON</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2 font-bold text-[#124874]">🥉 HỘI VIÊN ĐỒNG (Bronze)</td>
                  <td className="border border-black p-2">Mặc định khi đăng ký</td>
                  <td className="border border-black p-2 text-center font-bold">1% Tích lũy</td>
                  <td className="border border-black p-2">Bản tin nhật trình &amp; tra cứu điểm thưởng trên app.</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold text-[#124874]">🥈 HỘI VIÊN BẠC (Silver)</td>
                  <td className="border border-black p-2">Từ 1.000.000 VNĐ</td>
                  <td className="border border-black p-2 text-center font-bold text-[#CF373D]">5% Trực tiếp</td>
                  <td className="border border-black p-2">Tặng 01 ly đồ uống miễn phí tuần sinh nhật &amp; ưu tiên thông báo mẻ rang mới.</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold text-amber-900">🥇 HỘI VIÊN VÀNG (Gold)</td>
                  <td className="border border-black p-2">Từ 3.000.000 VNĐ</td>
                  <td className="border border-black p-2 text-center font-bold text-[#CF373D]">10% Trực tiếp</td>
                  <td className="border border-black p-2">Miễn phí nâng size không giới hạn, ưu tiên giữ bàn sảnh báo in &amp; vé Workshop pha chế.</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold text-[#CF373D]">💎 KIM CƯƠNG VIP (Diamond)</td>
                  <td className="border border-black p-2">Từ 8.000.000 VNĐ</td>
                  <td className="border border-black p-2 text-center font-bold text-[#CF373D]">15% Trọn đời</td>
                  <td className="border border-black p-2">Phòng đọc báo VIP Salon riêng tư miễn phí, thử mẻ rang giới hạn &amp; quà tặng nghệ thuật hàng năm.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Screen-Only 4 Membership Tiers Cards */}
          <div className="space-y-4 screen-only">
            <div className="flex items-center justify-between border-b border-[#D8D1C5] pb-2">
              <h3 className="font-cinzel text-sm font-bold text-[#124874] uppercase tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-crown text-[#CF373D]"></i>
                <span>BẢNG 4 BẬC HẠNG HỘI VIÊN &amp; CHIẾT KHẤU TRỌN ĐỜI</span>
              </h3>
              <span className="font-mono text-xs text-gray-500">TỰ ĐỘNG NÂNG HẠNG</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Bronze Member */}
              <div className="editorial-card-press p-5 bg-white border-2 border-[#D8D1C5] shadow-xs space-y-3">
                <div className="flex justify-between items-start border-b border-gray-200 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-lg shadow-xs">
                      🥉
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#124874]">HỘI VIÊN ĐỒNG</h4>
                      <span className="font-cinzel text-[10px] text-gray-500 font-bold uppercase">BRONZE PATRON</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 font-mono text-xs font-bold">
                    Mặc định khi đăng ký
                  </span>
                </div>

                <ul className="space-y-2 font-serif text-xs text-gray-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i>
                    <span>Tích lũy <strong>1% tổng giá trị hóa đơn</strong> thành điểm thưởng.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i>
                    <span>Nhận bản tin nhật trình văn hóa và bài viết phê bình cà phê định kỳ.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i>
                    <span>Tra cứu lịch sử đặt bàn và theo dõi điểm thưởng trên ứng dụng.</span>
                  </li>
                </ul>
              </div>

              {/* Silver Member */}
              <div className="editorial-card-press p-5 bg-white border-2 border-slate-400 shadow-xs space-y-3">
                <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-slate-500 text-white font-bold flex items-center justify-center text-lg shadow-xs">
                      🥈
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#124874]">HỘI VIÊN BẠC</h4>
                      <span className="font-cinzel text-[10px] text-slate-700 font-bold uppercase">SILVER PATRON</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-300 font-mono text-xs font-bold">
                    Chi tiêu từ 1.000.000đ
                  </span>
                </div>

                <ul className="space-y-2 font-serif text-xs text-gray-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i>
                    <span><strong>Giảm giá trực tiếp 5%</strong> trên mọi hóa đơn tại quầy.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i>
                    <span>Tặng <strong>01 ly đồ uống miễn phí</strong> trong tuần lễ sinh nhật.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i>
                    <span>Ưu tiên thông báo khi có các mẻ rang thử nghiệm hạt mới.</span>
                  </li>
                </ul>
              </div>

              {/* Gold Member */}
              <div className="editorial-card-press p-5 bg-amber-50/50 border-2 border-amber-500 shadow-xs space-y-3">
                <div className="flex justify-between items-start border-b border-amber-200 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-lg shadow-xs">
                      🥇
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-amber-900">HỘI VIÊN VÀNG</h4>
                      <span className="font-cinzel text-[10px] text-amber-700 font-bold uppercase">GOLD PATRON</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-400 font-mono text-xs font-bold">
                    Chi tiêu từ 3.000.000đ
                  </span>
                </div>

                <ul className="space-y-2 font-serif text-xs text-gray-800 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i>
                    <span><strong>Giảm giá trực tiếp 10%</strong> trên mọi hóa đơn thanh toán.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i>
                    <span><strong>Miễn phí nâng Size đồ uống (Up-size)</strong> không giới hạn lần dùng.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i>
                    <span>Ưu tiên xếp bàn đẹp tại sảnh đọc báo in và sân vườn di sản.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i>
                    <span>Vé mời tham gia Workshop kỹ thuật chiết xuất cùng Master Barista.</span>
                  </li>
                </ul>
              </div>

              {/* Diamond VIP Patron */}
              <div className="editorial-card-press p-5 bg-red-50/50 border-2 border-[#CF373D] shadow-xs space-y-3">
                <div className="flex justify-between items-start border-b border-red-200 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-[#CF373D] text-white font-bold flex items-center justify-center text-lg shadow-xs">
                      💎
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#CF373D]">KIM CƯƠNG VIP</h4>
                      <span className="font-cinzel text-[10px] text-[#CF373D] font-bold uppercase">DIAMOND GUILD MASTER</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-red-100 text-[#CF373D] border border-red-400 font-mono text-xs font-bold">
                    Chi tiêu từ 8.000.000đ
                  </span>
                </div>

                <ul className="space-y-2 font-serif text-xs text-gray-800 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i>
                    <span><strong>Giảm giá 15% trọn đời</strong> trên toàn bộ thực đơn và nông sản.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i>
                    <span><strong>Sử dụng Phòng Đọc Báo VIP Salon riêng tư</strong> không phụ thu.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i>
                    <span>Trải nghiệm miễn phí các mẻ rang thử nghiệm giới hạn độc quyền.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-600 mt-0.5"></i>
                    <span>Quà tặng tri ân thường niên: Hộp quà cà phê nghệ thuật thiết kế riêng.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Point Accumulation & Redemption Rules */}
          <div className="space-y-3 pt-4 border-t border-[#D8D1C5] print-avoid-break">
            <div className="flex items-center gap-2 border-b border-[#D8D1C5] pb-1.5">
              <span className="w-6 h-6 bg-[#124874] text-white font-mono text-xs font-bold flex items-center justify-center">★</span>
              <h3 className="font-cinzel text-sm font-bold text-[#124874] uppercase tracking-wider">
                QUY CHẾ TÍCH LŨY ĐIỂM &amp; ĐỔI THƯỞNG
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-serif text-gray-800">
              <div className="p-3 bg-white border border-[#D8D1C5] space-y-1">
                <strong className="font-cinzel text-[11px] text-[#124874] uppercase block">1. TỶ LỆ TÍCH ĐIỂM</strong>
                <p className="leading-relaxed">Mỗi <strong>1.000 VNĐ</strong> chi tiêu = <strong>1 Điểm tích lũy</strong>. Điểm tự động cộng vào tài khoản sau khi hóa đơn hoàn tất.</p>
              </div>

              <div className="p-3 bg-white border border-[#D8D1C5] space-y-1">
                <strong className="font-cinzel text-[11px] text-[#124874] uppercase block">2. THỜI HẠN BẢO LƯU</strong>
                <p className="leading-relaxed">Điểm tích lũy và thứ hạng có giá trị <strong>vĩnh viễn</strong> nếu phát sinh ít nhất 01 đơn hàng trong vòng 12 tháng.</p>
              </div>

              <div className="p-3 bg-white border border-[#D8D1C5] space-y-1">
                <strong className="font-cinzel text-[11px] text-[#124874] uppercase block">3. ÁP DỤNG TẠI QUẦY</strong>
                <p className="leading-relaxed">Chỉ cần đọc Số Điện Thoại hoặc quét mã QR thẻ hội viên trên ứng dụng di động để hưởng ngay ưu đãi.</p>
              </div>
            </div>
          </div>

          {/* Colophon Stamp & Signature Box for Print & Screen */}
          <div className="pt-6 border-t-2 border-[#CF373D] grid grid-cols-2 gap-6 items-center print-avoid-break">
            <div className="p-3 bg-white border border-[#CF373D] text-center space-y-1">
              <span className="font-cinzel text-[10px] font-bold text-[#CF373D] uppercase block">
                CHỨNG NHẬN CÂU LẠC BỘ HỘI VIÊN
              </span>
              <div className="ink-stamp stamp-jasper text-[11px] font-bold inline-block my-1">
                &bull; HỘI ĐỒNG BLEND PATRONS &bull;
              </div>
              <p className="font-serif italic text-[10px] text-gray-500">
                Hiệu lực áp dụng trên toàn bộ chuỗi Blend
              </p>
            </div>

            <div className="p-3 bg-white border border-[#124874] text-center space-y-1">
              <span className="font-cinzel text-[10px] font-bold text-[#124874] uppercase block">
                ĐẠI DIỆN HỘI QUÁN &amp; QUẢN TRỊ
              </span>
              <span className="font-display italic text-xl text-[#124874] block my-1">
                Nguyễn Huỳnh Phúc Khang
              </span>
              <p className="font-mono text-[9px] text-gray-500 uppercase">
                CHỦ NHIỆM BLEND PATRONS GUILD
              </p>
            </div>
          </div>

          {/* Bottom Action Navigation (Hidden on Print) */}
          <div className="pt-4 border-t-2 border-[#CF373D] flex flex-wrap justify-between items-center gap-3 no-print">
            <button
              type="button"
              onClick={onNavigateBack || onNavigateLanding}
              className="press-btn px-4 py-2 bg-white border border-[#124874] text-[#124874] font-cinzel text-xs font-bold hover:bg-[#124874] hover:text-white transition-colors cursor-pointer"
            >
              &larr; QUAY LẠI TRANG TRƯỚC
            </button>

            <button
              type="button"
              onClick={onNavigateRegister || onNavigateLanding}
              style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
              className="press-btn px-6 py-2.5 font-cinzel text-xs font-bold hover:bg-[#AB282D] transition-colors cursor-pointer shadow-xs"
            >
              GIA NHẬP HỘI VIÊN BLEND NGAY &rarr;
            </button>
          </div>

        </article>

      </main>

      {/* Footer Colophon (Hidden on Print) */}
      <footer className="border-t-2 border-[#CF373D] bg-[#FAF7F2] py-4 text-center text-xs font-serif text-gray-500 no-print">
        <span>&copy; 2026 BLEND ROASTERY PRESS &bull; CÂU LẠC BỘ HỘI VIÊN SÀI GÒN &bull; TẤT CẢ QUYỀN ĐƯỢC BẢO LƯU</span>
      </footer>

      {/* Print-Only Page Bottom Colophon */}
      <div className="print-only text-center text-[9pt] font-serif italic text-gray-500 pt-4 border-t border-gray-400">
        Bản quy chế in từ Hệ thống Quản trị Khách hàng &amp; POS Blend Roastery &bull; Bản quyền thuộc về Blend Coffee &amp; Tea 2026.
      </div>

    </div>
  );
};

export default MembershipPolicyView;
