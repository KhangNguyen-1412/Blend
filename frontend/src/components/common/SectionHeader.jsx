import React from 'react';

export const SectionHeader = ({ sectionNo, title, subtitle, action }) => (
  <div className="mb-8 font-body">
    {/* Top Editorial Eyebrow */}
    <div className="flex items-center justify-between text-xs uppercase tracking-widest text-blend-muted font-cinzel mb-1">
      <span className="flex items-center gap-2">
        <span className="text-blend-jasper font-bold font-mono">§</span> {sectionNo || 'THE BLEND GAZETTE'}
      </span>
      <span className="font-mono text-[11px] text-gray-500">SAIGON ROASTERY &bull; 2026</span>
    </div>

    {/* Main Headline Title with Cerulean Border */}
    <div className="border-t-2 border-b-2 border-blend-cerulean py-3.5 flex flex-col md:flex-row md:items-end justify-between gap-4 bg-blend-paperLight px-5 border-double shadow-xs">
      <div>
        <h2 className="font-display text-3xl md:text-4xl text-blend-cerulean font-bold tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="font-body text-gray-600 mt-1.5 text-base md:text-lg italic font-serif leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>

    {/* Ornate Divider Flourish with Jasper Red */}
    <div className="flex items-center justify-center my-2 text-blend-jasper/70 text-xs">
      <span className="h-[1px] bg-blend-borderLight flex-1"></span>
      <span className="px-3 font-cinzel text-[10px] tracking-widest text-blend-jasper">✦ ❖ ✦</span>
      <span className="h-[1px] bg-blend-borderLight flex-1"></span>
    </div>
  </div>
);

export default SectionHeader;
