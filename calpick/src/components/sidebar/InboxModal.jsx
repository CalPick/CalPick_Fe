import React, { useState } from "react";
import InviteItem from "./InviteItem";

// 모달 목업 데이터
const mockInvites = [
  {
    groupName: "그룹1",
    members: ["홍길동", "친구1"],
  },
  {
    groupName: "그룹2",
    members: ["친구2", "친구3", "친구4", "친구5", "친구6", "친구7", "친구8", "친구9", "친구10"],
  },
  {
    groupName: "그룹3",
    members: ["친구11", "친구12"],
  },
];

export default function InboxModal({ onClose }) {
  const [invites, setInvites] = useState(mockInvites); // ✅ 상태로 관리

  const removeInvite = (indexToRemove) => {
    setInvites((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div
      className="absolute top-[190px] left-[410px] z-50 bg-white border border-gray-300 w-[300px] p-5 rounded-none shadow-md"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4 w-[447px] px-[35px] py-[40px] gap-[20px]">
        <h2 className="text-[20px] font-[600]">그룹 초대장</h2>
        <button onClick={onClose} className="text-[20px]">×</button>
      </div>

      {invites.map((invite, index) => (
        <InviteItem
          key={index}
          groupName={invite.groupName}
          members={invite.members}
          onAccept={() => removeInvite(index)}
          onReject={() => removeInvite(index)}
        />
      ))}

      {invites.length === 0 && (
        <p className="text-gray-400 text-sm text-center my-[20px]">받은 초대가 없습니다.</p>
      )}
    </div>
  );
}
