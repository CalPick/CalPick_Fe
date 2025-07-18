import React, { useRef, useEffect, useState } from "react";
import calendaricon from '../../assets/calendaricon.svg';
import clockicon from '../../assets/timeicon.svg';

const pad = n => n.toString().padStart(2, "0");
const pad2 = n => n.toString().padStart(2, "0");

function getShortDateStr(d) {
  return `${pad2(d.getFullYear() % 100)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function ScheduleViewPanel({
  open,
  anchorRef,
  date,
  schedules,
  onAddClick,
  onClose
}) {
  const panelRef = useRef(null);
  const [show, setShow] = useState(false);

  // 위치/애니메이션 동일
  useEffect(() => {
    if (open && anchorRef?.current && panelRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const panel = panelRef.current;
      const panelHeight = 545;
      const minMargin = 24;
      let top = rect.top;
      const windowH = window.innerHeight;
      if (top + panelHeight + minMargin > windowH) {
        top = Math.max(windowH - panelHeight - minMargin, minMargin);
      }
      if (top < minMargin) top = minMargin;
      const left = Math.max(rect.left - 410, 16);
      panel.style.position = "fixed";
      panel.style.top = `${top}px`;
      panel.style.left = `${left}px`;
      panel.style.zIndex = 1000;
      panel.style.height = "545px";
      panel.style.width = "380px";
    }
  }, [open, anchorRef]);

  useEffect(() => {
    if (open) setTimeout(() => setShow(true), 10);
    else setShow(false);
  }, [open]);

  useEffect(() => {
    function handle(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose, open]);

  if (!open || !anchorRef?.current) return null;

  // 해당 날짜의 일정만 추출 (date 객체가 같은 날인 것)
  const daySchedules = schedules.filter(sch => {
    const dt = new Date(sch.startTime);
    return (
      dt.getFullYear() === date.getFullYear() &&
      dt.getMonth() === date.getMonth() &&
      dt.getDate() === date.getDate()
    );
  });

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={`
          bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col p-6
          transition-all duration-300 z-50
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}
        `}
        style={{ width: 380, height: 545, minWidth: 380, minHeight: 545, position: "fixed" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-bold">
            <span className="flex items-center gap-2">
              <img src={calendaricon} alt="달력" className="w-6 h-6" />
              {getShortDateStr(date)}
            </span>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 ml-2">
            <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-2 mb-2 flex-1 overflow-y-auto">
          {daySchedules.length === 0 && (
            <div className="text-gray-400 py-10 text-center text-base">등록된 일정이 없습니다.</div>
          )}
          {daySchedules.map((sch, i) => {
            // 시간 표시
            let start = sch.startTime.slice(11, 16);
            let end = sch.endTime.slice(11, 16);
            return (
              <div
                key={i}
                className="flex items-center gap-2 border-b last:border-b-0 pb-2"
                style={{ background: sch.color, borderRadius: 8, padding: 8, marginBottom: 2, minHeight: 40 }}
              >
                <img src={clockicon} alt="" className="w-4 h-4 mr-1" />
                <span className="font-bold">{start}~{end}</span>
                <span className="font-semibold truncate ml-2">{sch.title}</span>
              </div>
            );
          })}
        </div>
        <button
          className="w-full py-2 rounded-md mt-3 bg-[#D0D0D0] text-black font-bold"
          onClick={onAddClick}
        >
          추가하기
        </button>
      </div>
    </>
  );
}
