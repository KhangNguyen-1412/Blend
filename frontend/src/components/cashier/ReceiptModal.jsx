import React, { useRef } from 'react';
import Modal from '../common/Modal';

export const ReceiptModal = ({ isOpen, onClose, orderData, cashierName, onNewOrder }) => {
  const receiptRef = useRef(null);

  if (!orderData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleFinish = () => {
    onClose();
    if (onNewOrder) onNewOrder();
  };

  const nowFormatted = new Date().toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="HÓA ĐƠN TÒA SOẠN &bull; GAZETTE RECEIPT"
    >
      <div className="space-y-6 font-body text-brand-dark">
        
        {/* Printable Thermal Receipt Card */}
        <div 
          ref={receiptRef}
          className="printable-receipt bg-[#FCFAF6] p-6 sm:p-8 border-2 border-[#124874] shadow-md max-w-md mx-auto space-y-4 font-mono text-xs"
        >
          {/* Masthead Header */}
          <div className="text-center border-b-2 border-dashed border-[#124874] pb-4 space-y-1">
            <h2 className="font-display text-2xl font-black tracking-tight text-[#124874]">
              BLEND ROASTERY<span className="text-[#CF373D]">.</span>
            </h2>
            <p className="font-cinzel text-[9px] uppercase tracking-widest text-[#6E675F] font-bold">
              THE COFFEE &amp; TEA CHRONICLE &bull; SAIGON
            </p>
            <p className="font-serif italic text-[11px] text-gray-600">
              Số 88 Bến Nghé, Quận 1, TP. Hồ Chí Minh
            </p>
            <p className="font-mono text-[10px] text-gray-500">
              Hotline: 0908.123.456 &bull; MST: 0318899221
            </p>
          </div>

          {/* Receipt Meta */}
          <div className="border-b border-dashed border-[#124874] pb-3 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã hóa đơn:</span>
              <strong className="text-[#CF373D]">#{orderData.id || `ORD-${Date.now().toString().slice(-4)}`}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thời gian:</span>
              <span>{orderData.time || nowFormatted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thu ngân trực ca:</span>
              <strong>{cashierName || 'Thu ngân ca 1'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hình thức phục vụ:</span>
              <strong className="text-[#124874]">{orderData.servingType || 'Tại bàn'} {orderData.tableNumber ? `(Bàn ${orderData.tableNumber})` : ''}</strong>
            </div>
            {orderData.customer && (
              <div className="flex justify-between">
                <span className="text-gray-600">Khách hàng:</span>
                <span>{orderData.customer} {orderData.customerTier ? `(${orderData.customerTier})` : ''}</span>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="border-b border-dashed border-[#124874] pb-3">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#124874]/30 text-[10px] font-cinzel font-bold text-[#124874]">
                  <th className="pb-1">MÓN</th>
                  <th className="pb-1 text-center">SL</th>
                  <th className="pb-1 text-right">ĐƠN GIÁ</th>
                  <th className="pb-1 text-right">T.TIỀN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs">
                {(orderData.items || []).map((item, idx) => (
                  <tr key={idx} className="py-1.5">
                    <td className="py-1 pr-1">
                      <p className="font-serif font-bold text-gray-900 leading-tight">{item.name}</p>
                      {item.modifierSummary && (
                        <p className="font-serif italic text-[10px] text-gray-500">{item.modifierSummary}</p>
                      )}
                    </td>
                    <td className="py-1 text-center font-bold text-gray-800">{item.quantity}</td>
                    <td className="py-1 text-right text-gray-600">{(item.unitPrice || 0).toLocaleString('vi-VN')}đ</td>
                    <td className="py-1 text-right font-bold text-gray-900">{(item.total || 0).toLocaleString('vi-VN')}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation Breakdown */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-700">
              <span>Tạm tính:</span>
              <span>{(orderData.subtotal || 0).toLocaleString('vi-VN')}đ</span>
            </div>

            {orderData.discount > 0 && (
              <div className="flex justify-between text-[#CF373D] font-bold">
                <span>Chiết khấu / Khuyến mãi:</span>
                <span>-{(orderData.discount || 0).toLocaleString('vi-VN')}đ</span>
              </div>
            )}

            {orderData.loyaltyDiscount > 0 && (
              <div className="flex justify-between text-emerald-800 font-bold">
                <span>Ưu đãi Hội viên {orderData.customerTier}:</span>
                <span>-{(orderData.loyaltyDiscount || 0).toLocaleString('vi-VN')}đ</span>
              </div>
            )}

            <div className="pt-2 border-t-2 border-[#124874] flex justify-between items-center text-sm font-black text-[#124874]">
              <span className="font-cinzel tracking-wider">TỔNG CỘNG:</span>
              <span className="font-mono text-base text-[#CF373D]">
                {(orderData.grandTotal || orderData.total_num || 0).toLocaleString('vi-VN')}đ
              </span>
            </div>

            {/* Payment Details */}
            <div className="pt-2 border-t border-dashed border-[#124874] text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Phương thức thanh toán:</span>
                <strong className="text-[#124874] uppercase">{orderData.payment || 'Tiền mặt'}</strong>
              </div>
              {orderData.payment === 'Tiền mặt' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiền khách đưa:</span>
                    <span>{(orderData.cashGiven || 0).toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#124874]">
                    <span>Tiền thối lại:</span>
                    <span>{(orderData.changeDue || 0).toLocaleString('vi-VN')}đ</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Colophon & QR Stamp */}
          <div className="pt-4 border-t-2 border-dashed border-[#124874] text-center space-y-2">
            <div className="flex justify-center items-center gap-2">
              <div className="w-16 h-16 bg-white border border-[#124874] p-1 flex items-center justify-center">
                <i className="fa-solid fa-qrcode text-4xl text-[#124874]"></i>
              </div>
              <div className="text-left text-[10px]">
                <p className="font-cinzel font-bold text-[#124874]">HÓA ĐƠN ĐIỆN TỬ</p>
                <p className="font-serif italic text-gray-500">Quét mã QR để xem hóa đơn &amp; tích điểm hội viên</p>
              </div>
            </div>

            <p className="font-serif italic text-[11px] text-gray-700 leading-relaxed pt-1">
              "Cảm ơn quý độc giả đã thưởng thức cà phê và lắng nghe câu chuyện của Blend. Hẹn gặp lại quý khách!"
            </p>
            <div className="ink-stamp stamp-green text-[9px] font-bold inline-block">
              &bull; ĐÃ THANH TOÁN TOÀN BỘ &bull;
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t-2 border-[#124874]">
          <button
            type="button"
            onClick={handlePrint}
            className="press-btn px-5 py-2.5 bg-white text-[#124874] border border-[#124874] font-cinzel text-xs font-bold hover:bg-[#124874] hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-print"></i>
            <span>IN HÓA ĐƠN RA MÁY IN</span>
          </button>
          <button
            type="button"
            onClick={handleFinish}
            style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
            className="press-btn px-6 py-2.5 font-cinzel text-xs font-bold hover:bg-[#124874] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-circle-check"></i>
            <span>HOÀN TẤT &bull; ĐƠN MỚI</span>
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default ReceiptModal;
