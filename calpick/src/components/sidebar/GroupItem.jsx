import React from "react";
import cursorIcon from "../../assets/cursoricon.svg";

function GroupItem({ groupName, members }) {
  return (
    <div className="mb-2">
      <div className="font-[500] text-[16px] mb-1 ml-[10px]">{groupName}</div>

      {/* 박스 */}
      <div
        className="
          flex flex-row items-center justify-between
          w-[289px] h-[44.27px]
          pl-[20px] pr-[10px]
          border border-[#C3C3C3] rounded-[20px]
          hover:border-black transition-colors duration-200
        "
      >
        {/* 박스 내부 */}
        <span className="text-[16px] text-[#C3C3C3] truncate">
          {members ?? [].join(", ")}
        </span>
        <img
          src={cursorIcon}
          alt="커서 아이콘"
          className="w-[32px] h-[32px]"
        />
      </div>
    </div>
  );
}

export default GroupItem;
