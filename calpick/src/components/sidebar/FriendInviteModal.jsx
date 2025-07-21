// FriendInviteModal.jsx
import React, { useState } from "react";
import sendDefault from "../../assets/send-default.svg";
import sendHover from "../../assets/send-hover.svg";
import closeBtn from "../../assets/closebtn.svg";

function FriendInviteModal({ onClose, onFriendAdded }) {
  const [inputId, setInputId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleSendRequest = async () => {
    const trimmed = inputId.trim();
    if (!trimmed) return;
    const token = localStorage.getItem("token");
    try {
      // ID 유효성 체크
      const checkRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/check?userId=${encodeURIComponent(trimmed)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (checkRes.status !== 409) {
        setErrorMessage("존재하지 않는 사용자입니다.");
        return;
      }
      // 친구 요청
      const reqRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/friends/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ targetUserId: trimmed }),
        }
      );
      if (!reqRes.ok) {
        setErrorMessage("이미 요청했거나 불가능한 대상입니다.");
        return;
      }
      onFriendAdded(trimmed);
      onClose();
    } catch {
      setErrorMessage("네트워크 오류가 발생했습니다.");
    }
  };

  return (
    <div className="absolute top-[600px] left-[410px] z-50" onClick={e => e.stopPropagation()}>
      <div className="bg-white flex flex-col px-[35px] py-[40px] w-[268px] h-[215px] shadow-sm border border-[#DDDDDD]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[20px] font-[600]">친구 추가</h2>
          <button onClick={onClose}>
            <img src={closeBtn} alt="닫기" className="w-[32px] h-[32px]" />
          </button>
        </div>
        <p className="mb-2 ml-2">아이디 입력</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 border rounded-[10px] px-4 py-2 w-[162px] h-[36px]">
            <input
              className="text-sm placeholder-gray-400 w-full focus:outline-none"
              placeholder="아이디 입력"
              value={inputId}
              onChange={e => {
                setInputId(e.target.value);
                setErrorMessage("");
              }}
            />
          </div>
          <img
            src={inputId.trim() ? sendHover : sendDefault}
            alt="보내기"
            className={`w-[36px] h-[36px] ${inputId.trim() ? "cursor-pointer" : "opacity-30"}`}
            onClick={inputId.trim() ? handleSendRequest : null}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        </div>
        {errorMessage && <p className="text-xs text-[#B3261E] pl-1 mt-1">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default FriendInviteModal;
