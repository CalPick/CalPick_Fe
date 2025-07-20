import React, { useState } from "react";
import FriendInboxItem from "./FriendInboxItem";
import closeBtn from "../../assets/closebtn.svg";

// 친구 요청 목업 데이터
const mockFriendRequests = [
  { friendName: "이수현" },
  { friendName: "김건우" },
  { friendName: "천서현" },
];

export default function FriendsInboxModal({ onClose }) {
  const [requests, setRequests] = useState(mockFriendRequests);

  const removeRequest = (indexToRemove) => {
    setRequests((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div
      className="absolute top-[600px] left-[410px] z-50 bg-white border border-gray-300 px-[35px] py-[40px] w-[356px] shadow-md"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 제목 영역 */}
      <div className="flex justify-between items-center mb-6 w-full">
        <h2 className="text-[20px] font-[600]">친구 요청</h2>
        <button onClick={onClose}>
          <img src={closeBtn} alt="닫기" className="w-[32px] h-[32px]" />
        </button>
      </div>

      {/* 요청 리스트 */}
      <div className="flex flex-col gap-y-4">
        {requests.map((req, index) => (
          <FriendInboxItem
            key={index}
            friendName={req.friendName}
            onAccept={() => removeRequest(index)}
            onReject={() => removeRequest(index)}
          />
        ))}
      </div>

      {requests.length === 0 && (
        <p className="text-gray-400 text-sm text-center my-[20px]">
          친구 요청이 없습니다.
        </p>
      )}
    </div>
  );
}
