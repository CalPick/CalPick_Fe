import React, { useRef } from "react";
import CalendarCell from "./CalendarCell";

export default function CalendarGrid({
  dates,
  currentMonth,
  onDateClick,
  schedules,
  selectedDate,
  setCellRef,
}) {
  const totalCells = 42; // 6주 * 7일
  const firstDayWeekday = dates.length > 0 ? dates[0].getDay() : 0;

  const prefixDates = Array.from({ length: firstDayWeekday }).fill(null);
  const suffixDates = Array.from({ length: totalCells - prefixDates.length - dates.length }).fill(null);
  const allDates = [...prefixDates, ...dates, ...suffixDates];

  return (
    <div className="grid grid-cols-7 grid-rows-6 w-full h-full border-l-2 border-t-2 border-[#D3D3D3] bg-white">
      {allDates.map((date, idx) => {
        const isLastCol = idx % 7 === 6;
        const isLastRow = Math.floor(idx / 7) === 5;
        const cellRef = useRef();

        // selectedDate가 같은 날이면 isSelected
        const isSelected = date && selectedDate && date.toDateString() === selectedDate.toDateString();

        // 셀 렌더링
        return (
          <CalendarCell
            key={idx}
            ref={cellRef}
            date={date}
            onClick={(d) => setCellRef(d, cellRef)}
            isCurrentMonth={date ? date.getMonth() === currentMonth : false}
            noBorderRight={isLastCol}
            noBorderBottom={isLastRow}
            isSelected={isSelected}
          />
        );
      })}
    </div>
  );
}
