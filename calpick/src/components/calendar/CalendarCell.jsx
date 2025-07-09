import React from 'react';
import cellBg from '../../assets/calendar-cell.svg';

export default function CalendarCell({ date, isCurrentMonth, onClick, children }) {
  const isToday = date && new Date().toDateString() === date.toDateString();

  return (
    <div
  onClick={() => onClick?.(date)}
  className={`
    relative border-b border-r border-[#bcbcbc] cursor-pointer overflow-hidden
    flex flex-col items-end justify-start p-2 text-[14px]
    ${isCurrentMonth ? '' : 'text-gray-300'}
    ${isToday ? 'font-bold text-red-700' : ''}
  `}
  style={{ minHeight: 0, minWidth: 0 }}
>

      <img
        src={cellBg}
        alt="cell background"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />
      <div className="relative z-10">{date?.getDate()}</div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
