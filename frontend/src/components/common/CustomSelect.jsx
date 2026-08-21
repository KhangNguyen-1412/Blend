import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

/**
 * Custom Editorial Dropdown / Select Component
 * Rendered via Portal with fixed coordinates so it always floats ON TOP of Modals with zero clipping!
 * Styled with classic newspaper broadsheet aesthetics, Cerulean & Jasper brand colors.
 */
export const CustomSelect = ({
  options = [], // [{ value: '...', label: '...', icon?: '...', badge?: '...' }] or array of strings
  value,
  onChange,
  placeholder = 'Chọn một mục...',
  label,
  icon,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, openUp: false });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Normalize options to object format
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return opt;
    }
    return { value: opt, label: String(opt) };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Filter options if search term exists
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate coordinates to float cleanly on top of Modal
  const updateCoords = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < 250 && rect.top > 250;

    setCoords({
      top: openUp ? rect.top - 6 : rect.bottom + 6,
      left: rect.left,
      width: Math.max(rect.width, 180),
      openUp
    });
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      const handleScrollOrResize = () => updateCoords();
      window.addEventListener('resize', handleScrollOrResize);
      window.addEventListener('scroll', handleScrollOrResize, true);
      return () => {
        window.removeEventListener('resize', handleScrollOrResize);
        window.removeEventListener('scroll', handleScrollOrResize, true);
      };
    }
  }, [isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optValue) => {
    if (onChange) {
      onChange(optValue);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative font-body ${className}`}>
      {label && (
        <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
          {icon && <i className={`fa-solid ${icon} mr-1.5 text-[#CF373D]`}></i>}
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            updateCoords();
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full bg-[#FCFAF6] border text-left px-3.5 py-2.5 transition-all flex items-center justify-between shadow-xs ${
          isOpen
            ? 'border-[#124874] ring-2 ring-[#CF373D]/30 shadow-[2px_2px_0px_rgba(18,72,116,0.95)]'
            : 'border-[#124874] hover:border-[#CF373D]'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'cursor-pointer'}`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedOption?.icon && (
            <i className={`fa-solid ${selectedOption.icon} text-[#124874] text-xs`}></i>
          )}
          <span className="font-serif text-sm font-bold text-[#161413] truncate">
            {selectedOption ? selectedOption.label : <span className="text-gray-400 font-normal">{placeholder}</span>}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 text-[#124874] ml-2">
          {selectedOption?.badge && (
            <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#FAF7F2] border border-[#D8D1C5] text-gray-600 font-bold">
              {selectedOption.badge}
            </span>
          )}
          <i
            className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${
              isOpen ? 'transform rotate-180 text-[#CF373D]' : ''
            }`}
          ></i>
        </div>
      </button>

      {/* Floating Dropdown Panel via Portal (Guaranteed to render ON TOP of Modal) */}
      {isOpen && ReactDOM.createPortal(
        <div 
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: coords.openUp ? undefined : `${coords.top}px`,
            bottom: coords.openUp ? `${window.innerHeight - coords.top}px` : undefined,
            left: `${coords.left}px`,
            width: `${coords.width}px`,
            zIndex: 100005,
          }}
          className="bg-[#FCFAF6] border-2 border-[#124874] shadow-[8px_8px_0px_rgba(18,72,116,0.95)] animate-editorial-in overflow-hidden max-h-64 flex flex-col font-body"
        >

          {/* Search Filter if list has more than 5 options */}
          {normalizedOptions.length > 5 && (
            <div className="p-2 border-b border-[#D8D1C5] bg-[#FAF7F2] flex-shrink-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm tùy chọn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-[#124874] pl-7 pr-2 py-1 text-xs font-serif text-[#161413] focus:outline-none focus:ring-1 focus:ring-[#CF373D]"
                  autoFocus
                />
                <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-2 text-[#124874] text-[10px]"></i>
              </div>
            </div>
          )}

          {/* Options Scroll List */}
          <div className="overflow-y-auto flex-1 divide-y divide-[#D8D1C5]/60">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs font-serif italic text-gray-500">
                Không tìm thấy mục phù hợp
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    style={isSelected ? { backgroundColor: '#124874', color: '#ffffff' } : {}}
                    className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center justify-between text-xs font-serif cursor-pointer ${
                      isSelected
                        ? 'font-bold'
                        : 'hover:bg-[#FAF7F2] text-[#161413]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon && (
                        <i
                          className={`fa-solid ${opt.icon} text-xs ${
                            isSelected ? 'text-white' : 'text-[#124874]'
                          }`}
                        ></i>
                      )}
                      <span className="truncate">{opt.label}</span>
                    </div>

                    {isSelected && (
                      <i className="fa-solid fa-check text-white text-xs ml-2"></i>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CustomSelect;
