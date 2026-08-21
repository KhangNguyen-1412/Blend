import React from 'react';
import Modal from './Modal';

export const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ĐIỀU KHOẢN DỊCH VỤ &bull; TERMS OF SERVICE"
    >
      <div className="space-y-6 font-body text-brand-dark max-h-[75vh] overflow-y-auto pr-2">
        
        {/* Masthead Banner */}
        <div className="p-4 bg-[#FAF7F2] border-2 border-[#124874] text-center space-y-1">
          <span className="font-cinzel text-[10px] uppercase font-bold text-[#CF373D] tracking-widest block">
            QUY CHẾ VẬN HÀNH CHÍNH THỨC &bull; NIÊN KHÓA 2026
          </span>
          <h3 className="font-display text-xl font-bold text-[#124874]">
            Điều Khoản Dịch Vụ Blend Roastery &amp; Tea
          </h3>
          <p className="font-serif italic text-xs text-gray-600">
            Áp dụng cho toàn bộ khách hàng thưởng thức tại quán, đặt chỗ trực tuyến và hội viên thân thiết.
          </p>
        </div>

        {/* Section 1 */}
        <div className="space-y-2 border-b border-[#D8D1C5] pb-4">
          <h4 className="font-cinzel font-bold text-xs text-[#124874] uppercase flex items-center gap-2">
            <span className="w-5 h-5 bg-[#124874] text-white flex items-center justify-center text-[10px] font-mono font-bold">1</span>
            <span>PHẠM VI ÁP DỤNG &amp; MÔ TẢ DỊCH VỤ</span>
          </h4>
          <p className="font-serif text-xs text-gray-700 leading-relaxed text-justify">
            Quy chế này điều chỉnh các hoạt động thưởng thức đồ uống, sử dụng không gian đọc báo in nghệ thuật, đặt chỗ trải nghiệm (Reservation Lounge) và mua sắm nông sản cà phê/trà đóng gói trực tiếp tại hệ thống <strong>Blend Roastery</strong> hoặc thông qua nền tảng kỹ thuật số của chúng tôi. Bằng việc đăng ký tài khoản hoặc sử dụng dịch vụ, quý khách đồng ý tuân thủ toàn bộ các điều khoản này.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-2 border-b border-[#D8D1C5] pb-4">
          <h4 className="font-cinzel font-bold text-xs text-[#124874] uppercase flex items-center gap-2">
            <span className="w-5 h-5 bg-[#124874] text-white flex items-center justify-center text-[10px] font-mono font-bold">2</span>
            <span>QUY ĐỊNH ĐẶT CHỖ &amp; GIỮ BÀN (RESERVATIONS)</span>
          </h4>
          <div className="space-y-1.5 font-serif text-xs text-gray-700 leading-relaxed">
            <p><strong>&bull; Thời gian giữ bàn:</strong> Bàn đặt trước sẽ được giữ tối đa <strong>15 phút</strong> so với khung giờ đã xác nhận. Sau thời gian này nếu quý khách chưa đến và không có thông báo trước, hệ thống có quyền chuyển bàn cho khách đang chờ.</p>
            <p><strong>&bull; Thay đổi hoặc hủy lịch:</strong> Vui lòng thông báo thay đổi thời gian hoặc hủy bàn trước ít nhất <strong>02 tiếng</strong> qua Hotline 0908.123.456 hoặc tính năng Quản lý đặt chỗ trên website.</p>
            <p><strong>&bull; Không gian VIP Salon:</strong> Nhóm trên 6 người hoặc đặt phòng họp riêng có thể được yêu cầu xác nhận đặt cọc theo chính sách sự kiện.</p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="space-y-2 border-b border-[#D8D1C5] pb-4">
          <h4 className="font-cinzel font-bold text-xs text-[#124874] uppercase flex items-center gap-2">
            <span className="w-5 h-5 bg-[#124874] text-white flex items-center justify-center text-[10px] font-mono font-bold">3</span>
            <span>CHẤT LƯỢNG ĐỒ UỐNG &amp; CHÍNH SÁCH ĐỔI TRẢ</span>
          </h4>
          <div className="space-y-1.5 font-serif text-xs text-gray-700 leading-relaxed">
            <p><strong>&bull; Cam kết chất lượng:</strong> 100% hạt cà phê Robusta &amp; Arabica được tuyển chọn từ vùng nguyên liệu Cầu Đất (Đà Lạt), rang mộc nguyên chất và pha chế tươi theo tiêu chuẩn Specialty Coffee.</p>
            <p><strong>&bull; Đổi trả ly mới:</strong> Nếu đồ uống phục vụ không đúng yêu cầu (sai mức đường/đá/topping) hoặc hương vị không đạt chuẩn, quý khách có quyền yêu cầu Barista pha lại một ly mới hoàn toàn miễn phí hoặc đổi sang món đồ uống tương đương.</p>
          </div>
        </div>

        {/* Section 4 */}
        <div className="space-y-2 border-b border-[#D8D1C5] pb-4">
          <h4 className="font-cinzel font-bold text-xs text-[#124874] uppercase flex items-center gap-2">
            <span className="w-5 h-5 bg-[#124874] text-white flex items-center justify-center text-[10px] font-mono font-bold">4</span>
            <span>VĂN HÓA KHÔNG GIAN BÁO IN &amp; TRÁCH NHIỆM CHUNG</span>
          </h4>
          <div className="space-y-1.5 font-serif text-xs text-gray-700 leading-relaxed">
            <p><strong>&bull; Bảo quản ấn phẩm:</strong> Quý khách được tự do đọc các bản nhật trình, tạp chí và tư liệu báo chí cổ điển tại quán. Vui lòng giữ gìn cẩn thận và hoàn trả về kệ sau khi đọc.</p>
            <p><strong>&bull; Không gian yên tĩnh:</strong> Để bảo đảm trải nghiệm thưởng thức cho tất cả mọi người, vui lòng điều chỉnh âm lượng thiết bị điện tử ở mức vừa phải và sử dụng tai nghe khi nghe nhạc hoặc họp trực tuyến.</p>
          </div>
        </div>

        {/* Section 5 */}
        <div className="space-y-2 border-b border-[#D8D1C5] pb-4">
          <h4 className="font-cinzel font-bold text-xs text-[#124874] uppercase flex items-center gap-2">
            <span className="w-5 h-5 bg-[#124874] text-white flex items-center justify-center text-[10px] font-mono font-bold">5</span>
            <span>BẢO MẬT THÔNG TIN &amp; QUYỀN RIÊNG TƯ</span>
          </h4>
          <p className="font-serif text-xs text-gray-700 leading-relaxed text-justify">
            Blend Roastery cam kết bảo mật tuyệt đối thông tin cá nhân (Họ tên, SĐT, Email, Lịch sử tích điểm) của quý khách theo quy định pháp luật. Thông tin chỉ được sử dụng cho mục đích chăm sóc hội viên, xác thực đơn hàng và gửi các ấn phẩm văn hóa định kỳ. Chúng tôi cam kết <strong>không bao giờ chia sẻ hoặc bán dữ liệu</strong> cho bất kỳ bên thứ ba nào.
          </p>
        </div>

        {/* Colophon Stamp */}
        <div className="p-3 bg-white border border-[#124874] text-center space-y-1 font-serif text-xs">
          <div className="ink-stamp stamp-cerulean text-[9px] font-bold inline-block mb-1">
            &bull; BAN PHÁP CHẾ &amp; VẬN HÀNH BLEND ROASTERY &bull;
          </div>
          <p className="italic text-gray-500 text-[11px]">
            Văn bản có hiệu lực từ ngày 01 tháng 01 năm 2026 trên toàn hệ thống Blend Roastery Saigon.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            style={{ backgroundColor: '#124874', color: '#ffffff' }}
            className="press-btn px-6 py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-sm cursor-pointer"
          >
            TÔI ĐÃ ĐỌC &amp; HIỂU RÕ ĐIỀU KHOẢN
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default TermsModal;
