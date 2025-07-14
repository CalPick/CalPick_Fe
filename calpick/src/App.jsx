import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalendarPage from './components/calendar/CalendarPage';
import Login from './Login';
import Signup from './Signup';
import LoginSuccess from './LoginSuccess';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/calendar" element={<CalendarPage userId={"yourUserId"} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/success" element={<LoginSuccess />} />
        </Routes>
      </Router>

      {/* 하단 고정 푸터 */}
      <p className="fixed bottom-4 inset-x-0 w-full text-center text-gray-400 text-sm pointer-events-none select-none z-50">
        Copyright 2025 by CalPick. All rights reserved
      </p>
    </div>
  );
}

export default App;
