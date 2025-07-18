import React, { forwardRef } from 'react';
import ScheduleTag from "../common/ScheduleTag";

const pad = n => n.toString().padStart(2, "0");
function getDateStr(date) {
  return date
    ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    : "";
}

const CalendarCell = forwardRef(function CalendarCell(
  {
    date,
    isCurrentMonth,
    onClick,
    isSelected,
    children,
    noBorderRight,
    noBorderBottom,
    schedules = [],
  },
  ref
) {
  const isToday = date && new Date().toDateString() === date?.toDateString();
  const dateStr = getDateStr(date);
  const todaySchedules = date
    ? schedules.filter(sch => sch.startTime.startsWith(dateStr))
    : [];
  const shown = todaySchedules.slice(0, 3);
  const hiddenCount = todaySchedules.length > 3 ? todaySchedules.length - 3 : 0;

  return (
    <div
      ref={ref}
      onClick={e => { if (date) onClick?.(date, ref); }}
      className={`
        relative cursor-pointer overflow-hidden
        flex flex-col items-start justify-start aspect-square
        p-1.5 select-none
        ${isCurrentMonth ? 'text-black' : 'text-gray-300'}
        border-b-2 border-r-2 border-[#D3D3D3]
        ${noBorderRight ? 'border-r-0' : ''}
        ${noBorderBottom ? 'border-b-0' : ''}
        ${isSelected ? 'bg-gray-300' : 'bg-white'}
        transition-colors duration-100
      `}
      style={{ boxSizing: 'border-box' }}
    >
      <div className="relative z-10 mt-0.5 ml-0.5 text-[15px] leading-none">
        {date?.getDate() &&
          (isToday ? (
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black text-white">
              {date.getDate()}
            </span>
          ) : (
            <span>{date.getDate()}</span>
          ))
        }
      </div>
      <div className="relative z-10 w-full mt-2">
        {shown.map(sch => (
          <ScheduleTag key={sch.id} title={sch.title} color={sch.color} />
        ))}
        {hiddenCount > 0 && (
          <div className="text-xs mt-1 ml-1 text-gray-500 font-bold">
            +{hiddenCount}
          </div>
        )}
        {children}
      </div>
    </div>
  );
});
export default CalendarCell;
