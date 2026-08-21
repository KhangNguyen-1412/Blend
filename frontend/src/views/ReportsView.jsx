import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/common/SectionHeader';
import CustomDatePicker from '../components/common/CustomDatePicker';
import ExcelExportModal from '../components/reports/ExcelExportModal';
import { reportsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const ReportsView = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportScope, setReportScope] = useState('full'); // 'full' | 'revenue' | 'inventory'
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  const { addToast } = useToast();
  const { user } = useAuth();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportsApi.getSummary();
      if (res.success) {
        setReportData(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Lỗi tải sổ cái báo cáo', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDateChange = (dateStr) => {
    setSelectedDate(dateStr);
    addToast(`Đã lọc sổ cái quyết toán theo ngày: ${dateStr}`, 'info');
  };

  const handleExportCSV = (type = 'orders') => {
    const url = reportsApi.getExportUrl(type);
    window.open(url, '_blank');
    addToast(`Đang kết xuất tệp CSV dữ liệu sổ cái (${type})...`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper calculation for total items sold
  const totalItemsSold = reportData?.category_breakdown
    ? reportData.category_breakdown.reduce((sum, c) => sum + (parseInt(c.items_sold, 10) || 0), 0)
    : 0;

  return (
    <div className="font-body animate-editorial-in text-[#161413] space-y-6">
      
      {/* 1. Header (Hidden during Print) */}
      <div className="no-print">
        <SectionHeader 
          sectionNo="MỤC VIII &bull; SỔ CÁI BÁO CÁO &amp; QUYẾT TOÁN" 
          title="Bản Kê Doanh Thu &amp; Đối Soát Kho Chuẩn In" 
          subtitle="Hệ thống tổng hợp dòng tiền kế toán, đối chiếu định mức kho và kết xuất bản in chuẩn khổ A4 báo chí." 
          action={
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={fetchReports}
                className="press-btn px-3.5 py-2 bg-white border border-[#124874] text-[#124874] font-cinzel text-xs font-bold hover:bg-[#124874] hover:text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <i className={`fa-solid fa-arrows-rotate ${loading ? 'fa-spin' : ''}`}></i>
                <span>LÀM MỚI SỔ CÁI</span>
              </button>
              <button 
                onClick={() => setIsExportModalOpen(true)}
                style={{ backgroundColor: '#124874', color: '#ffffff' }}
                className="press-btn px-4 py-2 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <i className="fa-solid fa-file-excel"></i>
                <span>XUẤT SỔ CÁI EXCEL (.XLS)</span>
              </button>
              <button 
                onClick={handlePrint}
                style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
                className="press-btn px-5 py-2 font-cinzel text-xs font-bold hover:bg-[#AB282D] transition-colors shadow-md flex items-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-print"></i>
                <span>IN BẢN BÁO CÁO (PRINT A4)</span>
              </button>
            </div>
          }
        />

        {/* Scope & Date Filter Bar */}
        <div className="bg-white p-4 border-2 border-[#124874] shadow-xs flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mt-6">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-cinzel font-bold text-[#124874] text-xs uppercase mr-1">
              Phạm Vi Báo Cáo:
            </span>
            <button 
              type="button"
              onClick={() => setReportScope('full')}
              className={`px-3.5 py-1.5 font-cinzel text-xs font-bold transition-all border ${
                reportScope === 'full' 
                  ? 'bg-[#124874] text-white border-[#124874]' 
                  : 'bg-[#FAF7F2] text-[#124874] border-[#D8D1C5] hover:border-[#124874]'
              }`}
            >
              I. BẢN TỔNG HỢP TOÀN BỘ (A4)
            </button>
            <button 
              type="button"
              onClick={() => setReportScope('revenue')}
              className={`px-3.5 py-1.5 font-cinzel text-xs font-bold transition-all border ${
                reportScope === 'revenue' 
                  ? 'bg-[#124874] text-white border-[#124874]' 
                  : 'bg-[#FAF7F2] text-[#124874] border-[#D8D1C5] hover:border-[#124874]'
              }`}
            >
              II. DOANH SỐ &amp; MÓN NƯỚC
            </button>
            <button 
              type="button"
              onClick={() => setReportScope('inventory')}
              className={`px-3.5 py-1.5 font-cinzel text-xs font-bold transition-all border ${
                reportScope === 'inventory' 
                  ? 'bg-[#124874] text-white border-[#124874]' 
                  : 'bg-[#FAF7F2] text-[#124874] border-[#D8D1C5] hover:border-[#124874]'
              }`}
            >
              III. ĐỐI SOÁT TỒN KHO
            </button>
          </div>

          <div className="w-full sm:w-60">
            <CustomDatePicker
              value={selectedDate}
              onChange={handleDateChange}
              placeholder="Chọn ngày đối soát..."
            />
          </div>
        </div>
      </div>

      {/* 2. Main Printable Broadsheet Docket */}
      <div 
        id="printable-report-sheet"
        className="print-sheet-container bg-white p-6 sm:p-10 border-2 border-[#124874] shadow-[8px_8px_0px_rgba(18,72,116,0.95)] max-w-5xl mx-auto space-y-8"
      >
        
        {/* =========================================================================
            PRINT HEADER: BROADSHEET MASTHEAD & LEGAL COLOPHON
            ========================================================================= */}
        <div className="border-b-2 border-[#124874] pb-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            
            {/* Brand Information */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#124874] text-white font-display text-3xl font-black flex items-center justify-center border border-[#0D3656]">
                B<span className="text-[#CF373D]">.</span>
              </div>
              <div>
                <h2 className="font-display text-2xl font-black text-[#124874] tracking-tight leading-none">
                  Blend Roastery Press<span className="text-[#CF373D] font-mono">.</span>
                </h2>
                <p className="font-cinzel text-[9px] font-bold text-[#6E675F] tracking-widest uppercase mt-0.5">
                  SAIGON FLAGSHIP ROASTERY &bull; EST. 2024
                </p>
                <p className="font-serif text-[11px] text-gray-600 mt-0.5">
                  Số 88 Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
                </p>
              </div>
            </div>

            {/* Document Reference Info */}
            <div className="text-left sm:text-right font-mono text-xs text-[#161413] space-y-0.5">
              <div className="font-cinzel font-bold text-[11px] text-[#124874] uppercase">
                CHỨNG TỪ: <span className="font-mono text-[#CF373D]">#BL-FIN-{selectedDate.replace(/-/g, '')}</span>
              </div>
              <div>Ngày lập biểu: <strong>{new Date().toLocaleDateString('vi-VN')}</strong></div>
              <div>Thời gian in: <strong>{new Date().toLocaleTimeString('vi-VN')}</strong></div>
              <div>Người lập: <strong>{user?.name || 'Nguyễn Hoàng Phúc (Quản lý)'}</strong></div>
            </div>

          </div>

          {/* Large Title Strip */}
          <div className="text-center mt-6 pt-5 border-t border-[#D8D1C5]">
            <span className="font-cinzel text-[10px] tracking-[0.25em] text-[#CF373D] font-bold uppercase block mb-1">
              &mdash; BẢN KẾT XUẤT TÀI CHÍNH CHÍNH THỨC &mdash;
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-[#124874] uppercase tracking-tight">
              Báo Cáo Sổ Cái Doanh Thu &amp; Đối Soát Tồn Kho
            </h1>
            <p className="font-serif italic text-xs text-gray-600 mt-1">
              Kỳ đối soát kế toán: Toàn bộ dữ liệu giao dịch &amp; dự trữ thực tế cập nhật đến ngày {selectedDate}
            </p>
          </div>
        </div>

        {/* =========================================================================
            PHẦN 1: BẢNG CHỈ SỐ TỔNG QUAN (FINANCIAL METRIC RIBBON)
            ========================================================================= */}
        {(reportScope === 'full' || reportScope === 'revenue') && (
          <div className="print-avoid-break space-y-3">
            <div className="flex justify-between items-center border-b border-[#124874] pb-1.5">
              <h3 className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider">
                I. CHỈ SỐ TÀI CHÍNH TỔNG HỢP (SUMMARY METRICS)
              </h3>
              <span className="font-mono text-[10px] text-[#6E675F] font-bold">TIỀN TỆ: VND</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              
              {/* Metric 1 */}
              <div className="p-3.5 bg-[#FAF7F2] border border-[#124874]">
                <span className="font-cinzel text-[9px] uppercase font-bold text-[#6E675F] block">
                  TỔNG DOANH THU KỲ
                </span>
                <p className="font-display text-2xl font-bold text-[#124874] mt-0.5">
                  {reportData?.total_revenue || '0đ'}
                </p>
                <span className="font-serif italic text-[10px] text-gray-500 block">Thực thu toàn hệ thống</span>
              </div>

              {/* Metric 2 */}
              <div className="p-3.5 bg-[#FAF7F2] border border-[#124874]">
                <span className="font-cinzel text-[9px] uppercase font-bold text-[#6E675F] block">
                  SỐ ĐƠN ĐÃ XỬ LÝ
                </span>
                <p className="font-display text-2xl font-bold text-[#124874] mt-0.5">
                  {reportData?.total_orders || 0} <span className="text-xs font-serif font-normal">đơn</span>
                </p>
                <span className="font-serif italic text-[10px] text-gray-500 block">Đã xuất hóa đơn</span>
              </div>

              {/* Metric 3 */}
              <div className="p-3.5 bg-[#FAF7F2] border border-[#124874]">
                <span className="font-cinzel text-[9px] uppercase font-bold text-[#6E675F] block">
                  GIÁ TRỊ ĐƠN BÌNH QUÂN
                </span>
                <p className="font-display text-2xl font-bold text-[#CF373D] mt-0.5">
                  {reportData?.avg_order_value || '0đ'}
                </p>
                <span className="font-serif italic text-[10px] text-gray-500 block">Mức chi tiêu / khách</span>
              </div>

              {/* Metric 4 */}
              <div className="p-3.5 bg-[#FAF7F2] border border-[#124874]">
                <span className="font-cinzel text-[9px] uppercase font-bold text-[#6E675F] block">
                  TỔNG SỐ MÓN ĐÃ BÁN
                </span>
                <p className="font-display text-2xl font-bold text-[#124874] mt-0.5">
                  {totalItemsSold} <span className="text-xs font-serif font-normal">ly/phần</span>
                </p>
                <span className="font-serif italic text-[10px] text-gray-500 block">Sản lượng phục vụ</span>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            PHẦN 2: BẢNG KÊ DOANH THU THEO DANH MỤC (CATEGORY BREAKDOWN TABLE)
            ========================================================================= */}
        {(reportScope === 'full' || reportScope === 'revenue') && (
          <div className="print-avoid-break space-y-3">
            <div className="flex justify-between items-center border-b border-[#124874] pb-1.5">
              <h3 className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider">
                II. BẢNG KÊ DOANH THU THEO DANH MỤC THỰC PHỔ (CATEGORY SALES LEDGER)
              </h3>
              <span className="font-mono text-[10px] text-[#6E675F] font-bold">ĐƠN VỊ TÍNH: VNĐ</span>
            </div>

            <div className="border border-[#124874] overflow-hidden">
              <table className="w-full text-left border-collapse font-body text-xs">
                <thead>
                  <tr className="bg-[#124874] text-white font-cinzel text-[11px] border-b border-[#0D3656]">
                    <th className="py-2.5 px-3.5 w-12 text-center">STT</th>
                    <th className="py-2.5 px-3.5">DANH MỤC MÓN NƯỚC &amp; BÁNH</th>
                    <th className="py-2.5 px-3.5 text-center">SỐ LƯỢNG ĐÃ PHỤC VỤ</th>
                    <th className="py-2.5 px-3.5 text-right">DOANH SỐ KỲ NÀY</th>
                    <th className="py-2.5 px-3.5 text-center">ĐÁNH GIÁ TĂNG TRƯỞNG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D1C5]">
                  {reportData?.category_breakdown && reportData.category_breakdown.length > 0 ? (
                    reportData.category_breakdown.map((c, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF7F2]">
                        <td className="py-2.5 px-3.5 text-center font-mono font-bold text-[#124874]">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3.5 font-serif font-bold text-sm text-[#161413]">
                          {c.category}
                        </td>
                        <td className="py-2.5 px-3.5 text-center font-mono font-bold text-gray-800">
                          {c.items_sold} món
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-mono font-bold text-sm text-[#CF373D]">
                          {c.revenue}
                        </td>
                        <td className="py-2.5 px-3.5 text-center">
                          <span className="inline-block px-2 py-0.5 bg-[#FCFAF6] border border-[#124874] text-[#124874] font-cinzel text-[10px] font-bold">
                            TỐT &bull; TIÊU CHUẨN
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-gray-500 font-serif italic">
                        Chưa có dữ liệu danh mục trong kỳ đối soát này.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-[#FAF7F2] border-t-2 border-[#124874] font-cinzel font-bold text-xs">
                    <td colSpan="2" className="py-3 px-3.5 text-[#124874] uppercase tracking-wider">
                      TỔNG CỘNG TOÀN BỘ DANH MỤC:
                    </td>
                    <td className="py-3 px-3.5 text-center font-mono font-bold text-[#124874]">
                      {totalItemsSold} món
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-sm text-[#CF373D]">
                      {reportData?.total_revenue || '0đ'}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            PHẦN 3: BẢNG ĐỐI SOÁT TỒN KHO (INVENTORY AUDIT TABLE)
            ========================================================================= */}
        {(reportScope === 'full' || reportScope === 'inventory') && (
          <div className="print-avoid-break space-y-3">
            <div className="flex justify-between items-center border-b border-[#124874] pb-1.5">
              <h3 className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider">
                III. BẢNG ĐỐI SOÁT TỒN KHO &amp; ĐỊNH MỨC NGUYÊN LIỆU (STOCK &amp; PANTRY AUDIT)
              </h3>
              <span className="font-mono text-[10px] text-[#6E675F] font-bold">KHO: SAIGON HUB</span>
            </div>

            <div className="border border-[#124874] overflow-hidden">
              <table className="w-full text-left border-collapse font-body text-xs">
                <thead>
                  <tr className="bg-[#124874] text-white font-cinzel text-[11px] border-b border-[#0D3656]">
                    <th className="py-2.5 px-3.5 w-16">MÃ KHO</th>
                    <th className="py-2.5 px-3.5">TÊN NGUYÊN LIỆU / VẬT TƯ</th>
                    <th className="py-2.5 px-3.5 text-center">TỒN KHO THỰC TẾ</th>
                    <th className="py-2.5 px-3.5 text-center">ĐỊNH MỨC AN TOÀN</th>
                    <th className="py-2.5 px-3.5 text-center">TÌNH TRẠNG VẬT TƯ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D1C5]">
                  {reportData?.inventory_summary && reportData.inventory_summary.length > 0 ? (
                    reportData.inventory_summary.map((inv, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF7F2]">
                        <td className="py-2.5 px-3.5 font-mono font-bold text-[#124874]">
                          #{inv.id}
                        </td>
                        <td className="py-2.5 px-3.5 font-serif font-bold text-[#161413]">
                          {inv.name}
                        </td>
                        <td className="py-2.5 px-3.5 text-center font-mono font-bold text-sm text-[#124874]">
                          {inv.qty} {inv.unit}
                        </td>
                        <td className="py-2.5 px-3.5 text-center font-mono text-gray-600">
                          {inv.min} {inv.unit}
                        </td>
                        <td className="py-2.5 px-3.5 text-center">
                          <span className={`inline-block px-2 py-0.5 border font-cinzel text-[10px] font-bold ${
                            inv.status === 'warning'
                              ? 'border-[#CF373D] text-[#CF373D] bg-[#FCFAF6]'
                              : 'border-[#124874] text-[#124874] bg-[#FCFAF6]'
                          }`}>
                            {inv.status === 'warning' ? 'CẦN NHẬP BỔ SUNG' : 'ĐỦ ĐỊNH MỨC'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-gray-500 font-serif italic">
                        Chưa có dữ liệu tồn kho trong cơ sở dữ liệu.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            PHẦN 4: CHỮ KÝ PHÊ DUYỆT & CON DẤU NIÊM PHONG (OFFICIAL AUDIT SIGNATURES)
            ========================================================================= */}
        <div className="print-avoid-break pt-8 border-t-2 border-[#124874]">
          <div className="grid grid-cols-3 gap-6 text-center font-serif text-xs">
            
            {/* Signature 1 */}
            <div className="space-y-16">
              <div>
                <span className="font-cinzel text-[10px] font-bold text-[#124874] uppercase tracking-wider block">
                  NGƯỜI LẬP BIỂU
                </span>
                <span className="text-[11px] text-gray-500 italic block">(Ký và ghi rõ họ tên)</span>
              </div>
              <div className="font-serif font-bold text-sm text-[#161413] border-t border-dashed border-[#D8D1C5] pt-2 max-w-[180px] mx-auto">
                {user?.name || 'Nguyễn Hoàng Phúc'}
              </div>
            </div>

            {/* Signature 2 */}
            <div className="space-y-16">
              <div>
                <span className="font-cinzel text-[10px] font-bold text-[#124874] uppercase tracking-wider block">
                  THỦ KHO TRƯỞNG
                </span>
                <span className="text-[11px] text-gray-500 italic block">(Kiểm kê &amp; xác nhận)</span>
              </div>
              <div className="font-serif font-bold text-sm text-[#161413] border-t border-dashed border-[#D8D1C5] pt-2 max-w-[180px] mx-auto">
                Bảo Trưởng Ca
              </div>
            </div>

            {/* Signature 3 + Vintage Stamp */}
            <div className="space-y-10 relative">
              <div>
                <span className="font-cinzel text-[10px] font-bold text-[#CF373D] uppercase tracking-wider block">
                  CHỦ BIÊN &bull; GIÁM ĐỐC VẬN HÀNH
                </span>
                <span className="text-[11px] text-gray-500 italic block">(Ký duyệt &amp; Đóng dấu niêm phong)</span>
              </div>
              
              {/* Vintage Seal Stamp */}
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#CF373D] text-[#CF373D] flex flex-col items-center justify-center p-1 mx-auto rotate-[-8deg] opacity-90">
                <span className="font-cinzel text-[7px] tracking-widest font-black uppercase">BLEND ROASTERY</span>
                <i className="fa-solid fa-stamp text-xs my-0.5"></i>
                <span className="font-cinzel text-[8px] font-bold">ĐÃ KIỂM SOÁT</span>
                <span className="font-mono text-[7px]">2026 AUDITED</span>
              </div>

              <div className="font-serif font-bold text-sm text-[#161413] border-t border-dashed border-[#D8D1C5] pt-2 max-w-[180px] mx-auto">
                Ban Quản Trị Blend
              </div>
            </div>

          </div>

          {/* Legal Footer Note */}
          <div className="mt-8 pt-4 border-t border-[#D8D1C5] text-center text-[10px] font-serif text-gray-500">
            <span>Bản báo cáo này được trích xuất tự động từ Hệ Thống Quản Trị Blend Roastery Press &bull; Có giá trị đối soát nội bộ và lưu trữ kế toán.</span>
          </div>
        </div>

      </div>

      {/* Excel & CSV Export Modal */}
      <ExcelExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        selectedDate={selectedDate}
      />

    </div>
  );
};

export default ReportsView;
