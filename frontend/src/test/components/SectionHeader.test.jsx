import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionHeader } from '../../components/common/SectionHeader';

describe('SectionHeader Editorial UI Component', () => {
  it('renders section title and default editorial eyebrow', () => {
    render(<SectionHeader title="SỔ ĐIỀU PHỐI ĐƠN HÀNG" />);
    expect(screen.getByRole('heading', { level: 2, name: /SỔ ĐIỀU PHỐI ĐƠN HÀNG/i })).toBeInTheDocument();
    expect(screen.getByText(/THE BLEND GAZETTE/i)).toBeInTheDocument();
  });

  it('renders custom section number and subtitle when provided', () => {
    render(
      <SectionHeader 
        sectionNo="MỤC V. QUẢN LÝ KHO"
        title="BẢNG ĐỊNH MỨC NGUYÊN LIỆU"
        subtitle="Theo dõi biến động và cảnh báo lượng hạt cà phê nhân xanh"
      />
    );
    expect(screen.getByText(/MỤC V\. QUẢN LÝ KHO/i)).toBeInTheDocument();
    expect(screen.getByText(/Theo dõi biến động và cảnh báo/i)).toBeInTheDocument();
  });

  it('renders action button element inside header when passed', () => {
    render(
      <SectionHeader
        title="THỰC ĐƠN ĐẶC TUYỂN"
        action={<button data-testid="add-btn">Thêm Món Mới</button>}
      />
    );
    expect(screen.getByTestId('add-btn')).toBeInTheDocument();
    expect(screen.getByText('Thêm Món Mới')).toBeInTheDocument();
  });
});
