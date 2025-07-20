

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalendarWrapper from "./CalendarWrapper";
import Logo from "./Logo";
import Sidebar from "../sidebar/Sidebar";

function getAuthInfoFromToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.sub, nickname: payload.nickname || "User" };
  } catch {
    return null;
  }
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const authInfo = getAuthInfoFromToken(token);

  const CURRENT_USER = { id: authInfo?.id, name: authInfo?.nickname };

  const [viewedUser, setViewedUser] = useState(CURRENT_USER);

  useEffect(() => {
    if (!token) {
      navigate("/landing", { replace: true });
    }
  }, [navigate, token]);

  function onLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("nickname");
    navigate("/landing");
  }

  // *** MODIFIED: Now accepts the full friend object from Sidebar ***
  const handleCalendarClick = (friend) => {
    setViewedUser(friend);
  };

  const handleGoBackToMyCalendar = () => {
    setViewedUser(CURRENT_USER);
  };

  if (!authInfo) {
    return <div>Loading...</div>;
  }

  // *** ADDED: Determine if the current view is read-only ***
  const isReadOnly = viewedUser.id !== CURRENT_USER.id;

  return (
    <div className="relative w-full max-w-[1440px] h-[900px] mx-auto bg-transparent">
      <header className="absolute top-5 left-33 right-3 flex items-center">
        <Logo />
        <div className="ml-216 flex items-center space-x-4">
          <span className="font-semibold text-black whitespace-nowrap">
            {authInfo.nickname} 님
          </span>
          <button
            onClick={onLogout}
            className="w-[116px] h-[36px] bg-[#D0D0D0] text-black rounded-lg px-5 py-1 hover:bg-red-700 transition font-semibold"
          >
            로그아웃
          </button>
        </div>
      </header>
      
      <aside>
        {/* *** MODIFIED: friendList prop is removed *** */}
        <Sidebar
          viewedUser={viewedUser}
          currentUserId={CURRENT_USER.id}
          onCalendarClick={handleCalendarClick}
          onGoBack={handleGoBackToMyCalendar}
        />
      </aside>
      
      <main className="absolute left-[420px] top-[100px] w-[830px] h-[800px] bg-white rounded-xl flex flex-col">
        {/* *** MODIFIED: Pass isReadOnly prop to CalendarWrapper *** */}
        <CalendarWrapper key={viewedUser.id} userId={viewedUser.id} isReadOnly={isReadOnly} />
      </main>
    </div>
  );
}
