// FriendItem.jsx
import React from "react";
import calendarIcon from "../../assets/calendaricon.svg";

function FriendItem({ friend, onCalendarClick }) {
  return (
    <div className="flex justify-between items-center w-full h-[44px] px-[20px]">
      <span className="text-[16px] font-[500]">{friend.name}</span>
      <img
        src={calendarIcon}
        alt="calendaricon"
        className="w-[18px] h-[18px] cursor-pointer"
        onClick={() => onCalendarClick(friend.id)}
      />
    </div>
  );
}

export default FriendItem;
