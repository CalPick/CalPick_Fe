import React, { useRef, useEffect, useState } from "react";
import calendaricon from '../../assets/calendaricon.svg';
import clockicon from '../../assets/timeicon.svg';
import { getRepeatingDates } from "../common/repeatDateUtil";

const COLORS = [
  { name: "red", value: "#FF767680" },
  { name: "yellow", value: "#FCCB0580" },
  { name: "green", value: "#5FC59D80" },
  { name: "blue", value: "#4BB5DD80" },
];
const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const pad = n => n.toString().padStart(2, "0");
const pad2 = n => n.toString().padStart(2, "0");

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

  const getShortDateStr = (d) =>
    `${pad2(d.getFullYear() % 100)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const shortDateStr = getShortDateStr(date);

  const [title, setTitle] = useState("");
  const [color, setColor] = useState(COLORS[0].value);
  const [repeat, setRepeat] = useState(false);
  const [repeatType, setRepeatType] = useState("weekly");
  const [repeatMonths, setRepeatMonths] = useState("1");
  const [repeatDays, setRepeatDays] = useState([date.getDay()]);
  const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [show, setShow] = useState(false);
  const [showMonthInput, setShowMonthInput] = useState(true);
  const [calcEndDate, setCalcEndDate] = useState("");

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
    if (repeat) {
      setRepeatMonths((v) => v || "1");
      setShowMonthInput(false);
    } else {
      setRepeatMonths("");
      setCalcEndDate("");
      setShowMonthInput(true);
    }
  }, [repeat]);

  useEffect(() => {
    if (repeat && repeatMonths && Number(repeatMonths) > 0) {
      const d = new Date(dateStr);
      d.setMonth(d.getMonth() + Number(repeatMonths));
      setCalcEndDate(getShortDateStr(d));
    } else {
      setCalcEndDate("");
    }
  }, [repeat, repeatMonths, dateStr]);

  const handleMonthInput = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    if (val) {
      let num = Number(val);
      if (num > 24) num = 24;
      val = num.toString();
    }
    setRepeatMonths(val);
  };

  const handleMonthInputBlur = () => {
    if (repeatMonths && Number(repeatMonths) > 0) setShowMonthInput(false);
  };

  const handleShowMonthInput = () => {
    setShowMonthInput(true);
    setTimeout(() => {
      const input = document.getElementById("monthInputBox");
      if (input) input.focus();
    }, 50);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dateISO = dateStr;
    const start = allDay ? "06:00" : startTime;
    const end = allDay ? "24:00" : endTime;
    function toISO(dateStr, timeStr) {
      return `${dateStr}T${timeStr.length === 5 ? timeStr : "00:00"}:00`;
    }

    let schedulesToSave = [];
    if (repeat) {
      let endDate = new Date(date);
      endDate.setMonth(endDate.getMonth() + Number(repeatMonths));
      endDate.setHours(23, 59, 59, 999);

      const repeatDates = getRepeatingDates({
        startDate: date,
        endDate,
        repeatType,
        ...(repeatType !== "monthly" ? { repeatDays } : {}), // monthly면 repeatDays 안 넘김
      });

      schedulesToSave = repeatDates.map(d => ({
        title,
        startTime: toISO(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, start),
        endTime: toISO(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, end),
        isRepeating: true,
        color,
      }));
    } else {
      schedulesToSave = [{
        title,
        startTime: toISO(dateISO, start),
        endTime: toISO(dateISO, end),
        isRepeating: false,
        color,
      }];
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/api/schedules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(schedulesToSave),
      });
      if (!res.ok) {
        let errMsg = "일정 등록 실패";
        try {
          const err = await res.json();
          errMsg = err.message || errMsg;
        } catch {}
        alert(errMsg);
        return;
      }
      const data = await res.json();
      onAddSchedule?.(data);
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

  if (!open || !anchorRef?.current) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={handleClose}
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
          <div className="text-lg font-bold">일정 등록</div>
          <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-700 ml-2">
            <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
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
            <label className="flex items-center gap-1.5 ml-2 font-medium cursor-pointer">
              <Checkbox checked={repeat} onChange={e => setRepeat(e.target.checked)} />
              <span className="text-black font-normal text-lg">반복</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            {COLORS.map(c => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.value)}
                style={{ background: c.value }}
                className={`w-9 h-9 rounded-full flex items-center justify-center ${color === c.value ? "ring-[1.5px] ring-black" : "border-gray-200"}`}
                aria-label={c.name}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mb-1 mt-1">
            <img src={calendaricon} alt="달력" className="w-6 h-6 mr-2" draggable={false} />
            <div
              className="text-black text-[16px] border border-[#E8E8E8] rounded-[9px] px-[26px] py-[6px] select-none"
              style={{ width: "128px" }}
            >
              {shortDateStr}
            </div>
            {repeat && (
              <>
                <span className="font-semibold">~</span>
                {showMonthInput ? (
                  <input
                    id="monthInputBox"
                    type="number"
                    min="1"
                    max="24"
                    className="w-32 h-[38px] placeholder-[#AEAEB2] border pr-3 border-[#E8E8E8] rounded-[9px] px-1 py-1 text-right focus:outline-none"
                    placeholder="+1달(기본값)"
                    value={repeatMonths}
                    onChange={handleMonthInput}
                    onBlur={handleMonthInputBlur}
                    onKeyDown={e => {
                      if (e.key === "Enter") handleMonthInputBlur();
                    }}
                  />
                ) : (
                  <span
                    className="w-32 h-[38px] border border-[#E8E8E8] rounded-[9px] px-[26px] py-1.5 text-black bg-white cursor-pointer select-none"
                    onClick={handleShowMonthInput}
                    title="클릭해서 개월 수정"
                  >
                    {repeatMonths && Number(repeatMonths) > 0 && calcEndDate
                      ? ` ${calcEndDate}`
                      : ""}
                  </span>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <img src={clockicon} alt="시계" className="w-6 h-6 mr-1" draggable={false} />
            {allDay ? (
              <div className="flex items-center px-6 py-2 rounded-[9px] border border-gray-200 text-black text-[17px] select-none" style={{ width: "160px", height: "38px" }}>
                06:00 ~ 24:00
              </div>
            ) : (
              <div className="flex px-4 items-center rounded-[9px] border border-gray-200 bg-white" style={{ width: "160px", height: "38px" }}>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  className="w-[66px] pl-[8px] pr-[0px] py-0 focus:outline-none text-black placeholder-[#AEAEB2] text-[17px]"
                  value={startTime}
                  onChange={handleTimeInput(setStartTime, clampStartTime)}
                  placeholder="06:00"
                  autoComplete="off"
                />
                <span className="-ml-[8.5px] -mr-1 text-[17px] text-black h-[28px]">~</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  className="pl-2 pr-0 py-0 w-[62px] bg-transparent focus:outline-none text-black placeholder-[#AEAEB2] text-[17px]"
                  value={endTime}
                  onChange={handleTimeInput(setEndTime, clampEndTime)}
                  placeholder="24:00"
                  autoComplete="off"
                />
              </div>
            )}
            <label className="flex items-center gap-1.5 ml-2 text-lg font-medium cursor-pointer">
              <Checkbox checked={allDay} onChange={e => setAllDay(e.target.checked)} />
              <span className="text-black text-lg font-normal">종일</span>
            </label>
          </div>
          {repeat && (
            <>
              <div className="flex gap-2 mt-2">
                <select
                  className="appearance-none w-30 h-[38px] border border-[#E8E8E8] rounded-[9px] px-4 py-1 focus:outline-none focus:boarder-1 focus:border-black"
                  value={repeatType}
                  onChange={e => setRepeatType(e.target.value)}
                >
                  <option value="weekly">매주</option>
                  <option value="biweekly">격주</option>
                  <option value="monthly">매월</option>
                </select>
              </div>
              {/* ---- 매월 반복이면 요일 선택 안보임 ---- */}
              {repeatType !== "monthly" && (
                <div className="flex justify-between mt-1">
                  {DAYS.map((d, idx) => (
                    <button
                      type="button"
                      key={d}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-[16px]
                        ${repeatDays.includes(idx) ? 'bg-black text-white' : 'bg-white text-black'}`}
                      onClick={() => toggleDay(idx)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
          <button
            type="submit"
            className={`w-full py-2 rounded-md mt-3 transition font-bold text-[#00000033] ${
              canSubmit ? "bg-[#D0D0D0] text-black " : "bg-[#F4F4F4] cursor-not-allowed"
            }`}
            style={{
                cursor: canSubmit ? "pointer" : "not-allowed"
              }}
            disabled={!canSubmit}
          >
            등록하기
          </button>
        </form>
      </div>
    </>
  );
}
