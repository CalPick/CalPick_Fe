import React, { useState } from "react";
import acceptDefault from "../../assets/acceptbtn-default.svg";
import acceptHover from "../../assets/acceptbtn-hover.svg";
import rejectDefault from "../../assets/rejectbtn-default.svg";
import rejectHover from "../../assets/rejectbtn-hover.svg";

export default function InviteItem({ groupName, members, onAccept, onReject }) {
  const [acceptHovered, setAcceptHovered] = useState(false);
  const [rejectHovered, setRejectHovered] = useState(false);

  return (
    <div className="flex flex-col w-[337px] gap-2">
  <span className="text-[16px] font-[500] mx-4">{groupName}</span>

  <div className="flex w-full gap-4">
    {/* ✅ 텍스트 박스 */}
    <div
      className="w-[420px] min-h-[44px] border rounded-[20px] px-[20px] py-[8px] flex items-center flex-wrap break-words"
    >
      <span className="text-[16px] font-[500]">
        {members.join(", ")}
      </span>
    </div>

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
</div>

  );
}
