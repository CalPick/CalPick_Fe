import { div } from "prelude-ls";
import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center mt-[180px] bg-white">
        <img
          src="/images/landing-logo.svg"
          alt="캘픽 문구 이미지"
          className="mb-10 w-[405.65px] h-[172.95px]"
        />

        <div className="flex gap-[16px] mb-[150px]">
          <button
            className="px-17.5 py-2 rounded-md bg-black text-white font-bold"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>
          <button
            className="px-17.5 py-2 rounded-md bg-[#D9D9D9] font-bold"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </button>
        </div>
      </div>

      <div
        className="min-h-screen flex flex-col flex items-center justify-center 
  bg-gradient-to-b from-[#F4F7F9] to-[#E0E8EE]"
      >
        <div className="flex items-center justify-center h-[263px]">
          <p className="text-center text-[30px]">
            사람마다 일정을 매번 확인하느라 번거로우셨죠?
            <br />
            캘픽이 약속을 빠르게 잡아드릴게요.
          </p>
        </div>

        <div className="flex flex-row py-[30px] gap-[151px]">
          <div className="flex flex-col justify-center">
            <p className="text-[44px] font-extrabold mb-5">쉬운 일정 등록</p>
            <p className="text-[30px] mb-3">
              반복되는 일정을 손쉽게 등록할 수 있어요.
            </p>
            <p className="text-[20px] text-gray-500">
              *빈 시간에 약속을 잡기 위해 일정을 등록해주세요.
            </p>
          </div>
          <img
            src="/images/schedule-create.png.svg"
            alt="일정 등록 사진"
            className="w-[396px] h-[545px]"
          />
        </div>

        <div className="flex flex-col flex items-center py-[55px]">
          <div>
            <p className="text-[44px] text-center font-extrabold mb-5">빠른 약속 잡기</p>
            <p className="text-[30px] text-center mb-8">
              친구 추가 후 그룹을 생성하면 <br />
              그룹 멤버의 일정을 조회해 <br />
              날짜를 추천해줘요.
            </p>
          </div>
          <img
            src="/images/calendar.svg"
            alt="약속 조회 페이지 사진"
            className="w-[713px] h-[363px]"
          />
        </div>

        <div className="flex flex-row py-[40px] gap-[151px]">
          <div className="flex flex-col justify-center">
            <p className="text-[44px] text-center font-extrabold mb-5">픽!</p>
            <p className="text-[30px] text-center">
              상대방과 합의 후 시간을 선택해주세요. <br />
              약속 일정이 캘린더에 들어갑니다.
            </p>
          </div>
          <img
            src="/images/pick.svg"
            alt="일정 픽하는 사진"
            className="w-[399px] h-[415px]"
          />
        </div>
        <footer className="my-8 text-[16px] opacity-50 text-center align-middle">Copyright 2025 by CalPick. All rights reserved</footer>
      </div>
    </div>
  );
}

export default Landing;
