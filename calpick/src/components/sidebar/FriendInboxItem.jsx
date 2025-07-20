import React, { useState } from "react";
import acceptDefault from "../../assets/acceptbtn-default.svg";
import acceptHover from "../../assets/acceptbtn-hover.svg";
import rejectDefault from "../../assets/rejectbtn-default.svg";
import rejectHover from "../../assets/rejectbtn-hover.svg";

export default function FriendInboxItem({ friendName, onAccept, onReject }) {
  const [acceptHovered, setAcceptHovered] = useState(false);
  const [rejectHovered, setRejectHovered] = useState(false);

  return (
    <div className="flex w-full gap-4 items-center">
      {/* 친구 이름 박스 */}
      <div className="w-[180px] min-h-[39px] border rounded-[20px] px-[20px] py-[8px] flex items-center">
        <span className="text-[16px] font-[500]">{friendName}</span>
      </div>

      {/* 버튼 */}
      <div className="flex items-center gap-1">
        <img
          src={acceptHovered ? acceptHover : acceptDefault}
          alt="수락"
          className="w-[44px] h-[44px] cursor-pointer"
          onMouseEnter={() => setAcceptHovered(true)}
          onMouseLeave={() => setAcceptHovered(false)}
          onClick={onAccept}
        />
        <img
          src={rejectHovered ? rejectHover : rejectDefault}
          alt="거절"
          className="w-[44px] h-[44px] cursor-pointer"
          onMouseEnter={() => setRejectHovered(true)}
          onMouseLeave={() => setRejectHovered(false)}
          onClick={onReject}
        />
      </div>
    </div>
  );
}
