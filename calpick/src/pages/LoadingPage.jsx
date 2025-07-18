import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function LoadingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center gap-16">
      <div className="flex flex-row">
        <img
          src="/images/loading-title.svg"
          alt="최적의 약속 날짜를 찾고있어요."
          className="w-[349px] h-[189px]"
        />
        <motion.img
          src="/images/cursor.svg"
          alt="커서 이미지"
          className="absolute w-[79.85px] h-[119.18px]"
          animate={{
            x: [320, 360, 430, 320],
y: [30, -50, 50, 30],    // 꼭짓점의 y 좌표
  }}
          transition={{
            duration: 1.7,
            repeat: Infinity,
          }}
        />
      </div>
      <button
        className="w-[290px] h-[40px] rounded-xl bg-black text-white font-bold flex items-center justify-center gap-3"
        onClick={() => navigate("/landing")}
      >
        <img
          src="/images/calpick-white-logo.svg"
          alt="캘픽"
          className="h-4.5"
        />
        <span className="text-[18px] font-semibold">홈으로</span>
      </button>
    </div>
  );
}

export default LoadingPage;
