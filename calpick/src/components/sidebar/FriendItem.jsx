import React from "react";
import calendarIcon from "../../assets/calendaricon.svg";

function FriendItem({ friend, onCalendarClick }) {
  const handleCalendarClick = () => {
    if (onCalendarClick) {
      // ✅ 원래 구조로 복원: id, name 사용
      onCalendarClick(friend.id, friend.name);
    }
  };

  return (
    <div className="flex justify-between items-center w-full h-[44px] px-[20px]">
      <span className="text-[16px] font-[500]">{friend.name}</span>
      <img
        src={calendarIcon}
        alt="calendaricon"
        className="w-[18px] h-[18px] cursor-pointer"
        onClick={handleCalendarClick}
      />
    </div>
  );
}

export default FriendItem;
