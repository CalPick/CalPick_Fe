import React, { useState, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import CalendarDrawer from "./CalendarDrawer"; // 오른쪽 슬라이드 오버 패널
import axios from "axios";

export default function CalendarWrapper({ userId }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [schedules, setSchedules] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDate, setDrawerDate] = useState(null);

  // 날짜 배열 구하는 함수
  function getDates(year, month) {
    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0);
    const dates = [];
    for (let d = new Date(firstDate); d <= lastDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  }

  // API 호출
  useEffect(() => {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;
    const token = localStorage.getItem('token');

    axios.get(
      `/api/schedules?userId=${userId}&startDate=${startDate}&endDate=${endDate}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => setSchedules(Array.isArray(res.data) ? res.data : []))
    .catch(err => {
      alert(err.response?.data?.error || "일정 불러오기 실패");
      setSchedules([]);
    });
  }, [userId, year, month]);

  // 일정 추가 후 달력 새로고침
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

  // 날짜 클릭시 drawer 오픈
  const onDateClick = (date) => {
    setDrawerDate(date);
    setDrawerOpen(true);
  };

  const dates = getDates(year, month);

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <div className="px-0 pt-8 pb-2">
          <CalendarHeader
            year={year}
            month={month}
            onPrev={() => setMonth(m => m === 0 ? 11 : m - 1)}
            onNext={() => setMonth(m => m === 11 ? 0 : m + 1)}
          />
        </div>
        <div className="grid grid-cols-7 text-center text-[16px] font-medium text-gray-700 mb-2">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="flex-1">
          <CalendarGrid
            dates={dates}
            currentMonth={month}
            onDateClick={onDateClick}
            schedules={schedules}
          />
        </div>
      </div>
      {/* 오른쪽 드로어 */}
      {drawerOpen && drawerDate && (
        <CalendarDrawer
          date={drawerDate}
          schedules={schedules}
          onClose={() => setDrawerOpen(false)}
          onAddSchedule={refreshSchedules}
        />
      )}
    </>
  );
}
