import React, { useState } from 'react';
import Modal from '../common/Modal';
import { reportsApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const EXPORT_TYPES = [
  {
    id: 'full',
    title: 'Sổ Cái Hợp Nhất Toàn Bộ (Full Ledger)',
    desc: 'Bao gồm toàn bộ Doanh thu, Tồn kho, Sổ đặt chỗ & Danh bạ hội viên kèm chữ ký 3 bên.',
    icon: 'fa-book-bookmark'
  },
  {
    id: 'orders',
    title: 'Bảng Kê Chi Tiết Đơn Hàng & Doanh Thu',
    desc: 'Lịch sử từng hóa đơn gọi món, phương thức thanh toán và tổng doanh thu.',
    icon: 'fa-file-invoice-dollar'
  },
  {
    id: 'inventory',
    title: 'Sổ Đối Soát Tồn Kho & Định Mức NVL',
    desc: 'Số lượng tồn thực tế, đơn vị tính, định mức an toàn và cảnh báo nhập hàng.',
    icon: 'fa-boxes-stacked'
  },
  {
    id: 'reservations',
    title: 'Sổ Ghi Danh Đặt Chỗ & Khách VIP Salon',
    desc: 'Danh sách lịch hẹn thưởng thức trà, bàn đọc báo in và phòng họp riêng.',
    icon: 'fa-calendar-check'
  },
  {
    id: 'customers',
    title: 'Danh Bộ Khách Quý & Hội Viên Thân Thiết',
    desc: 'Số điện thoại, email, hạng thẻ hội viên và tổng tích lũy chi tiêu.',
    icon: 'fa-address-book'
  },
];

export const ExcelExportModal = ({ isOpen, onClose, selectedDate = '' }) => {
  const [selectedType, setSelectedType] = useState('full');
  const [exportFormat, setExportFormat] = useState('excel'); // 'excel' | 'csv'
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleDownload = () => {
    let downloadUrl = '';
    if (exportFormat === 'excel') {
      downloadUrl = reportsApi.getExcelExportUrl(selectedType, selectedDate);
      addToast('Đang kết xuất tệp Excel màu thương hiệu Blend...', 'success');
    } else {
      downloadUrl = reportsApi.getExportUrl(selectedType === 'full' ? 'orders' : selectedType);
      addToast('Đang xuất tệp CSV dữ liệu sổ cái...', 'success');
    }

    // Trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Trung Tâm Kết Xuất &amp; In Ấn Sổ Cái Excel (Publishing Desk)"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6 font-body text-[#161413]">
        
        {/* Header Description */}
        <div className="border-b border-[#124874] pb-3 flex justify-between items-center">
          <div>
            <span className="font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider block">
              CHUẨN ĐỊNH DẠNG BẢNG TÍNH EXCEL &amp; BÁO CHÍ 2026
            </span>
            <p className="font-serif italic text-xs text-[#6E675F] mt-0.5">
              Tệp kết xuất được định dạng sẵn màu Xanh Cerulean (#124874) và Đỏ Jasper (#CF373D), tương thích 100% Microsoft Excel, Google Sheets, LibreOffice.
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-[#124874] bg-[#FCFAF6] px-2.5 py-1 border border-[#124874]">
            KỲ: {selectedDate || 'TOÀN KỲ'}
          </span>
        </div>

        {/* Step 1: Choose Ledger Scope */}
        <div>
          <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-2.5">
            1. Chọn Loại Sổ Cái Cần Kết Xuất:
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {EXPORT_TYPES.map((t) => {
              const isSelected = selectedType === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`p-3.5 border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-white border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.95)]'
                      : 'bg-[#FAF7F2] border-[#D8D1C5] hover:border-[#124874]'
                  }`}
                >
                  <div
                    style={isSelected ? { backgroundColor: '#124874', color: '#ffffff' } : {}}
                    className={`w-9 h-9 flex items-center justify-center border border-[#124874] text-xs flex-shrink-0 mt-0.5 ${
                      !isSelected ? 'bg-white text-[#124874]' : ''
                    }`}
                  >
                    <i className={`fa-solid ${t.icon}`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-[#124874] truncate">
                      {t.title}
                    </h4>
                    <p className="font-serif text-[11px] text-[#6E675F] mt-0.5 leading-snug">
                      {t.desc}
                    </p>
                  </div>
                  {isSelected && (
                    <i className="fa-solid fa-circle-check text-[#CF373D] text-sm mt-1"></i>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Choose Export Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-2">
              2. Định Dạng Tệp:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setExportFormat('excel')}
                className={`p-3 border-2 text-center transition-all cursor-pointer ${
                  exportFormat === 'excel'
                    ? 'bg-white border-[#124874] shadow-[3px_3px_0px_rgba(18,72,116,0.95)] text-[#124874] font-bold'
                    : 'bg-[#FAF7F2] border-[#D8D1C5] text-[#6E675F] hover:border-[#124874]'
                }`}
              >
                <i className="fa-solid fa-file-excel text-lg text-[#124874] block mb-1"></i>
                <span className="font-cinzel text-xs block">EXCEL (.XLS)</span>
                <span className="text-[10px] font-serif block text-gray-500">Đầy đủ màu &amp; khung</span>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat('csv')}
                className={`p-3 border-2 text-center transition-all cursor-pointer ${
                  exportFormat === 'csv'
                    ? 'bg-white border-[#124874] shadow-[3px_3px_0px_rgba(18,72,116,0.95)] text-[#124874] font-bold'
                    : 'bg-[#FAF7F2] border-[#D8D1C5] text-[#6E675F] hover:border-[#124874]'
                }`}
              >
                <i className="fa-solid fa-file-csv text-lg text-[#124874] block mb-1"></i>
                <span className="font-cinzel text-xs block">CSV KẾ TOÁN</span>
                <span className="text-[10px] font-serif block text-gray-500">Dữ liệu thô UTF-8</span>
              </button>
            </div>
          </div>

          {/* Live Preview Sample */}
          <div className="bg-[#FAF7F2] border border-[#124874] p-3.5 flex flex-col justify-between">
            <div>
              <span className="font-cinzel text-[10px] font-bold text-[#124874] uppercase tracking-wider block mb-1">
                MÔ PHỎNG HIỂN THỊ BẢNG TÍNH:
              </span>
              <div className="bg-white border border-[#124874] overflow-hidden text-[10px] font-mono">
                <div className="bg-[#124874] text-white px-2 py-1 flex justify-between font-bold">
                  <span>MÃ ĐƠN</span>
                  <span>KHÁCH HÀNG</span>
                  <span>TỔNG THU</span>
                </div>
                <div className="p-1.5 space-y-0.5 border-b border-[#D8D1C5] flex justify-between text-gray-700">
                  <span>#1024</span>
                  <span>Nguyễn Văn An</span>
                  <span className="text-[#CF373D] font-bold">128.000đ</span>
                </div>
                <div className="p-1.5 space-y-0.5 flex justify-between bg-[#FCFAF6] text-gray-700">
                  <span>#1025</span>
                  <span>Trần Mai Lan</span>
                  <span className="text-[#CF373D] font-bold">96.000đ</span>
                </div>
              </div>
            </div>
            <p className="font-serif italic text-[10px] text-gray-500 mt-2 text-center">
              &bull; Bản in tự động căn lề, chèn logo Blend &amp; phần ký duyệt 3 bên
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-5 border-t border-[#124874] flex flex-col sm:flex-row justify-between items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="press-btn w-full sm:w-auto px-5 py-2.5 border border-[#124874] text-[#124874] font-cinzel text-xs font-bold hover:bg-gray-100 transition-colors"
          >
            ĐÓNG LẠI
          </button>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onClose();
                window.print();
              }}
              className="press-btn flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-[#124874] text-[#124874] font-cinzel text-xs font-bold hover:bg-[#124874] hover:text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <i className="fa-solid fa-print"></i>
              <span>IN NGAY (PRINT)</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              style={{ backgroundColor: '#124874', color: '#ffffff' }}
              className="press-btn flex-1 sm:flex-initial px-6 py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-file-arrow-down text-amber-300"></i>
              <span>TẢI VỀ TỆP {exportFormat === 'excel' ? 'EXCEL (.XLS)' : 'CSV'}</span>
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
};

export default ExcelExportModal;
