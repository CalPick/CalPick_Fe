import React from "react";
import CalendarCell from "./CalendarCell";

export default function CalendarGrid({ dates, currentMonth, onDateClick }) {
  // 6주 * 7일 = 42 칸
  const firstDayWeekday = dates.length > 0 ? dates[0].getDay() : 0;
  const totalCells = 42;

  const prefixDates = Array.from({ length: firstDayWeekday }).fill(null);
  const suffixDates = Array.from({ length: totalCells - prefixDates.length - dates.length }).fill(null);

  const allDates = [...prefixDates, ...dates, ...suffixDates];

  return (
    <div className="grid grid-cols-7 grid-rows-6 w-full h-full border-t border-l border-[#bcbcbc]">
      {allDates.map((date, idx) => (
        <CalendarCell
          key={idx}
          date={date}
          onClick={onDateClick}
          isCurrentMonth={date ? date.getMonth() === currentMonth : false}
        />
      ))}
    </div>
  );
}
