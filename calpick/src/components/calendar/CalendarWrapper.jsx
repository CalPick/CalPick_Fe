import React, { useState, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import WeekdayRow from "./WeekdayRow";
import ScheduleFormPanel from "../common/ScheduleFormPanel";
import axios from "axios";

export default function CalendarWrapper() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0 = Jan, …, 11 = Dec
  const [schedules, setSchedules] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [anchorRef, setAnchorRef] = useState(null);

  function getUserIdFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // payload 구조에 따라 아래에서 'sub' 또는 'userId', 'username' 등 적절한 키를 골라 사용
    // 예: payload.sub, payload.userId, payload.username
    return payload.sub; // 대부분 username(로그인 아이디)
  } catch {
    return null;
  }
}
const token = localStorage.getItem("token");
  const userId = token ? getUserIdFromToken(token) : null;

  // 일정 불러오기
  const fetchSchedules = () => {
    if (!token || !userId) {
      setSchedules([]);
      return;
    }
    axios.get(
      `${import.meta.env.VITE_API_URL}/api/schedules/monthly`,
      {
        params: { userId, year, month: month + 1 }, // month 1부터 시작
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    .then(res => setSchedules(Array.isArray(res.data) ? res.data : []))
    .catch(() => setSchedules([]));
  };

  useEffect(fetchSchedules, [year, month, token]);

  // 날짜 셀 클릭
  const handleCellClick = (date, cellRef) => {
    setSelectedDate(date);
    setAnchorRef(cellRef);
    setPanelOpen(true);
  };
  const handlePanelClose = () => {
    setPanelOpen(false);
    setSelectedDate(null);
    setAnchorRef(null);
  };

  // 이전 달 이동
  const handlePrevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  // 다음 달 이동
  const handleNextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  // 해당 월 일자 배열 생성
  const getDates = (y, m) => {
    const first = new Date(y, m, 1);
    const last  = new Date(y, m + 1, 0);
    const arr = [];
    for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
      arr.push(new Date(d));
    }
    return arr;
  };
  const dates = getDates(year, month);

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <CalendarHeader
          year={year}
          month={month}
          onPrev={handlePrevMonth}
          onNext={handleNextMonth}
        />

        <WeekdayRow />

        <div className="flex-1">
          <CalendarGrid
            dates={dates}
            currentMonth={month}
            schedules={schedules}
            selectedDate={selectedDate}
            onDateClick={handleCellClick}
            setCellRef={handleCellClick}
          />
        </div>
      </div>

      {panelOpen && selectedDate && anchorRef && (
        <ScheduleFormPanel
          open={panelOpen}
          anchorRef={anchorRef}
          date={selectedDate}
          setDate={setSelectedDate}
          onClose={handlePanelClose}
          onAddSchedule={fetchSchedules}
        />
      )}
    </>
  );
}
