// src/pages/NotFoundPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center gap-16">
      <img
        src="/images/404-title.svg"
        alt="앗! 잘못된 경로예요."
        className="w-[508px] h-[132px]"
      />

      <button
        className="w-[200px] h-[40px] rounded-xl bg-black text-white font-bold flex items-center justify-center gap-3"
        onClick={() => navigate("/landing")}
      >
        <img 
        src="/images/calpick-white-logo.svg" 
        alt="캘픽" 
        className="h-4.5"/>
        <span className="text-[18px] font-semibold">홈으로</span>
      </button>
      
    </div>
  );
}

export default NotFoundPage;
