import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img
        src="/public/landing-logo.svg" 
        alt="캘픽 문구 이미지"
        className="mb-10 w-[406px] h-[173px]"
      />

      <div className="flex gap-8">
        <button
          className="px-16 py-1.5 rounded-md bg-black text-white font-bold"
          onClick={() => navigate("/login")}
        >
          로그인
        </button>
        <button
          className="px-16 py-1.5 rounded-md bg-[#D9D9D9] text-white font-bold"
          onClick={() => navigate("/signup")}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Landing;
