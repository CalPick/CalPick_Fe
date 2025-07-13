import React from "react";
import CalendarWrapper from "./CalendarWrapper";
import Logo from "./Logo";  // Logo 컴포넌트 import

export default function CalendarPage({ userId, nickname, onLogout }) {
  return (
    <div className="relative w-full max-w-[1440px] h-[900x] mx-auto bg-transparent">
      {/* 상단 헤더 */}
      <header className="absolute top-5 left-33 right-3 flex items-center">
        {/* 로고 컴포넌트 사용 */}
        <Logo />

        {/* 닉네임 + 로그아웃 버튼 영역 */}
        <div className="ml-216 flex items-center space-x-4">
          <span className="font-semibold text-black whitespace-nowrap">{nickname} 님</span>
          <button
            onClick={onLogout}
            className="w-[116px] h-[36px] bg-[#D0D0D0] text-black rounded-lg px-5 py-1 hover:bg-red-700 transition font-semibold"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* 그룹 패널 */}
      <aside
        className="
          absolute left-[130px] top-[186px] w-[254px] h-[715px]
          bg-[#D9D9D9] rounded-[11px] flex flex-col items-center justify-center
          font-bold text-gray-700
        "
      >
        그룹
      </aside>

      {/* 캘린더 패널 */}
      <main
         className="
         absolute left-[420px] top-[100px]
         w-[830px] h-[800px]
         bg-white rounded-xl flex flex-col
        "
>
        <CalendarWrapper userId={userId} />
      </main>
    </div>
  );
}
