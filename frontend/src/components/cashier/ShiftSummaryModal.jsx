import React, { useState } from 'react';
import Modal from '../common/Modal';

export const ShiftSummaryModal = ({ isOpen, onClose, cashierUser, ordersInShift = [], onEndShift }) => {
  const [openingBalance, setOpeningBalance] = useState(1000000); // Default 1,000,000đ initial drawer float
  const [closingCashActual, setClosingCashActual] = useState('');

  if (!isOpen) return null;

  // Calculate shift revenue metrics
  const totalOrdersCount = ordersInShift.length;
  
  const cashSales = ordersInShift
    .filter(o => o.payment === 'Tiền mặt' || !o.payment)
    .reduce((sum, o) => sum + (o.total_num || parseInt(String(o.total || 0).replace(/[^0-9]/g, ''), 10) || 0), 0);

  const qrSales = ordersInShift
    .filter(o => o.payment === 'Chuyển khoản VietQR' || o.payment === 'VietQR' || o.payment === 'Chuyển khoản')
    .reduce((sum, o) => sum + (o.total_num || parseInt(String(o.total || 0).replace(/[^0-9]/g, ''), 10) || 0), 0);

  const cardSales = ordersInShift
    .filter(o => o.payment === 'Thẻ ngân hàng' || o.payment === 'Thẻ POS')
    .reduce((sum, o) => sum + (o.total_num || parseInt(String(o.total || 0).replace(/[^0-9]/g, ''), 10) || 0), 0);

  const totalShiftRevenue = cashSales + qrSales + cardSales;
  const expectedCashInDrawer = openingBalance + cashSales;
  const actualCashNum = closingCashActual ? parseInt(String(closingCashActual).replace(/[^0-9]/g, ''), 10) || 0 : expectedCashInDrawer;
  const cashDifference = actualCashNum - expectedCashInDrawer;

  const nowFormatted = new Date().toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmEndShift = () => {
    if (window.confirm('Xác nhận ĐÓNG CA & BÀN GIAO SỔ THU NGÂN?')) {
      if (onEndShift) onEndShift({
        cashier: cashierUser?.name,
        openingBalance,
        totalShiftRevenue,
        cashSales,
        qrSales,
        cardSales,
        totalOrdersCount,
        expectedCashInDrawer,
        actualCashNum,
        cashDifference,
        time: nowFormatted
      });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="BÁO CÁO TỔNG KẾT &amp; BÀN GIAO CA TRỰC"
    >
      <div className="space-y-6 font-body text-brand-dark">
        
        {/* Printable Shift Summary Box */}
        <div className="bg-[#FAF7F2] p-6 border-2 border-[#124874] shadow-xs space-y-4 font-mono text-xs">
          
          {/* Header */}
          <div className="text-center border-b-2 border-[#124874] pb-3 space-y-1">
            <span className="font-cinzel text-[10px] uppercase font-bold text-[#CF373D] tracking-widest block">
              BIÊN BẢN ĐỐI SOÁT QUỸ TIỀN MẶT
            </span>
            <h3 className="font-display text-xl font-bold text-[#124874]">
              TỔNG KẾT CA BÁN HÀNG &bull; BLEND POS
            </h3>
            <p className="font-serif italic text-gray-600 text-[11px]">
              Thời gian chốt ca: {nowFormatted} &bull; Thu ngân: <strong>{cashierUser?.name || 'Thu Ngân'}</strong>
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="bg-white p-3 border border-[#124874] text-center">
              <span className="font-cinzel text-[9px] uppercase text-gray-500 block font-bold">TỔNG ĐƠN HÀNG</span>
              <span className="font-mono text-xl font-black text-[#124874]">{totalOrdersCount}</span>
            </div>
            <div className="bg-white p-3 border border-[#124874] text-center">
              <span className="font-cinzel text-[9px] uppercase text-gray-500 block font-bold">DOANH THU CA</span>
              <span className="font-mono text-base font-black text-[#CF373D]">{totalShiftRevenue.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="bg-white p-3 border border-[#124874] text-center">
              <span className="font-cinzel text-[9px] uppercase text-gray-500 block font-bold">TIỀN MẶT THU</span>
              <span className="font-mono text-base font-black text-emerald-800">{cashSales.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="bg-white p-3 border border-[#124874] text-center">
              <span className="font-cinzel text-[9px] uppercase text-gray-500 block font-bold">VIETQR &amp; THẺ</span>
              <span className="font-mono text-base font-black text-[#124874]">{(qrSales + cardSales).toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {/* Detailed Cash Drawer Calculation */}
          <div className="bg-white p-4 border border-[#124874] space-y-2 text-xs">
            <div className="flex justify-between items-center text-gray-700">
              <span>1. Tiền mặt đầu ca (Quỹ nổi mở két):</span>
              <span className="font-bold">{openingBalance.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <span>2. Tiền mặt bán hàng thu được trong ca:</span>
              <span className="font-bold text-emerald-800">+{cashSales.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <span>3. Chuyển khoản VietQR:</span>
              <span className="font-bold text-[#124874]">+{qrSales.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <span>4. Quẹt thẻ POS ngân hàng:</span>
              <span className="font-bold text-[#124874]">+{cardSales.toLocaleString('vi-VN')}đ</span>
            </div>

            <div className="pt-2 border-t border-dashed border-[#124874] flex justify-between items-center text-sm font-bold text-[#124874]">
              <span>TỔNG TIỀN MẶT PHẢI CÓ TRONG KÉT:</span>
              <span className="font-mono text-base text-[#124874]">{expectedCashInDrawer.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {/* Actual Cash Count Input */}
          <div className="bg-[#FCFAF6] p-4 border-2 border-dashed border-[#124874] space-y-3">
            <div>
              <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                Kiểm Kê Tiền Mặt Thực Tế Cuối Ca (VNĐ):
              </label>
              <input
                type="text"
                placeholder={`VD: ${expectedCashInDrawer}`}
                value={closingCashActual}
                onChange={(e) => setClosingCashActual(e.target.value)}
                className="w-full bg-white border border-[#124874] px-3.5 py-2 font-mono text-sm font-bold text-[#124874] focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
              />
            </div>

            {/* Reconciliation Difference Badge */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-cinzel text-xs text-gray-600 font-bold uppercase">Chênh lệch quỹ tiền:</span>
              <span className={`font-mono text-sm font-bold px-2 py-0.5 border ${
                cashDifference === 0 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : cashDifference > 0 
                  ? 'bg-blue-50 text-blue-800 border-blue-300' 
                  : 'bg-red-50 text-red-800 border-red-300'
              }`}>
                {cashDifference === 0 ? '0đ (Khớp 100%)' : `${cashDifference > 0 ? '+' : ''}${cashDifference.toLocaleString('vi-VN')}đ`}
              </span>
            </div>
          </div>

          {/* Handover Signatures */}
          <div className="pt-3 border-t border-dashed border-[#124874] grid grid-cols-2 text-center text-[10px] font-serif">
            <div>
              <p className="font-cinzel font-bold text-[#124874]">THU NGÂN BÀN GIAO</p>
              <p className="italic text-gray-500 mt-6">(Ký &amp; ghi rõ họ tên)</p>
            </div>
            <div>
              <p className="font-cinzel font-bold text-[#124874]">QUẢN LÝ NHẬN CA</p>
              <p className="italic text-gray-500 mt-6">(Ký &amp; đóng dấu)</p>
            </div>
          </div>

        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap justify-end gap-3 pt-3 border-t-2 border-[#124874]">
          <button
            type="button"
            onClick={handlePrint}
            className="press-btn px-5 py-2.5 bg-white text-[#124874] border border-[#124874] font-cinzel text-xs font-bold hover:bg-[#124874] hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-print"></i>
            <span>IN BIÊN BẢN CA</span>
          </button>
          <button
            type="button"
            onClick={handleConfirmEndShift}
            style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
            className="press-btn px-6 py-2.5 font-cinzel text-xs font-bold hover:bg-[#124874] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-lock"></i>
            <span>XÁC NHẬN ĐÓNG CA TRỰC</span>
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default ShiftSummaryModal;
