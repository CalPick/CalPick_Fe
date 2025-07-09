// src/components/calendar/ScheduleModal.jsx
import React from "react";

export default function ScheduleModal({ date, schedules, onClose }) {
  const formattedDate = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">{formattedDate} 일정</h2>

        {schedules.length === 0 ? (
          <p className="text-gray-500">일정이 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {schedules.map(({ id, title, startTime, endTime, isRepeating }) => {
              const start = new Date(startTime).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const end = new Date(endTime).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <li key={id} className="border rounded p-3 shadow-sm hover:shadow-md transition">
                  <div className="font-semibold">{title}</div>
                  <div className="text-sm text-gray-600">
                    {start} - {end} {isRepeating ? "(반복)" : ""}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
