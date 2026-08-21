import React from 'react';

export const StatusBadge = ({ status }) => {
  let stampClass = "stamp-muted";
  let label = status;

  if (["Đã hoàn thành", "Còn hàng", "ok", "Đang chạy", "Hoạt động"].includes(status)) {
    stampClass = "stamp-green";
  } else if (["Đang pha chế", "Đang giao"].includes(status)) {
    stampClass = "stamp-navy";
  } else if (["Chờ xác nhận", "warning"].includes(status)) {
    stampClass = "stamp-amber";
  } else if (["Đã hủy", "Hết hàng", "Đã kết thúc", "Nghỉ việc"].includes(status)) {
    stampClass = "stamp-red";
  }

  // Label text formatting
  if (status === 'ok') label = 'ĐỦ DÙNG';
  if (status === 'warning') label = 'CẦN NHẬP';

  return (
    <span className={`ink-stamp ${stampClass} text-[11px]`}>
      {label}
    </span>
  );
};

export default StatusBadge;
