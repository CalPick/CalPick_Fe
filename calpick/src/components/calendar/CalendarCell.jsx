import React from 'react';

export default function CalendarCell({ date, isCurrentMonth, onClick, children, noBorderRight, noBorderBottom }) {
  const isToday = date && new Date().toDateString() === date.toDateString();

  return (
    <div
      onClick={() => onClick?.(date)}
      className={`
        relative cursor-pointer overflow-hidden
        flex flex-col items-start justify-start aspect-square
        p-1.5 select-none
        ${isCurrentMonth ? 'text-black' : 'text-gray-300'}
        border-b-2 border-r-2  border-[#D3D3D3]
        ${noBorderRight ? 'border-r-0' : ''}
        ${noBorderBottom ? 'border-b-0' : ''}
      `}
      style={{ boxSizing: 'border-box' }}
    >
      {/* 날짜: 좌상단, 오늘이면 검은 원 */}
      <div className="relative z-10 mt-0.5 ml-0.5  text-[15px] leading-none">
        {date?.getDate() &&
          (isToday ? (
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black text-white ">
              {date.getDate()}
            </span>
          ) : (
            <span>{date.getDate()}</span>
          ))
        }
      </div>
      <div className="relative z-10 w-full mt-2">
        {children}
      </div>
    </div>
  );
}
