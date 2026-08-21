import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

/**
 * Custom Editorial DatePicker Component
 * Rendered via Portal with fixed coordinates so it always floats ON TOP of Modals with zero clipping!
 * Authentic vintage broadsheet calendar with Cerulean (#124874) & Jasper (#CF373D) styling.
 */
export const CustomDatePicker = ({
  value, // Date object or 'YYYY-MM-DD' string
  onChange,
  label,
  placeholder = 'Chọn ngày...',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, openUp: false });
  const triggerRef = useRef(null);
  const popupRef = useRef(null);

  // Parse initial selected date
  const parseDate = (val) => {
    if (!val) return new Date();
    if (val instanceof Date) return val;
    const parts = val.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
    return new Date();
  };

  const selectedDate = value ? parseDate(value) : null;
  const [viewDate, setViewDate] = useState(() => (selectedDate ? new Date(selectedDate) : new Date()));

  // Calculate coordinates to float cleanly on top of Modal
  const updateCoords = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const calendarWidth = 320;
    const calendarHeight = 360;
    
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < calendarHeight && rect.top > calendarHeight;

    let left = rect.left;
    if (left + calendarWidth > window.innerWidth - 16) {
      left = Math.max(16, window.innerWidth - calendarWidth - 16);
    }

    setCoords({
      top: openUp ? rect.top - 6 : rect.bottom + 6,
      left,
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

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        popupRef.current && !popupRef.current.contains(e.target)
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

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const dayHeaders = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  // Days in month calculation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDay = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    const yyyy = newDate.getFullYear();
    const mm = String(newDate.getMonth() + 1).padStart(2, '0');
    const dd = String(newDate.getDate()).padStart(2, '0');
    const formattedStr = `${yyyy}-${mm}-${dd}`;
    if (onChange) {
      onChange(formattedStr, newDate);
    }
    setIsOpen(false);
  };

  const handleQuickPreset = (presetType) => {
    const today = new Date();
    let target = new Date();
    if (presetType === 'today') {
      target = today;
    } else if (presetType === 'yesterday') {
      target.setDate(today.getDate() - 1);
    } else if (presetType === '7days') {
      target.setDate(today.getDate() - 7);
    } else if (presetType === 'startOfMonth') {
      target = new Date(today.getFullYear(), today.getMonth(), 1);
    }
    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, '0');
    const dd = String(target.getDate()).padStart(2, '0');
    setViewDate(target);
    if (onChange) {
      onChange(`${yyyy}-${mm}-${dd}`, target);
    }
    setIsOpen(false);
  };

  const formatDisplay = (d) => {
    if (!d) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // Render Calendar Grid cells
  const renderCalendarDays = () => {
    const cells = [];

    // 1. Prev month trailing days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const prevDay = daysInPrevMonth - i;
      cells.push(
        <div
          key={`prev-${prevDay}`}
          className="h-8 flex items-center justify-center font-mono text-xs text-gray-300 pointer-events-none"
        >
          {prevDay}
        </div>
      );
    }

    // 2. Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        today.getDate() === day &&
        today.getMonth() === currentMonth &&
        today.getFullYear() === currentYear;

      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getFullYear() === currentYear;

      cells.push(
        <button
          key={`day-${day}`}
          type="button"
          onClick={() => handleSelectDay(day)}
          style={isSelected ? { backgroundColor: '#124874', color: '#ffffff' } : {}}
          className={`h-8 flex items-center justify-center font-mono text-xs font-bold transition-all relative cursor-pointer ${
            isSelected
              ? 'shadow-xs scale-105 z-10'
              : 'hover:bg-[#FAF7F2] text-[#161413]'
          } ${isToday && !isSelected ? 'border border-[#CF373D] text-[#CF373D]' : ''}`}
        >
          <span>{day}</span>
          {isToday && (
            <span
              className={`absolute bottom-1 w-1 h-1 rounded-full ${
                isSelected ? 'bg-white' : 'bg-[#CF373D]'
              }`}
            ></span>
          )}
        </button>
      );
    }

    return cells;
  };

  return (
    <div className={`relative font-body ${className}`}>
      {label && (
        <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1.5">
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
        <div className="flex items-center gap-2">
          <i className="fa-regular fa-calendar-check text-[#124874] text-sm"></i>
          <span className="font-serif text-sm font-bold text-[#161413]">
            {selectedDate ? formatDisplay(selectedDate) : <span className="text-gray-400 font-normal">{placeholder}</span>}
          </span>
        </div>

        <span className="font-cinzel text-[10px] text-[#6E675F] uppercase font-bold tracking-wider">
          {selectedDate ? `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}` : 'LỊCH HỆ THỐNG'}
        </span>
      </button>

      {/* Floating Vintage Calendar Panel via Portal (Guaranteed to render ON TOP of Modal) */}
      {isOpen && ReactDOM.createPortal(
        <div 
          ref={popupRef}
          style={{
            position: 'fixed',
            top: coords.openUp ? undefined : `${coords.top}px`,
            bottom: coords.openUp ? `${window.innerHeight - coords.top}px` : undefined,
            left: `${coords.left}px`,
            width: '320px',
            zIndex: 100005,
          }}
          className="bg-[#FCFAF6] border-2 border-[#124874] shadow-[8px_8px_0px_rgba(18,72,116,0.95)] animate-editorial-in overflow-hidden font-body"
        >
          
          {/* Calendar Header Masthead */}
          <div className="bg-[#124874] text-white p-3 flex justify-between items-center border-b border-[#0D3656]">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/30 text-white transition-colors cursor-pointer"
              title="Tháng trước"
            >
              <i className="fa-solid fa-chevron-left text-xs"></i>
            </button>

            <div className="text-center font-display font-bold text-sm tracking-wide">
              <span>{monthNames[currentMonth].toUpperCase()} &bull; {currentYear}</span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/30 text-white transition-colors cursor-pointer"
              title="Tháng sau"
            >
              <i className="fa-solid fa-chevron-right text-xs"></i>
            </button>
          </div>

          {/* Quick Presets Bar */}
          <div className="grid grid-cols-4 gap-1 p-2 bg-[#FAF7F2] border-b border-[#D8D1C5] text-[10px] font-cinzel font-bold">
            <button
              type="button"
              onClick={() => handleQuickPreset('today')}
              className="py-1 px-1 bg-white hover:bg-[#124874] hover:text-white border border-[#D8D1C5] text-[#124874] transition-colors cursor-pointer"
            >
              HÔM NAY
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('yesterday')}
              className="py-1 px-1 bg-white hover:bg-[#124874] hover:text-white border border-[#D8D1C5] text-[#124874] transition-colors cursor-pointer"
            >
              HÔM QUA
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('7days')}
              className="py-1 px-1 bg-white hover:bg-[#124874] hover:text-white border border-[#D8D1C5] text-[#124874] transition-colors cursor-pointer"
            >
              7 NGÀY
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('startOfMonth')}
              className="py-1 px-1 bg-white hover:bg-[#124874] hover:text-white border border-[#D8D1C5] text-[#124874] transition-colors cursor-pointer"
            >
              ĐẦU THÁNG
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 p-2 border-b border-[#D8D1C5] bg-[#FAF7F2] text-center font-cinzel text-[10px] font-bold text-[#124874]">
            {dayHeaders.map((dh, idx) => (
              <div key={dh} className={idx === 0 ? 'text-[#CF373D]' : ''}>
                {dh}
              </div>
            ))}
          </div>

          {/* Calendar Day Matrix Grid */}
          <div className="grid grid-cols-7 gap-1 p-2 bg-[#FCFAF6]">
            {renderCalendarDays()}
          </div>

          {/* Footer Action Strip */}
          <div className="p-2 border-t border-[#D8D1C5] bg-[#FAF7F2] flex justify-between items-center text-[10px] font-serif text-[#6E675F]">
            <span>Ấn bản lịch Blend Roastery</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="font-cinzel text-[10px] font-bold text-[#CF373D] hover:underline cursor-pointer"
            >
              ĐÓNG [ESC]
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CustomDatePicker;
