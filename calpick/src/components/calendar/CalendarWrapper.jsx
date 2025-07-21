/*
CalendarWrapper.jsx
*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendarHeader from "./CalendarHeader";
import WeekdayRow from "./WeekdayRow";
import CalendarGrid from "./CalendarGrid";
import ScheduleFormPanel from "../common/ScheduleFormPanel";
import ScheduleViewPanel from "../common/ScheduleViewPanel";

export default function CalendarWrapper({ userId, isReadOnly }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [schedules, setSchedules] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [anchorRef, setAnchorRef] = useState(null);
  const [scheduleToEdit, setScheduleToEdit] = useState(null);

  const token = localStorage.getItem("token");

  const fetchSchedules = () => {
    if (!token || !userId) {
      setSchedules([]);
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/schedules/monthly`, {
        params: { userId, year, month: month + 1 },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setSchedules(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error(`Failed to fetch schedules for userId: ${userId}`, err);
        setSchedules([]);
      });
  };

  useEffect(fetchSchedules, [year, month, userId, token]);

  const handleCellClick = (date, ref, hasSchedule) => {
    if (isReadOnly && !hasSchedule) return;
    setSelectedDate(date);
    setAnchorRef(ref);
    setPanelType(hasSchedule ? "view" : "add");
    setPanelOpen(true);
  };

  const handlePanelClose = () => {
    setPanelOpen(false);
    setSelectedDate(null);
    setAnchorRef(null);
    setPanelType(null);
    setScheduleToEdit(null);
  };

  const handleEditClick = schedule => {
    setScheduleToEdit(schedule);
    setPanelType("edit");
  };

  // These functions are now primarily for local state management
  // as ScheduleFormPanel handles the API calls directly. fetchSchedules will refresh the data.
  const handleUpdateSchedule = async updatedData => {
    console.log("handleUpdateSchedule called in CalendarWrapper (might be redundant for API calls)", updatedData);
  };

  const handleDeleteSchedule = async id => {
    console.log("handleDeleteSchedule called in CalendarWrapper (might be redundant for API calls)", id);
  };

  const handlePrevMonth = () => {
    setMonth(m => (m === 0 ? 11 : m - 1));
    setYear(y => (month === 0 ? y - 1 : y));
  };

  const handleNextMonth = () => {
    setMonth(m => (m === 11 ? 0 : m + 1));
    setYear(y => (month === 11 ? y + 1 : y));
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

  const cellClickHandler = (date, ref) => {
    const has = schedules.some(sch => {
      const dt = new Date(sch.startTime);
      return (
        dt.getFullYear() === date.getFullYear() &&
        dt.getMonth() === date.getMonth() &&
        dt.getDate() === date.getDate()
      );
    });
    handleCellClick(date, ref, has);
  };

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <CalendarHeader year={year} month={month} onPrev={handlePrevMonth} onNext={handleNextMonth} />
        <WeekdayRow />
        <div className="flex-1">
          <CalendarGrid dates={dates} currentMonth={month} schedules={schedules} onDateClick={cellClickHandler} />
        </div>
      </div>

      {panelOpen && selectedDate && anchorRef && panelType === "view" && (
        <ScheduleViewPanel
          open
          anchorRef={anchorRef}
          date={selectedDate}
          schedules={schedules}
          onAddClick={() => setPanelType("add")}
          onClose={handlePanelClose}
          onEditClick={handleEditClick}
          isReadOnly={isReadOnly}
        />
      )}

      {panelOpen && selectedDate && anchorRef && (panelType === "add" || panelType === "edit") && !isReadOnly && (
        <ScheduleFormPanel
          open
          anchorRef={anchorRef}
          date={selectedDate}
          onClose={handlePanelClose}
          onAddSchedule={fetchSchedules} // This will refresh the calendar after any add/edit/delete from form
          schedule={panelType === "edit" ? scheduleToEdit : null}
          schedules={schedules} // Pass all schedules to ScheduleFormPanel
        />
      )}
    </>
  );
}
