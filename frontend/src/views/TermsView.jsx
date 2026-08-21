import React from 'react';

export const TermsView = ({ onNavigateBack, onNavigateLanding, onNavigateRegister }) => {
  return (
    <div className="min-h-screen bg-[#F7F4EE] font-body text-[#161413] selection:bg-[#CF373D] selection:text-white flex flex-col justify-between animate-editorial-in">
      
      {/* Top Gazette Navigation Masthead (Hidden on Print) */}
      <header className="border-b-4 border-[#124874] bg-[#FCFAF6] shadow-sm sticky top-0 z-30 no-print">
        
        {/* Newspaper Meta Top Ribbon */}
        <div 
          style={{ backgroundColor: '#124874', color: '#ffffff' }}
          className="py-1 px-4 sm:px-8 text-center text-[10px] font-cinzel font-bold tracking-[0.2em] flex justify-between items-center"
        >
          <span>SAIGON PRESS ARCHIVE &bull; VOL. IV NO. 88</span>
          <span className="hidden sm:inline">QUY CHẾ VẬN HÀNH &amp; PHÁP LÝ TÒA SOẠN &bull; NIÊN KHÓA 2026</span>
          <span className="font-mono">BẢN CHÍNH THỨC</span>
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
              <span>ĐĂNG KÝ HỘI VIÊN</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Broadside Content */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 flex-1">
        
        <article className="editorial-card-press bg-[#FCFAF6] p-6 sm:p-10 md:p-12 border-2 border-[#124874] shadow-[8px_8px_0px_rgba(18,72,116,0.95)] space-y-6">
          
          {/* Print-Only Official Letterhead Header */}
          <div className="print-only mb-6 pb-4 border-b-2 border-[#124874] text-center space-y-1">
            <div className="text-[10pt] font-cinzel font-bold tracking-[0.2em] uppercase text-[#124874]">
              TÒA SOẠN CÀ PHÊ &amp; KHÔNG GIAN BÁO IN BLEND ROASTERY SAIGON
            </div>
            <div className="font-display text-3xl font-black text-[#124874]">
              BLEND COFFEE &amp; TEA CHRONICLE
            </div>
            <div className="text-[9pt] font-serif italic text-gray-700">
              Số 88 Đường Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh &bull; Hotline: (028) 3822 8899
            </div>
            <div className="text-[8pt] font-mono text-gray-500 pt-1">
              VĂN BẢN QUY CHẾ LƯU HÀNH CHÍNH THỨC &bull; MÃ SỐ: 01/2026/QĐ-BLEND &bull; NGÀY IN: {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>

          {/* Screen Masthead Banner */}
          <div className="text-center border-b-2 border-[#124874] pb-6 space-y-2 screen-only">
            <span className="ink-stamp stamp-jasper text-xs font-bold inline-block mb-1">
              &bull; VĂN BẢN PHÁP QUY SỐ 01/2026/QĐ-BLEND &bull;
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#124874] tracking-tight">
              Điều Khoản Dịch Vụ &amp; Quy Chế Vận Hành
            </h2>
            <p className="font-serif italic text-sm text-gray-600 max-w-xl mx-auto">
              Quy chế chính thức về việc trải nghiệm không gian báo in, thưởng thức ẩm thực cà phê specialty, đặt bàn Salon và mua sắm tại Blend Roastery Saigon.
            </p>
            <div className="text-[11px] font-mono text-gray-500 pt-1">
              NGÀY BAN HÀNH: 01/01/2026 &bull; TÒA SOẠN BLEND &bull; 88 ĐỒNG KHỞI, Q.1, TP.HCM
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-2.5 print-avoid-break">
            <div className="flex items-center gap-2 border-b border-[#D8D1C5] pb-1.5">
              <span className="w-6 h-6 bg-[#124874] text-white font-mono text-xs font-bold flex items-center justify-center">I</span>
              <h3 className="font-cinzel text-sm font-bold text-[#124874] uppercase tracking-wider">
                PHẠM VI ÁP DỤNG &amp; ĐỊNH NGHĨA DỊCH VỤ
              </h3>
            </div>
            <p className="font-serif text-sm text-gray-800 leading-relaxed text-justify">
              1.1. Bản Điều khoản dịch vụ này (sau đây gọi tắt là <strong>"Quy chế"</strong>) quy định quyền và nghĩa vụ giữa <strong>Blend Roastery &amp; Tea</strong> (sau đây gọi là <strong>"Tòa soạn Blend"</strong> hoặc <strong>"Chúng tôi"</strong>) và mọi quý khách hàng thưởng thức tại quán, khách hàng đặt chỗ trước, hội viên tích lũy và người sử dụng các nền tảng kỹ thuật số của Blend.
            </p>
            <p className="font-serif text-sm text-gray-800 leading-relaxed text-justify">
              1.2. Bằng việc bước chân vào không gian quán, đăng ký tài khoản hội viên hoặc xác nhận bất kỳ phiếu đặt chỗ nào, quý khách xác nhận đã đọc, hiểu và hoàn toàn đồng ý tuân thủ các quy định tại văn bản này.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2.5 print-avoid-break">
            <div className="flex items-center gap-2 border-b border-[#D8D1C5] pb-1.5">
              <span className="w-6 h-6 bg-[#124874] text-white font-mono text-xs font-bold flex items-center justify-center">II</span>
              <h3 className="font-cinzel text-sm font-bold text-[#124874] uppercase tracking-wider">
                QUY CHẾ ĐẶT CHỖ THƯỞNG THỨC &amp; PHÒNG VIP SALON
              </h3>
            </div>
            <div className="space-y-2 font-serif text-sm text-gray-800 leading-relaxed">
              <p>
                <strong>2.1. Thời gian giữ bàn:</strong> Bàn đặt trước qua website hoặc hotline sẽ được hệ thống và nhân viên lễ tân bảo lưu tối đa <strong>15 phút</strong> so với khung giờ hẹn. Nếu quá thời gian trên mà quý khách chưa có mặt và không có thông báo gia hạn, hệ thống sẽ tự động giải phóng bàn cho thực khách vãng lai.
              </p>
              <p>
                <strong>2.2. Thông báo thay đổi hoặc hủy bàn:</strong> Quý khách vui lòng liên hệ trước ít nhất <strong>02 tiếng</strong> so với giờ hẹn để đội ngũ chuẩn bị nguyên liệu và điều phối nhân sự tốt nhất.
              </p>
              <p>
                <strong>2.3. Phòng họp riêng VIP Salon:</strong> Nhóm tiệc từ 6 người trở lên hoặc các buổi đàm phán riêng tư tại VIP Salon sẽ được phục vụ set trà/cà phê chuyên biệt và có thể áp dụng chính sách đặt cọc theo quy chuẩn sự kiện.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-2.5 print-avoid-break">
            <div className="flex items-center gap-2 border-b border-[#D8D1C5] pb-1.5">
              <span className="w-6 h-6 bg-[#124874] text-white font-mono text-xs font-bold flex items-center justify-center">III</span>
              <h3 className="font-cinzel text-sm font-bold text-[#124874] uppercase tracking-wider">
                TIÊU CHUẨN CHẤT LƯỢNG ĐỒ UỐNG &amp; CAM KẾT ĐỔI TRẢ
              </h3>
            </div>
            <div className="space-y-2 font-serif text-sm text-gray-800 leading-relaxed">
              <p>
                <strong>3.1. Nguồn gốc nguyên liệu:</strong> 100% hạt cà phê Robusta Honey và Arabica Typica của Blend được canh tác bền vững tại Cầu Đất (Đà Lạt) và rang mộc nguyên chất, không sử dụng hóa chất tẩm ướp.
              </p>
              <p>
                <strong>3.2. Cam kết đổi ly mới:</strong> Nếu đồ uống phục vụ không đúng mức đường, đá, loại sữa hoặc có bất kỳ sai lệch nào về hương vị so với tiêu chuẩn, quý khách có quyền yêu cầu Barista <strong>pha lại một ly mới hoàn toàn miễn phí</strong>.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-2.5 print-avoid-break">
            <div className="flex items-center gap-2 border-b border-[#D8D1C5] pb-1.5">
              <span className="w-6 h-6 bg-[#124874] text-white font-mono text-xs font-bold flex items-center justify-center">IV</span>
              <h3 className="font-cinzel text-sm font-bold text-[#124874] uppercase tracking-wider">
                VĂN HÓA KHÔNG GIAN BÁO IN &amp; TRÁCH NHIỆM CHUNG
              </h3>
            </div>
            <div className="space-y-2 font-serif text-sm text-gray-800 leading-relaxed">
              <p>
                <strong>4.1. Tôn trọng tư liệu báo chí:</strong> Các ấn bản nhật trình, tạp chí văn nghệ và tư liệu lịch sử được trưng bày tự do phục vụ quý khách đọc tại chỗ. Vui lòng nâng niu, không làm rách hay vấy bẩn và gửi lại vị trí cũ sau khi đọc.
              </p>
              <p>
                <strong>4.2. Không gian tĩnh lặng:</strong> Blend là không gian kết hợp giữa cà phê và văn hóa đọc, vui lòng hạn chế nói chuyện quá lớn hoặc bật loa ngoài thiết bị điện tử.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-2.5 print-avoid-break">
            <div className="flex items-center gap-2 border-b border-[#D8D1C5] pb-1.5">
              <span className="w-6 h-6 bg-[#124874] text-white font-mono text-xs font-bold flex items-center justify-center">V</span>
              <h3 className="font-cinzel text-sm font-bold text-[#124874] uppercase tracking-wider">
                BẢO VỆ DỮ LIỆU CÁ NHÂN &amp; QUYỀN RIÊNG TƯ
              </h3>
            </div>
            <p className="font-serif text-sm text-gray-800 leading-relaxed text-justify">
              Blend cam kết bảo mật tuyệt đối thông tin định danh (Họ tên, SĐT, Email, Lịch sử tích điểm) của quý khách trên hạ tầng máy chủ nội bộ mã hóa an toàn. Chúng tôi cam kết <strong>không cung cấp, trao đổi hoặc bán thông tin cho bất kỳ bên thứ ba nào</strong> vì mục đích thương mại.
            </p>
          </section>

          {/* Colophon Stamp & Signature Box */}
          <div className="pt-6 border-t-2 border-[#124874] grid grid-cols-2 gap-6 items-center print-avoid-break">
            <div className="p-3 bg-white border border-[#124874] text-center space-y-1">
              <span className="font-cinzel text-[10px] font-bold text-[#124874] uppercase block">
                CON DẤU PHÊ DUYỆT TÒA SOẠN
              </span>
              <div className="ink-stamp stamp-jasper text-[11px] font-bold inline-block my-1">
                &bull; BAN PHÁP CHẾ BLEND ROASTERY &bull;
              </div>
              <p className="font-serif italic text-[10px] text-gray-500">
                Chứng thực có hiệu lực từ ngày 01/01/2026
              </p>
            </div>

            <div className="p-3 bg-white border border-[#124874] text-center space-y-1">
              <span className="font-cinzel text-[10px] font-bold text-[#124874] uppercase block">
                ĐẠI DIỆN BAN QUẢN TRỊ &amp; CHỦ BIÊN
              </span>
              <span className="font-display italic text-xl text-[#124874] block my-1">
                Nguyễn Huỳnh Phúc Khang
              </span>
              <p className="font-mono text-[9px] text-gray-500 uppercase">
                TỔNG QUẢN LÝ HỆ THỐNG BLEND SAIGON
              </p>
            </div>
          </div>

          {/* Bottom Action Nav (Hidden on Print) */}
          <div className="pt-4 border-t border-[#D8D1C5] flex flex-wrap justify-between items-center gap-3 no-print">
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
              className="press-btn px-6 py-2 font-cinzel text-xs font-bold hover:bg-[#AB282D] transition-colors cursor-pointer shadow-xs"
            >
              ĐỒNG Ý &amp; ĐĂNG KÝ HỘI VIÊN &rarr;
            </button>
          </div>

        </article>

      </main>

      {/* Footer Colophon */}
      <footer className="border-t-2 border-[#124874] bg-[#FAF7F2] py-4 text-center text-xs font-serif text-gray-500 no-print">
        <span>&copy; 2026 BLEND ROASTERY PRESS &bull; TÒA SOẠN CÀ PHÊ SÀI GÒN &bull; TẤT CẢ QUYỀN ĐƯỢC BẢO LƯU</span>
      </footer>

      {/* Print-Only Page Bottom Colophon */}
      <div className="print-only text-center text-[9pt] font-serif italic text-gray-500 pt-4 border-t border-gray-400">
        Ấn bản được in trực tiếp từ Hệ thống Quản trị Blend Roastery Saigon &bull; Bản quyền thuộc về Blend Coffee &amp; Tea 2026.
      </div>

    </div>
  );
};

export default TermsView;
