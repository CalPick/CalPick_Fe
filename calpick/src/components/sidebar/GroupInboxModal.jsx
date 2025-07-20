import React, { useState } from "react";
import InviteItem from "./InviteItem";
import closeBtn from "../../assets/closebtn.svg";

// 모달 목업 데이터
const mockInvites = [
  {
    groupName: "그룹1",
    members: ["홍길동", "친구1"],
  },
  {
    groupName: "그룹2",
    members: [
      "친구2",
      "친구3",
      "친구4",
      "친구5",
      "친구6",
      "친구7",
      "친구8",
      "친구9",
      "친구10",
    ],
  },
];

export default function GroupInboxModal({ onClose }) {
  const [invites, setInvites] = useState(mockInvites); // ✅ 상태로 관리

  const removeInvite = (indexToRemove) => {
    setInvites((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div
      className="absolute top-[150px] left-[410px] z-50 bg-white border border-gray-300 px-[35px] py-[40px] w-[447px] p-5 rounded-none shadow-md"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-6 w-full ">
        <h2 className="text-[20px] font-[600]">그룹 초대장</h2>
        <button onClick={onClose}>
          <img src={closeBtn} alt="닫기" className="w-[32px] h-[32px]" />
        </button>
      </div>

      <div className="flex flex-col gap-y-4">
        {invites.map((invite, index) => (
          <InviteItem
            key={index}
            groupName={invite.groupName}
            members={invite.members}
            onAccept={() => removeInvite(index)}
            onReject={() => removeInvite(index)}
          />
        ))}
      </div>

      {invites.length === 0 && (
        <p className="text-gray-400 text-sm text-center my-[20px]">
          받은 초대가 없습니다.
        </p>
      )}
    </div>
  );
}
