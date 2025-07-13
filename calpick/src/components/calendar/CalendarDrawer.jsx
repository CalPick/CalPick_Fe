import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function CalendarDrawer({ date, schedules, onClose, onAddSchedule }) {
  // Drawer 애니메이션 상태
  const [show, setShow] = useState(false);
  const drawerRef = useRef();

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 400);
  };

  const pad = n => n.toString().padStart(2, "0");
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  const todaySchedules = (Array.isArray(schedules) ? schedules : []).filter(
    sch => sch.startTime && sch.startTime.slice(0, 10) === dateStr
  );

  // 폼 입력 상태
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // 일정 추가 (API 명세와 동일)
  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${API_URL}/api/schedules`,
        {
          title,
          startTime: `${dateStr}T${startTime}`,
          endTime: `${dateStr}T${endTime}`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle(""); setStartTime(""); setEndTime("");
      if (onAddSchedule) onAddSchedule();
    } catch {
      alert("일정 추가 실패!");
    }
  };

  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
      {/* 어두운 배경 */}
      <div
        className={`
          fixed inset-0 bg-gray-500/75 transition-opacity duration-400
          ${show ? "opacity-100" : "opacity-0"}
        `}
        onClick={handleClose}
      />
      {/* Drawer panel (slide-in/out) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16 pointer-events-auto">
          <div
            ref={drawerRef}
            className={`
              relative w-screen max-w-md bg-white shadow-xl flex flex-col h-full
              transform transition-transform duration-400
              ${show ? "translate-x-0" : "translate-x-full"}
            `}
          >
            {/* 닫기 버튼 */}
            <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
              <button
                type="button"
                className="relative rounded-md text-gray-300 hover:text-white focus-visible:ring-2 focus-visible:ring-white"
                onClick={handleClose}
              >
                <span className="sr-only">Close panel</span>
                <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Drawer 내용 */}
            <div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
              <div className="px-4 sm:px-6">
                <h2 className="text-base font-semibold text-gray-900">{dateStr} 일정</h2>
              </div>
              <div className="relative mt-6 flex-1 px-4 sm:px-6 space-y-4">
                {/* 일정 목록 */}
                {todaySchedules.length > 0 ? (
                  <ul className="mb-8 space-y-2">
                    {todaySchedules.map((sch) => (
                      <li key={sch.id} className="border rounded p-2 text-sm">
                        <div className="font-medium">{sch.title}</div>
                        <div className="text-xs text-gray-500">
                          {sch.startTime.slice(11, 16)} ~ {sch.endTime.slice(11, 16)}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mb-8 text-gray-400 text-sm">등록된 일정이 없습니다.</div>
                )}

                {/* 일정 등록 폼 */}
                <form onSubmit={handleAdd} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-32"
                      placeholder="일정 제목"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                    />
                    <input
                      type="time"
                      className="border rounded px-2 py-1 w-24"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      required
                    />
                    <input
                      type="time"
                      className="border rounded px-2 py-1 w-24"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="mt-2 px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 w-full">
                    일정 추가
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
