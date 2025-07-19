import React, { useState, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import WeekdayRow from "./WeekdayRow";
import ScheduleFormPanel from "../common/ScheduleFormPanel";
import ScheduleViewPanel from "../common/ScheduleViewPanel";
import axios from "axios";

export default function CalendarWrapper() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [schedules, setSchedules] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [anchorRef, setAnchorRef] = useState(null);
  const [scheduleToEdit, setScheduleToEdit] = useState(null);

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
    setScheduleToEdit(null);
  };

  const handleEditClick = (schedule) => {
    setScheduleToEdit(schedule);
    setPanelType("edit");
  };

  const handleUpdateSchedule = async (updatedData) => {
    if (!token || !scheduleToEdit?.id) {
      alert("인증 정보가 없거나 수정할 일정이 선택되지 않았습니다.");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/schedules/${scheduleToEdit.id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const updatedSchedule = Array.isArray(response.data) ? response.data[0] : response.data; 

      setSchedules(schedules.map(s => s.id === updatedSchedule.id ? updatedSchedule : s));
      
      alert("일정이 성공적으로 수정되었습니다.");
      handlePanelClose();

    } catch (error) {
      console.error("일정 수정 실패:", error);
      const errorMessage = error.response?.data?.error || "일정 수정 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!token || !scheduleId) {
      alert("인증 정보가 없거나 삭제할 일정이 선택되지 않았습니다.");
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/schedules/${scheduleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSchedules(schedules.filter((s) => s.id !== scheduleId));

      alert("일정이 성공적으로 삭제되었습니다.");
      handlePanelClose();
    } catch (error) {
      console.error("일정 삭제 실패:", error);
      const errorMessage =
        error.response?.data?.error || "일정 삭제 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
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
      {panelOpen && selectedDate && anchorRef && panelType === "view" && (
        <ScheduleViewPanel
          open={true}
          anchorRef={anchorRef}
          date={selectedDate}
          schedules={schedules}
          onAddClick={() => setPanelType("add")}
          onClose={handlePanelClose}
          onEditClick={handleEditClick}
        />
      )}
      {panelOpen && selectedDate && anchorRef && (panelType === "add" || panelType === "edit") && (
        <ScheduleFormPanel
          open={true}
          anchorRef={anchorRef}
          date={selectedDate}
          setDate={setSelectedDate}
          onClose={handlePanelClose}
          onAddSchedule={fetchSchedules}
          onEditSchedule={handleUpdateSchedule}
          onDeleteSchedule={handleDeleteSchedule}
          schedule={panelType === 'edit' ? scheduleToEdit : null}
        />
      )}
    </>
  );
}
