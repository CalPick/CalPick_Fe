import React, { useRef } from "react";
import CalendarCell from "./CalendarCell";

export default function CalendarGrid({
  dates,
  currentMonth,
  onDateClick,
  schedules,
  selectedDate,
}) {
  const totalCells = 42;
  const firstDayWeekday = dates.length > 0 ? dates[0].getDay() : 0;
  const prefixDates = Array.from({ length: firstDayWeekday }).fill(null);
  const suffixDates = Array.from({ length: totalCells - prefixDates.length - dates.length }).fill(null);
  const allDates = [...prefixDates, ...dates, ...suffixDates];

  // 각 셀 클릭: 일정 있으면 true, 없으면 false로 onDateClick에 전달
  function handleCellClick(date, ref) {
    if (!date) return;
    const dstr = date.toISOString().slice(0, 10);
    const hasSchedule = schedules.some(sch => sch.startTime && sch.startTime.startsWith(dstr));
    onDateClick(date, ref, hasSchedule);
  }

  return (
    <div className="grid grid-cols-7 grid-rows-6 w-full h-full border-l-2 border-t-2 border-[#D3D3D3] bg-white">
      {allDates.map((date, idx) => {
        const isLastCol = idx % 7 === 6;
        const isLastRow = Math.floor(idx / 7) === 5;
        const cellRef = useRef();
        const isSelected = date && selectedDate && date.toDateString() === selectedDate.toDateString();

        return (
          <CalendarCell
            key={idx}
            ref={cellRef}
            date={date}
            onClick={() => handleCellClick(date, cellRef)}
            isCurrentMonth={date ? date.getMonth() === currentMonth : false}
            noBorderRight={isLastCol}
            noBorderBottom={isLastRow}
            isSelected={isSelected}
            schedules={schedules}
          />
        );
      })}
    </div>
  );
}
