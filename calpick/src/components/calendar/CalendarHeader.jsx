import React from 'react';
import LeftArrowIcon from '../../assets/Property 1=Default-1.svg';   // 왼쪽 화살표
import RightArrowIcon from '../../assets/Property 1=Default.svg';   // 오른쪽 화살표

export default function CalendarHeader({ year, month, onPrev, onNext }) {
  return (
    <div className="flex justify-between items-center font-sans">
      <button
        onClick={onPrev}
        className="p-2 rounded hover:bg-gray-100 hover:rounded-full transition-all duration-200"
        aria-label="Previous month"
      >
        <img
          src={LeftArrowIcon}
          alt="left arrow"
          className="w-10 h-10 hover:filter hover:brightness-75"
        />
      </button>
      <h2 className="text-2xl font-bold font-sans">
        {year}년 {month + 1}월
      </h2>

      <button
        onClick={onNext}
        className="p-2 rounded hover:bg-gray-100 hover:rounded-full transition-all duration-200"
        aria-label="Next month"
      >
        <img
          src={RightArrowIcon}
          alt="right arrow"
          className="w-10 h-10 hover:filter hover:brightness-75"
        />
      </button>
    </div>
  );
}
