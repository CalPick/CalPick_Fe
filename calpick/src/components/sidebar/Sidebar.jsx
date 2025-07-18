import React from "react";
import GroupListPanel from "./GroupListPanel";
import FriendListPanel from "./FriendListPanel";
import mailIcon from "../../assets/mailicon-default.svg";
import plusIcon from "../../assets/plusicon.svg";

function Sidebar() {
  return (
    <aside
      className="
        absolute left-[130px] top-[186px] w-[254px] h-[715px]
        gap-8 flex flex-col items-center justify-start"
    >
      <div className="w-[289px] h-[459px]">
        <div className="flex items-center justify-between border-b border-black pb-2">
          <span className="text-[18px] font-[600]">그룹</span>
          <div className="flex items-center gap-2">
            <img src={mailIcon} alt="메일" />
            <img src={plusIcon} alt="추가" />
          </div>
        </div>
        <GroupListPanel />
      </div>

      <div className="w-[289px] h-[315px]">
        <div className="flex items-center justify-between border-b border-black pb-2">
          <span className="text-[18px] font-[600]">친구</span>
          <div className="flex items-center gap-2">
            <img src={mailIcon} alt="메일" />
            <img src={plusIcon} alt="추가" />
          </div>
        </div>
        <FriendListPanel />
      </div>
    </aside>
  );
}

export default Sidebar;
