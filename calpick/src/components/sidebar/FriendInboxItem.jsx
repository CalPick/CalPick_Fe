// FriendInboxItem.jsx
import React, { useState } from "react";
import acceptDefault from "../../assets/acceptbtn-default.svg";
import acceptHover from "../../assets/acceptbtn-hover.svg";
import rejectDefault from "../../assets/rejectbtn-default.svg";
import rejectHover from "../../assets/rejectbtn-hover.svg";

export default function FriendInboxItem({ friendName, onAccept, onReject }) {
  const [aHover, setAHover] = useState(false);
  const [rHover, setRHover] = useState(false);

  return (
    <div className="flex w-full gap-4 items-center">
      <div className="w-[180px] min-h-[39px] border rounded-[20px] px-[20px] py-[8px] flex items-center">
        <span className="text-[16px] font-[500]">{friendName}</span>
      </div>
      <div className="flex items-center gap-1">
        <img
          src={aHover ? acceptHover : acceptDefault}
          alt="수락"
          className="w-[44px] h-[44px] cursor-pointer"
          onMouseEnter={() => setAHover(true)}
          onMouseLeave={() => setAHover(false)}
          onClick={onAccept}
        />
        <img
          src={rHover ? rejectHover : rejectDefault}
          alt="거절"
          className="w-[44px] h-[44px] cursor-pointer"
          onMouseEnter={() => setRHover(true)}
          onMouseLeave={() => setRHover(false)}
          onClick={onReject}
        />
      </div>
    </div>
  );
}
