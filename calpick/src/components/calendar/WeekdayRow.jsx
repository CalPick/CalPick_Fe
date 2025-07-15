// src/components/calendar/WeekdayRow.jsx
import React from "react";

export default function WeekdayRow() {
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-2">
      {days.map((day) => (
        <div key={day}>{day}</div>
      ))}
    </div>
  );
}
