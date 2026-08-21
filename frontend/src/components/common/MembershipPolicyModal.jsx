import React from 'react';
import Modal from './Modal';

export const MembershipPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CHÍNH SÁCH HỘI VIÊN &bull; MEMBERSHIP POLICY"
    >
      <div className="space-y-6 font-body text-brand-dark max-h-[75vh] overflow-y-auto pr-2">
        
        {/* Masthead Banner */}
        <div className="p-4 bg-[#FAF7F2] border-2 border-[#124874] text-center space-y-1">
          <span className="font-cinzel text-[10px] uppercase font-bold text-[#CF373D] tracking-widest block">
            CÂU LẠC BỘ THƯỞNG THỨC &bull; BLEND PATRONS GUILD
          </span>
          <h3 className="font-display text-xl font-bold text-[#124874]">
            Chính Sách Đặc Quyền &amp; Tích Lũy Hội Viên
          </h3>
          <p className="font-serif italic text-xs text-gray-600">
            Chính sách tích điểm trọn đời, chiết khấu trực tiếp và đặc quyền trải nghiệm không gian nghệ thuật.
          </p>
        </div>

        {/* 4 Membership Tiers Cards */}
        <div className="space-y-3">
          <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider block border-b border-[#124874] pb-1">
            BẢNG PHÂN HẠNG HỘI VIÊN &amp; ĐẶC QUYỀN TRỌN ĐỜI:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            {/* Bronze */}
            <div className="p-3.5 bg-white border-2 border-[#D8D1C5] space-y-2 shadow-2xs">
              <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-xs">
                    🥉
                  </span>
                  <strong className="font-serif text-sm text-[#124874]">HỘI VIÊN ĐỒNG</strong>
                </div>
                <span className="font-mono text-[10px] text-gray-500 font-bold">Mặc định</span>
              </div>
              <ul className="space-y-1 font-serif text-gray-700 text-[11px]">
                <li>&bull; Điều kiện: Tự động kích hoạt khi đăng ký tài khoản.</li>
                <li>&bull; Tích lũy <strong>1% giá trị mọi hóa đơn</strong> vào điểm thưởng.</li>
                <li>&bull; Nhận bản tin văn hóa &amp; nhật trình cà phê sáng sớm.</li>
              </ul>
            </div>

            {/* Silver */}
            <div className="p-3.5 bg-[#FAF7F2] border-2 border-slate-400 space-y-2 shadow-2xs">
              <div className="flex justify-between items-center border-b border-slate-300 pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-400 text-white font-bold flex items-center justify-center text-xs">
                    🥈
                  </span>
                  <strong className="font-serif text-sm text-[#124874]">HỘI VIÊN BẠC</strong>
                </div>
                <span className="font-mono text-[10px] text-slate-700 font-bold">Từ 1.000.000đ</span>
              </div>
              <ul className="space-y-1 font-serif text-gray-700 text-[11px]">
                <li>&bull; <strong>Giảm 5% trực tiếp</strong> trên mọi hóa đơn tại quầy.</li>
                <li>&bull; Tặng <strong>01 ly đồ uống miễn phí</strong> trong tuần lễ sinh nhật.</li>
                <li>&bull; Ưu tiên thông báo khi có các loại hạt rang mẻ mới.</li>
              </ul>
            </div>

            {/* Gold */}
            <div className="p-3.5 bg-amber-50/70 border-2 border-amber-500 space-y-2 shadow-2xs">
              <div className="flex justify-between items-center border-b border-amber-300 pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs">
                    🥇
                  </span>
                  <strong className="font-serif text-sm text-amber-900">HỘI VIÊN VÀNG</strong>
                </div>
                <span className="font-mono text-[10px] text-amber-800 font-bold">Từ 3.000.000đ</span>
              </div>
              <ul className="space-y-1 font-serif text-gray-700 text-[11px]">
                <li>&bull; <strong>Giảm 10% trực tiếp</strong> trên mọi hóa đơn thanh toán.</li>
                <li>&bull; Miễn phí <strong>nâng Size đồ uống (Up-size)</strong> không giới hạn.</li>
                <li>&bull; Ưu tiên giữ vị trí bàn đẹp nhất tại sảnh &amp; sân vườn.</li>
                <li>&bull; Vé mời tham dự Workshop pha chế thủ công cùng Master Barista.</li>
              </ul>
            </div>

            {/* Diamond */}
            <div className="p-3.5 bg-red-50/70 border-2 border-[#CF373D] space-y-2 shadow-2xs">
              <div className="flex justify-between items-center border-b border-red-300 pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#CF373D] text-white font-bold flex items-center justify-center text-xs">
                    💎
                  </span>
                  <strong className="font-serif text-sm text-[#CF373D]">KIM CƯƠNG VIP PATRON</strong>
                </div>
                <span className="font-mono text-[10px] text-[#CF373D] font-bold">Từ 8.000.000đ</span>
              </div>
              <ul className="space-y-1 font-serif text-gray-700 text-[11px]">
                <li>&bull; <strong>Giảm 15% trọn đời</strong> trên toàn bộ thực đơn &amp; nông sản đóng gói.</li>
                <li>&bull; Quyền sử dụng <strong>Phòng Đọc Báo VIP Salon riêng tư</strong> không phụ thu.</li>
                <li>&bull; Trải nghiệm thử các mẻ rang thử nghiệm (Experimental Lots) giới hạn.</li>
                <li>&bull; Quà tặng tri ân thường niên: Set cà phê đặc sản cao cấp thiết kế riêng.</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Rules & Guidelines */}
        <div className="space-y-3 font-serif text-xs text-gray-700 leading-relaxed border-t border-[#D8D1C5] pt-4">
          <h4 className="font-cinzel font-bold text-xs text-[#124874] uppercase">
            QUY ĐỊNH TÍCH LŨY &amp; SỬ DỤNG ĐIỂM THƯỞNG:
          </h4>
          <p>
            <strong>1. Tỷ lệ quy đổi điểm:</strong> Mỗi <strong>1.000 VNĐ</strong> chi tiêu tại Blend tương đương <strong>1 Điểm thưởng (Point)</strong>. Điểm tích lũy có thể dùng để đổi các voucher giảm giá 50k, 100k hoặc đổi lấy các gói cà phê hạt rang mộc 250g.
          </p>
          <p>
            <strong>2. Thời hạn bảo lưu điểm:</strong> Điểm tích lũy và thứ hạng hội viên có giá trị <strong>vĩnh viễn</strong> nếu tài khoản phát sinh ít nhất 01 giao dịch trong vòng 12 tháng liên tục.
          </p>
          <p>
            <strong>3. Nhận diện tại quầy:</strong> Chỉ cần đọc số điện thoại đã đăng ký cho nhân viên Thu ngân POS hoặc đưa mã QR thẻ hội viên trên ứng dụng di động để được tự động áp dụng ưu đãi giảm giá ngay trên hóa đơn.
          </p>
        </div>

        {/* Colophon Stamp */}
        <div className="p-3 bg-white border border-[#124874] text-center space-y-1 font-serif text-xs">
          <div className="ink-stamp stamp-jasper text-[9px] font-bold inline-block mb-1">
            &bull; HỘI THƯỞNG THỨC BLEND ROASTERY &bull;
          </div>
          <p className="italic text-gray-500 text-[11px]">
            Chính sách được quản lý tự động bởi hệ thống máy tính tiền POS và đồng bộ đám mây thời gian thực.
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
            ĐÃ HIỂU CHÍNH SÁCH &amp; ĐÓNG
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default MembershipPolicyModal;
