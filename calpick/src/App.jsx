import React from "react";
import CalendarPage from './components/calendar/CalendarPage';  // CalendarPage 임포트

function App() {
  return (
    <div className="w-full h-screen bg-white">
      <CalendarPage userId={"yourUserId"} />
    </div>
  );
}

export default App;
