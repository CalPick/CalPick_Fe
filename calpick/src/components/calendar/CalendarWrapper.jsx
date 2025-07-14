import React, { useState, useRef } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import ScheduleFormPanel from "../common/ScheduleFormPanel";
import axios from "axios";

export default function CalendarWrapper({ userId }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [schedules, setSchedules] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [anchorRef, setAnchorRef] = useState(null);

  function getDates(year, month) {
    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0);
    const dates = [];
    for (let d = new Date(firstDate); d <= lastDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  }

  React.useEffect(() => {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;
    const token = localStorage.getItem('token');
    axios.get(
      `/api/schedules?userId=${userId}&startDate=${startDate}&endDate=${endDate}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => setSchedules(Array.isArray(res.data) ? res.data : []))
    .catch(() => setSchedules([]));
  }, [userId, year, month]);

  const refreshSchedules = () => {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;
    const token = localStorage.getItem('token');
    axios.get(
      `/api/schedules?userId=${userId}&startDate=${startDate}&endDate=${endDate}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => setSchedules(Array.isArray(res.data) ? res.data : []))
    .catch(() => setSchedules([]));
  };

  // 셀 클릭 시 패널 오픈, ref 연결
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

  const dates = getDates(year, month);

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <div className="px-0">
          <CalendarHeader
            year={year}
            month={month}
            onPrev={() => setMonth(m => m === 0 ? 11 : m - 1)}
            onNext={() => setMonth(m => m === 11 ? 0 : m + 1)}
          />
        </div>
        <div className="grid grid-cols-7 text-center text-[16px] font-semibold text-gray-700 mb-2">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="flex-1">
          <CalendarGrid
            dates={dates}
            currentMonth={month}
            onDateClick={handleCellClick}
            schedules={schedules}
            selectedDate={selectedDate}
            setCellRef={handleCellClick}
          />
        </div>
      </div>

      {/* 일정 등록 패널 */}
      {panelOpen && selectedDate && anchorRef && (
        <ScheduleFormPanel
          open={panelOpen}
          anchorRef={anchorRef}
          date={selectedDate}
          setDate={setSelectedDate}
          onClose={handlePanelClose}
          onAddSchedule={refreshSchedules}
        />
      )}
    </>
  );
}
