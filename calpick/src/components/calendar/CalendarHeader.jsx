import React from 'react';
import LeftArrowIcon from '../../assets/left-arrow.svg';
import RightArrowIcon from '../../assets/right-arrow.svg';

export default function CalendarHeader({ year, month, onPrev, onNext }) {
  return (
    <div className="flex justify-between items-center font-sans">
      <button onClick={onPrev} className="p-2 hover:bg-gray-100 rounded">
        <img src={LeftArrowIcon} alt="left arrow" className="w-6 h-6" />
      </button>

      <h2 className="text-2xl font-bold font-sans">
         {month + 1}월
      </h2>

      <button onClick={onNext} className="p-2 hover:bg-gray-100 rounded">
        <img src={RightArrowIcon} alt="right arrow" className="w-6 h-6" />
      </button>
    </div>
  );
}
 