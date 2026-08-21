import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/common/SectionHeader';
import StatusBadge from '../components/common/StatusBadge';
import PromoModal from '../components/promotions/PromoModal';
import Pagination from '../components/common/Pagination';
import { promotionsApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export const PromotionsView = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const { addToast } = useToast();

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const res = await promotionsApi.getAll();
      if (res.success) {
        setPromotions(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Lỗi tải danh sách khuyến mãi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleSavePromo = async (formData) => {
    try {
      if (editingPromo) {
        await promotionsApi.update(editingPromo.id, formData);
        addToast('Đã cập nhật điều kiện voucher!', 'success');
      } else {
        await promotionsApi.create(formData);
        addToast('Đã phát hành mã voucher mới!', 'success');
      }
      setIsModalOpen(false);
      setEditingPromo(null);
      fetchPromotions();
    } catch (err) {
      addToast(err.message || 'Lỗi khi lưu voucher', 'error');
    }
  };

  const handleDeletePromo = async (id, code) => {
    if (!window.confirm(`Xác nhận hủy phát hành mã khuyến mãi "${code}"?`)) return;
    try {
      await promotionsApi.delete(id);
      addToast(`Đã thu hồi voucher ${code}`, 'success');
      fetchPromotions();
    } catch (err) {
      addToast(err.message || 'Không thể xóa voucher', 'error');
    }
  };

  const activeCount = promotions.filter(p => p.status === 'Đang chạy').length;

  return (
    <div className="font-body animate-editorial-in text-brand-dark space-y-6">
      <SectionHeader 
        sectionNo="MỤC VI &bull; PHIẾU GIẢM GIÁ & CHIẾN DỊCH" 
        title="Chiến Dịch Ưu Đãi & Phát Hành Voucher" 
        subtitle="Quản lý mã ưu đãi, điều kiện áp dụng cho từng đơn hàng và hạn sử dụng cho các chương trình tri ân." 
        action={
          <button 
            onClick={() => {
              setEditingPromo(null);
              setIsModalOpen(true);
            }}
            className="press-btn px-5 py-2.5 bg-jasper text-white font-cinzel text-xs font-bold hover:bg-jasper-dark transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-stamp"></i> PHÁT HÀNH VOUCHER MỚI
          </button>
        }
      />
      
      {/* Banner info */}
      <div className="editorial-paper p-4 bg-brand-paperLight flex items-center justify-between border-l-4 border-l-jasper">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-ticket-simple text-2xl text-jasper"></i>
          <div>
            <p className="font-serif font-bold text-cerulean">
              Đang có <span className="font-mono text-jasper">{activeCount}</span> mã voucher hiệu lực trong hệ thống.
            </p>
            <p className="text-xs text-gray-500 font-serif italic">Các voucher tự động kiểm tra điều kiện tại màn hình thu ngân.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-12 bg-white editorial-paper">
          <i className="fa-solid fa-stamp fa-spin text-3xl text-jasper mb-2"></i>
          <p className="font-serif italic text-gray-600">Đang tải danh sách voucher phát hành...</p>
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center p-12 bg-white editorial-paper">
          <p className="font-serif italic text-gray-600">Chưa có chương trình khuyến mãi nào.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="editorial-table-scroll p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((p) => (
                <div 
                  key={p.id} 
                  className={`perforated-ticket editorial-card-press p-0 flex flex-col justify-between overflow-hidden ${
                    p.status === 'Đã kết thúc' ? 'opacity-60 grayscale' : ''
                  }`}
                >
                  {/* Ticket Upper Stamped Header in Cerulean Blue */}
                  <div className="bg-cerulean text-white p-4 text-center border-b-2 border-dashed border-brand-borderLight relative">
                    <span className="font-cinzel text-[9px] tracking-widest text-brand-gold uppercase block mb-1">
                      OFFICIAL BLEND VOUCHER &bull; NO. #{p.id}
                    </span>
                    <h3 className="font-mono text-3xl font-black tracking-widest text-white uppercase">
                      {p.code}
                    </h3>
                  </div>

                  {/* Scissor cutting line */}
                  <div className="border-t border-dashed border-cerulean py-0.5 text-center text-[10px] text-gray-400 font-mono">
                    ✂ - - - - - - - - - - - - - - - - - - - - - - - - -
                  </div>

                  {/* Ticket Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <p className="font-display font-black text-2xl text-jasper">{p.discount}</p>
                        <StatusBadge status={p.status} />
                      </div>

                      {p.condition && (
                        <div className="p-2.5 bg-brand-paperDark/60 border border-brand-borderLight text-xs text-gray-700 font-serif mb-3">
                          <strong>Điều kiện:</strong> {p.condition}
                        </div>
                      )}

                      <p className="text-xs font-mono text-gray-500 font-bold uppercase tracking-wide">
                        <i className="fa-regular fa-clock mr-1 text-jasper"></i>HSD: {p.expiry}
                      </p>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-4 pt-3 border-t border-brand-borderLight flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingPromo(p);
                          setIsModalOpen(true);
                        }}
                        className="press-btn px-3 py-1 bg-white text-cerulean font-cinzel text-xs font-bold hover:bg-cerulean hover:text-white"
                      >
                        <i className="fa-solid fa-pen-nib mr-1 text-jasper"></i> SỬA
                      </button>
                      <button 
                        onClick={() => handleDeletePromo(p.id, p.code)}
                        className="press-btn px-2.5 py-1 bg-white text-jasper font-cinzel text-xs font-bold hover:bg-jasper hover:text-white"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Footer */}
          <div className="editorial-paper overflow-hidden bg-white">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(promotions.length / itemsPerPage) || 1}
              totalItems={promotions.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              itemsPerPageOptions={[6, 9, 12, 18, 30]}
            />
          </div>
        </div>
      )}

      <PromoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPromo(null);
        }}
        onSave={handleSavePromo}
        editingPromo={editingPromo}
      />
    </div>
  );
};

export default PromotionsView;
