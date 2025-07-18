import React, { useState, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import WeekdayRow from "./WeekdayRow";
import ScheduleFormPanel from "../common/ScheduleFormPanel";
import ScheduleViewPanel from "../common/ScheduleViewPanel"; // 새로 추가!
import axios from "axios";

export default function CalendarWrapper() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [schedules, setSchedules] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState(null); // "view" or "add"
  const [selectedDate, setSelectedDate] = useState(null);
  const [anchorRef, setAnchorRef] = useState(null);

  function getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
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
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/schedules/monthly`,
        {
          params: { userId, year, month: month + 1 },
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then(res => setSchedules(Array.isArray(res.data) ? res.data : []))
      .catch(() => setSchedules([]));
  };

  useEffect(fetchSchedules, [year, month, token]);

  // 달력 셀 클릭
  const handleCellClick = (date, cellRef, hasSchedule = false) => {
    setSelectedDate(date);
    setAnchorRef(cellRef);
    setPanelType(hasSchedule ? "view" : "add");
    setPanelOpen(true);
  };

  const handlePanelClose = () => {
    setPanelOpen(false);
    setSelectedDate(null);
    setAnchorRef(null);
    setPanelType(null);
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  const getDates = (y, m) => {
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const arr = [];
    for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
      arr.push(new Date(d));
    }
    return arr;
  };
  const dates = getDates(year, month);

  // 달력에 전달: 셀별로 해당 날짜에 일정 있는지 여부 전달
  const cellClickHandler = (date, ref) => {
    const hasSchedule = schedules.some(sch => {
      const dt = new Date(sch.startTime);
      return (
        dt.getFullYear() === date.getFullYear() &&
        dt.getMonth() === date.getMonth() &&
        dt.getDate() === date.getDate()
      );
    });
    handleCellClick(date, ref, hasSchedule);
  };

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
            onDateClick={cellClickHandler}
          />
        </div>
      </div>
      {/* 일정조회 패널 */}
      {panelOpen && selectedDate && anchorRef && panelType === "view" && (
        <ScheduleViewPanel
          open={true}
          anchorRef={anchorRef}
          date={selectedDate}
          schedules={schedules}
          onAddClick={() => setPanelType("add")}
          onClose={handlePanelClose}
        />
      )}
      {/* 일정추가 패널 */}
      {panelOpen && selectedDate && anchorRef && panelType === "add" && (
        <ScheduleFormPanel
          open={true}
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
