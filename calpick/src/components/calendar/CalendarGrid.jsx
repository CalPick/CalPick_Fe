import React from "react";
import CalendarCell from "./CalendarCell";

export default function CalendarGrid({ dates, currentMonth, onDateClick }) {
  const totalCells = 42; // 6주 * 7일
  const firstDayWeekday = dates.length > 0 ? dates[0].getDay() : 0;

  const prefixDates = Array.from({ length: firstDayWeekday }).fill(null);
  const suffixDates = Array.from({ length: totalCells - prefixDates.length - dates.length }).fill(null);
  const allDates = [...prefixDates, ...dates, ...suffixDates];

  return (
    <div className="grid grid-cols-7 grid-rows-6 w-full h-full border-l-2 border-t-2 border-[#D3D3D3] bg-white">
      {allDates.map((date, idx) => {
        const isLastCol = idx % 7 === 6;  // 7열 중 마지막 열인지 확인
        const isLastRow = Math.floor(idx / 7) === 5;  // 6행 중 마지막 행인지 확인
        return (
          <CalendarCell
            key={idx}
            date={date}
            onClick={onDateClick}
            isCurrentMonth={date ? date.getMonth() === currentMonth : false}
            noBorderRight={isLastCol}
            noBorderBottom={isLastRow}
          />
        );
      })}
    </div>
  );
}
