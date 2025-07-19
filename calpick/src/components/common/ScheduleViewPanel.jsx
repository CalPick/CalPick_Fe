import React, { useEffect, useRef, useState } from "react";
import TimeTableImg from "../../assets/Frame 18.svg";

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6);
const COL_WIDTH = 120;
const CELL_HEIGHT = 18;
const FRAME_WIDTH = COL_WIDTH * 2 + 50;
const FRAME_HEIGHT = CELL_HEIGHT * HOURS.length;

const SCHEDULE_LEFTS = [42, 165];

const pad = n => n.toString().padStart(2, "0");
const pad2 = n => n.toString().padStart(2, "0");

function getShortDateStr(d) {
  return `${pad2(d.getFullYear() % 100)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function getScheduleBars(startTime, endTime, title, color) {
  const [_, startHM] = startTime.split("T");
  const [__, endHM] = endTime.split("T");
  let [sh, sm] = startHM.split(":").map(Number);
  let [eh, em] = endHM.split(":").map(Number);

  if (sh < 6) { sh = 6; sm = 0; }
  if (eh > 24) { eh = 24; em = 0; }
  if (eh === 24 && em === 0) eh = 23, em = 59;

  const startIdx = (sh - 6) * 2 + (sm >= 30 ? 1 : 0);
  let endIdx = (eh - 6) * 2 + (em > 0 ? (em >= 30 ? 1 : 0) : 0);
  if (eh === 23 && em === 59) endIdx = (23 - 6) * 2 + 1;

  const bars = [];
  for (let i = startIdx; i < endIdx; i++) {
    const isRightColumn = SCHEDULE_LEFTS[i % 2] === 165;
    bars.push({
      left: SCHEDULE_LEFTS[i % 2] -1,
      top: i * (CELL_HEIGHT / 2) + (isRightColumn ? -9 : 0),
      width: COL_WIDTH + 3,
      height: (CELL_HEIGHT / 2) + 9,
      color,
      title: i === startIdx ? title : "",
    });
  }
  return bars;
}


export default function ScheduleViewPanel({
  open,
  anchorRef,
  date,
  schedules,
  onAddClick,
  onClose,
  onEditClick
}) {
  const panelRef = useRef(null);
  const [show, setShow] = useState(false);

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

  const daySchedules = (schedules || []).filter(sch => {
    const dt = new Date(sch.startTime);
    return (
      dt.getFullYear() === date.getFullYear() &&
      dt.getMonth() === date.getMonth() &&
      dt.getDate() === date.getDate()
    );
  });

  const bars = daySchedules.flatMap((sch, idx) =>
    getScheduleBars(sch.startTime, sch.endTime, sch.title, sch.color).map((bar, barIdx) => ({
      ...bar,
      schedule: sch, 
      key: `${idx}-${barIdx}`
    }))
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={`
          bg-white rounded-2xl  shadow-2xl border border-gray-200 flex flex-col p-6
          transition-all duration-300 z-50
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}
        `}
        style={{ width: 380, height: 545, minWidth: 380, minHeight: 545, position: "fixed" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="ml-0 mt-0 pl-1 text-lg font-bold">
            <span className="flex items-center gap-2">
              {getShortDateStr(date)}
            </span>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 ml-2">
            <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative mx-auto my-2" style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}>
          <img
            src={TimeTableImg}
            alt="시간표"
            style={{
              width: FRAME_WIDTH,
              height: FRAME_HEIGHT,
              objectFit: "contain",
              borderRadius: 8,
              background: "#fff",
              
            }}
            draggable={false}
          />
          {bars.map(({ left, top, width, height, color, title, key, schedule }) => (
            <div
              key={key}
              onClick={() => onEditClick?.(schedule)}
              style={{
                position: "absolute",
                left, top, width, height,
                background: color,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                fontWeight: 600,
                fontSize: 16,
                color: "#222",
                overflow: "hidden",
                zIndex: 1,
                padding: "0 8px",
                textAlign: "left",
                cursor: "pointer"
              }}
            >
              <span
                style={{
                  width: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {title}
              </span>
            </div>
          ))}
        </div>
        <button
          className="w-full py-2 rounded-md mt-6 bg-[#D0D0D0] text-black font-bold cursor-pointer"
          onClick={onAddClick}
          type="button"
        >
          추가하기
        </button>
      </div>
    </>
  );
}
