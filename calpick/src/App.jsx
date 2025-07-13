import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalendarPage from './components/calendar/CalendarPage';
import Login from './Login';
import Signup from './Signup';
import LoginSuccess from './LoginSuccess';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CalendarPage userId={"yourUserId"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/success" element={<LoginSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
