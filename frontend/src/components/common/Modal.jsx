import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-5xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Render directly to document.body via Portal to escape parent CSS transforms
  return createPortal(
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs font-body"
      onClick={onClose}
    >
      <div 
        className={`bg-[#FCFAF6] border-2 border-[#124874] w-full ${maxWidth} max-h-[92vh] flex flex-col shadow-[12px_12px_0px_rgba(18,72,116,0.95)] overflow-hidden animate-editorial-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header in Cerulean Blue */}
        <div 
          style={{ backgroundColor: '#124874', color: '#ffffff' }}
          className="px-6 py-3.5 flex justify-between items-center border-b-2 border-[#0D3656] flex-shrink-0"
        >
          <div className="flex items-center gap-3">
            <span 
              style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
              className="font-cinzel text-[9px] font-bold tracking-widest px-2 py-0.5 uppercase shadow-xs rounded-2xs"
            >
              HỒ SƠ DOCKET
            </span>
            <h3 className="font-display text-xl md:text-2xl font-bold text-white tracking-tight">
              {title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 w-8 h-8 rounded-xs flex items-center justify-center transition-colors text-lg"
            title="Đóng cửa sổ (ESC)"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Oxford Line Accent */}
        <div className="h-1 bg-[#CF373D] flex-shrink-0"></div>

        {/* Scrollable Form Body Container */}
        <div className="p-5 md:p-7 overflow-y-auto flex-1 text-[#161413] font-body custom-modal-scroll">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
