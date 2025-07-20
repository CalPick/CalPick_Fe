import React from "react";
import acceptDefault from "../../assets/acceptbtn-default.svg";
import acceptHover from "../../assets/acceptbtn-hover.svg";
import rejectDefault from "../../assets/rejectbtn-default.svg";
import rejectHover from "../../assets/rejectbtn-hover.svg";

export default function InviteItem({ groupName, members }) {
  const [acceptHovered, setAcceptHovered] = useState(false);
  const [rejectHovered, setRejectHovered] = useState(false);

  return (
    <div className="flex flex-col w-[337px] gap-4">
      <span className="text-[16px] font-[500]">{groupName}</span>
      <div className="flex flex-row gap-2">
        <div
          className="
          flex items-center
          w-[267px] h-[39px]
          border rounded-[20px]
          px-[20px] py-[10px]"
        >
          <span className="text-[16px] font-[500]">{members.join(", ")}</span>
          <div className="flex items-center">
            {/* ✅ 수락 버튼 */}
            <img
              src={acceptHovered ? acceptHover : acceptDefault}
              alt="수락"
              className="w-[20px] h-[20px] cursor-pointer"
              onMouseEnter={() => setAcceptHovered(true)}
              onMouseLeave={() => setAcceptHovered(false)}
              onClick={onAccept}
            />

            {/* ✅ 거절 버튼 */}
            <img
              src={rejectHovered ? rejectHover : rejectDefault}
              alt="거절"
              className="w-[20px] h-[20px] cursor-pointer"
              onMouseEnter={() => setRejectHovered(true)}
              onMouseLeave={() => setRejectHovered(false)}
              onClick={onReject}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
