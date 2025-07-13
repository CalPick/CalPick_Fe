import React from "react";
import { BrowserRouter } from "react-router-dom";
import CalendarPage from './components/calendar/CalendarPage';

function App() {
  return (
    <BrowserRouter>
      <CalendarPage userId={"yourUserId"} />
    </BrowserRouter>
  );
}

export default App;
