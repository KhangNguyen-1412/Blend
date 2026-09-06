import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../../components/common/StatusBadge';

describe('StatusBadge UI Component', () => {
  it('renders green stamp for completed/active statuses', () => {
    const { container } = render(<StatusBadge status="Đã hoàn thành" />);
    expect(screen.getByText('Đã hoàn thành')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('stamp-green');
  });

  it('renders amber stamp for pending and warning statuses', () => {
    const { container } = render(<StatusBadge status="Chờ xác nhận" />);
    expect(screen.getByText('Chờ xác nhận')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('stamp-amber');
  });

  it('renders red stamp for cancelled and out-of-stock statuses', () => {
    const { container } = render(<StatusBadge status="Hết hàng" />);
    expect(screen.getByText('Hết hàng')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('stamp-red');
  });

  it('formats inventory ok status to "ĐỦ DÙNG"', () => {
    const { container } = render(<StatusBadge status="ok" />);
    expect(screen.getByText('ĐỦ DÙNG')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('stamp-green');
  });

  it('formats inventory warning status to "CẦN NHẬP"', () => {
    const { container } = render(<StatusBadge status="warning" />);
    expect(screen.getByText('CẦN NHẬP')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('stamp-amber');
  });
});
