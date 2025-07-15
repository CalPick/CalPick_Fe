import React, { useRef, useEffect, useState } from "react";
import calendaricon from '../../assets/calendaricon.svg';
import clockicon from '../../assets/timeicon.svg';

const COLORS = [
  { name: "red", bg: "bg-red-300", value: "#f87171" },
  { name: "yellow", bg: "bg-yellow-200", value: "#fde68a" },
  { name: "green", bg: "bg-green-200", value: "#bbf7d0" },
  { name: "blue", bg: "bg-sky-200", value: "#bae6fd" },
];
const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function clampStartTime(val) {
  if (!/^\d{2}:\d{2}$/.test(val)) return "";
  let [h, m] = val.split(":").map(Number);
  if (h < 6) return "06:00";
  if (h > 23 || (h === 23 && m > 59)) return "23:59";
  if (h === 23 && m > 59) m = 59;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
function clampEndTime(val) {
  if (!/^\d{2}:\d{2}$/.test(val)) return "";
  let [h, m] = val.split(":").map(Number);
  if (h < 6) return "06:01";
  if (h === 6 && m < 1) return "06:01";
  if (h > 24) return "24:00";
  if (h === 24) return m === 0 ? "24:00" : "24:00";
  if (h === 23 && m > 59) m = 59;
  if (h < 24 && m > 59) m = 59;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
function handleTimeInput(setter, clamp) {
  return (e) => {
    let val = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
    if (val.length > 2) val = val.slice(0, 2) + ":" + val.slice(2);
    if (val.length === 5) val = clamp(val);
    setter(val);
  };
}

export default function ScheduleFormPanel({
  open, anchorRef, date, setDate, onClose, onAddSchedule
}) {
  const panelRef = useRef(null);

  const pad = n => n.toString().padStart(2, "0");
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  const [title, setTitle] = useState("");
  const [color, setColor] = useState(COLORS[0].value);
  const [repeat, setRepeat] = useState(false);
  const [repeatType, setRepeatType] = useState("weekly");
  const [repeatEnd, setRepeatEnd] = useState("");
  const [repeatMonths, setRepeatMonths] = useState("");
  const [repeatDays, setRepeatDays] = useState([date.getDay()]);
  const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
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
  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 200);
  };

  useEffect(() => {
    function handle(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) handleClose();
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose, open]);

  const toggleDay = (d) => {
    setRepeatDays(arr => arr.includes(d) ? arr.filter(x => x !== d) : [...arr, d]);
  };

  useEffect(() => {
    if (repeat && repeatMonths && Number(repeatMonths) > 0) {
      const d = new Date(dateStr);
      d.setMonth(d.getMonth() + Number(repeatMonths) + 1, 0);
      setRepeatEnd(d.toISOString().slice(0, 10));
    }
  }, [repeat, repeatMonths, dateStr]);

  useEffect(() => {
    if (
      /^\d{2}:\d{2}$/.test(startTime) &&
      /^\d{2}:\d{2}$/.test(endTime)
    ) {
      if (startTime >= endTime) {
        let [h, m] = startTime.split(":").map(Number);
        m += 1;
        if (m >= 60) {
          h += 1;
          m = 0;
        }
        if (h > 24 || (h === 24 && m > 0)) {
          setEndTime("24:00");
        } else {
          const newEnd = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
          setEndTime(newEnd > "24:00" ? "24:00" : newEnd);
        }
      }
    }
  }, [startTime, endTime]);

  // -------------------------------
  // 🔥 핵심: 일정 등록 API 호출
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 시작/종료 시간 포맷 생성
    const dateISO = dateStr; // yyyy-mm-dd
    // 종일이면 06:00~24:00, 아니면 입력값
    const start = allDay ? "06:00" : startTime;
    const end = allDay ? "24:00" : endTime;

    // yyyy-mm-ddTHH:MM:SS 형식
    function toISO(dateStr, timeStr) {
      return `${dateStr}T${timeStr.length === 5 ? timeStr : "00:00"}:00`;
    }
    const newSchedule = {
      title,
      startTime: toISO(dateISO, start),
      endTime: toISO(dateISO, end),
      isRepeating: repeat,
    };

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const token = localStorage.getItem("token"); // 토큰 저장 위치에 맞게 수정
      const res = await fetch(`${baseUrl}/api/schedules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([newSchedule]),
      });
      if (!res.ok) {
        // 응답이 없거나, json이 아닌 경우
         let errMsg = "일정 등록 실패";
          try {
             const err = await res.json();
             errMsg = err.message || errMsg;
            } catch {}
            alert(errMsg);
        return;
      }
      const data = await res.json();
      console.log("일정 등록 성공:", data);
      onAddSchedule?.(data); // 필요 시 등록된 데이터 부모로 전달
      onClose();
    } catch (error) {
      alert("네트워크 오류로 일정 등록에 실패했습니다.");
      console.error(error);
    }
  };

  const canSubmit =
    !!title &&
    (allDay || (
      startTime && endTime &&
      startTime < endTime &&
      /^\d{2}:\d{2}$/.test(startTime) &&
      /^\d{2}:\d{2}$/.test(endTime)
    ));

  if (!open || !anchorRef?.current) return null;

  // 체크 SVG
  function CheckSvg() {
    return (
      <svg
        className="w-6 h-6 absolute left-0 top-0 pointer-events-none"
        viewBox="0 0 24 24"
        fill="none"
        stroke="black"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 13l4 4 8-8" />
      </svg>
    );
  }

  function Checkbox({ checked, onChange }) {
    return (
      <span className="relative flex-shrink-0 w-6 h-6 flex items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-6 h-6 border border-[#E0E0E0] rounded-lg bg-white appearance-none checked:bg-white checked:border-black checked:border-1 focus:outline-none relative transition duration-150"
          style={{ WebkitAppearance: "none", appearance: "none" }}
        />
        {checked && <CheckSvg />}
      </span>
    );
  }

  return (
    <>
      {/* 오버레이 */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={handleClose}
      />
      {/* 패널 */}
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
          <div className="text-lg font-bold">일정 등록</div>
          <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-700 ml-2">
            <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* 컬러 팔레트 */}
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="border border-[#E8E8E8] rounded-[9px] px-3 py-1 h-[38px] text-[16px] placeholder-[#AEAEB2] focus:outline-black focus:outline-[0.5] w-55"
              placeholder="제목"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            {/* 반복 체크박스 */}
            <label className="flex items-center gap-1.5 ml-2 font-medium cursor-pointer">
              <Checkbox checked={repeat} onChange={e => setRepeat(e.target.checked)} />
              <span className="text-black font-normal text-lg">반복</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            {COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className={`w-9 h-9 rounded-full border-1 ${c.bg} flex items-center justify-center ${color === c.value ? "ring-[0.4]" : "border-gray-200"}`}
                aria-label={c.name}
              >
              </button>
            ))}
          </div>
          {/* 날짜 항상 노출, 반복이든 아니든 */}
          <div className="flex items-center mb-1 mt-1">
            <img src={calendaricon} alt="달력" className= "w-6 h-6 mr-[19px]" draggable={false} />
            <input
              type="date"
              className="text-[#AEAEB2] text-[16px] border border-[#E8E8E8] rounded-[9px] px-2 py-[6px]  focus:outline-none bg-transparent cursor-pointer"
              style={{ width: "140px" }}
              value={dateStr}
              onChange={e => setDate?.(new Date(e.target.value))}
            />
          </div>
          {/* 반복 옵션 */}
          {repeat && (
            <>
              <div className="flex gap-2 items-center">
                <div className="flex-1 flex items-center border rounded-md px-2 py-2">
                  <img src={calendaricon} alt="달력" className="w-6 h-6 mr-2" draggable={false} />
                  <input
                    type="date"
                    className="flex-1 bg-transparent focus:outline-none"
                    value={dateStr}
                    onChange={e => setDate?.(new Date(e.target.value))}
                  />
                </div>
                <span className="mx-2 text-gray-400">~</span>
                <div className="flex-1 flex items-center gap-1">
                  <input
                    type="date"
                    className="flex-1 border rounded-md px-2 py-2 bg-transparent focus:outline-none"
                    value={repeatEnd}
                    min={dateStr}
                    onChange={e => setRepeatEnd(e.target.value)}
                    placeholder="종료일"
                  />
                  <span className="text-xs text-gray-400">또는</span>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    className="w-12 border rounded px-1 py-1 text-right focus:outline-none"
                    placeholder="개월"
                    value={repeatMonths}
                    onChange={e => setRepeatMonths(e.target.value)}
                  />
                  <span className="text-xs text-gray-400">개월</span>
                </div>
              </div>
              {/* 반복 타입 */}
              <div className="flex gap-2">
                <select
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={repeatType}
                  onChange={e => setRepeatType(e.target.value)}
                >
                  <option value="weekly">매주</option>
                  <option value="biweekly">격주</option>
                  <option value="monthly">매월</option>
                </select>
              </div>
              {/* 반복 요일 선택 */}
              <div className="flex justify-between">
                {DAYS.map((d, idx) => (
                  <button
                    type="button"
                    key={d}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${repeatDays.includes(idx) ? 'bg-black text-white' : 'bg-white text-black border border-gray-200'}`}
                    onClick={() => toggleDay(idx)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* 시간/종일 한 줄 통합 */}
          <div className="flex items-center gap-3 mt-2">
            <img src={clockicon} alt="시계" className="w-6 h-6 mr-2" draggable={false} />
            {allDay ? (
              <div className="flex items-center px-6 py-2 rounded-[9px] border border-gray-200 text-black text-[17px]  select-none" style={{ width: "160px", height: "38px" }}>
                06:00 ~ 24:00
              </div>
            ) : (
              <div className="flex px-4 items-center rounded-[9px] border border-gray-200 bg-white" style={{ width: "160px", height: "38px" }}>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  className="w-[66px] pl-[8px] pr-[0px] py-0  focus:outline-none text-gray-700 placeholder-[#AEAEB2] text-[17px]"
                  value={startTime}
                  onChange={handleTimeInput(setStartTime, clampStartTime)}
                  placeholder="06:00"
                  autoComplete="off"
                />
                <span className="-ml-2 -mr-1 text-gray-400 h-[25px]">~</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  className="pl-2 pr-0 py-0 w-[62px] bg-transparent focus:outline-none  text-gray-700 placeholder-[#AEAEB2] text-[17px]"
                  value={endTime}
                  onChange={handleTimeInput(setEndTime, clampEndTime)}
                  placeholder="24:00"
                  autoComplete="off"
                />
              </div>
            )}
            {/* 종일 */}
            <label className="flex items-center gap-1.5 ml-2 text-lg font-medium cursor-pointer">
              <Checkbox checked={allDay} onChange={e => setAllDay(e.target.checked)} />
              <span className="text-black  text-lg font-normal">종일</span>
            </label>
          </div>
          {/* 등록 */}
          <button
            type="submit"
            className={`w-full py-2 rounded-md mt-3 transition font-bold text-[#00000033] ${
              canSubmit ? "bg-[#D0D0D0] text-black " : "bg-[#F4F4F4] cursor-not-allowed"
            }`}
            disabled={!canSubmit}
          >
            등록하기
          </button>
        </form>
      </div>
    </>
  );
}
