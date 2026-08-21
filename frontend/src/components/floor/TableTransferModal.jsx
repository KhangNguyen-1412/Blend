import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';

export const TableTransferModal = ({ isOpen, onClose, currentTable, allTables = [], onTransferConfirm }) => {
  const [targetTableId, setTargetTableId] = useState('');
  const [transferReason, setTransferReason] = useState('Khách muốn đổi vị trí');
  const { addToast } = useToast();

  if (!isOpen || !currentTable) return null;

  const availableTables = allTables.filter(
    (t) => t.id !== currentTable.id && (t.status === 'Trống' || t.status === 'Sẵn sàng')
  );

  const handleConfirm = () => {
    if (!targetTableId) {
      addToast('Vui lòng chọn bàn trống đích để chuyển!', 'warning');
      return;
    }
    const targetTable = allTables.find((t) => t.id === targetTableId);
    if (onTransferConfirm) {
      onTransferConfirm(currentTable, targetTable, transferReason);
    }
    addToast(`Đã chuyển khách từ ${currentTable.name} sang ${targetTable?.name || targetTableId}!`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ĐỔI VỊ TRÍ &bull; CHUYỂN BÀN PHỤC VỤ"
    >
      <div className="space-y-4 font-body text-brand-dark">
        
        {/* Source Table Card */}
        <div className="p-3.5 bg-amber-50 border-2 border-amber-400 space-y-1">
          <span className="font-cinzel text-[10px] font-bold text-amber-900 uppercase">
            BÀN HIỆN TẠI ĐANG PHỤC VỤ:
          </span>
          <div className="flex justify-between items-center">
            <strong className="font-serif text-base text-[#124874]">{currentTable.name}</strong>
            <span className="font-mono text-xs text-gray-600">Khu vực: {currentTable.zone}</span>
          </div>
        </div>

        {/* Destination Table Selection */}
        <div className="space-y-1.5">
          <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase">
            Chọn Bàn Trống Muốn Chuyển Đến:
          </label>
          {availableTables.length === 0 ? (
            <p className="font-serif italic text-xs text-red-600 bg-red-50 p-2 border border-red-200">
              Hiện không có bàn nào còn trống trong quán!
            </p>
          ) : (
            <select
              value={targetTableId}
              onChange={(e) => setTargetTableId(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#124874] px-3 py-2 font-serif text-sm focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            >
              <option value="">-- Chọn bàn trống mục tiêu --</option>
              {availableTables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} - Khu vực: {t.zone} ({t.capacity || 4} chỗ ngồi)
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Transfer Reason */}
        <div className="space-y-1.5">
          <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase">
            Lý Do Chuyển Bàn:
          </label>
          <select
            value={transferReason}
            onChange={(e) => setTransferReason(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#124874] px-3 py-2 font-serif text-xs focus:outline-none focus:ring-1 focus:ring-[#CF373D]"
          >
            <option value="Khách muốn đổi vị trí">Khách muốn đổi vị trí ngồi thoáng hơn</option>
            <option value="Ghép bàn nhóm đông">Ghép bàn phục vụ nhóm đông người</option>
            <option value="Khách chuyển ra sân vườn">Khách muốn chuyển ra khu vực sân vườn</option>
            <option value="Khách lên ban công ngắm cảnh">Khách lên ban công tầng 2 ngắm cảnh</option>
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex justify-end gap-2 pt-3 border-t border-[#124874]">
          <button
            type="button"
            onClick={onClose}
            className="press-btn px-4 py-2 bg-white text-[#124874] border border-[#124874] font-cinzel text-xs font-bold hover:bg-[#FAF7F2] cursor-pointer"
          >
            HỦY BỎ
          </button>
          <button
            type="button"
            disabled={!targetTableId}
            onClick={handleConfirm}
            style={{ backgroundColor: '#124874', color: '#ffffff' }}
            className="press-btn px-6 py-2 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            XÁC NHẬN CHUYỂN BÀN
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default TableTransferModal;
