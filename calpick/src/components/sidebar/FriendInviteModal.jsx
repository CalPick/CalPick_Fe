import React, { useState } from "react";
import sendDefault from "../../assets/send-default.svg";
import sendHover from "../../assets/send-hover.svg";
import closeBtn from "../../assets/closebtn.svg";

function FriendInviteModal({ onClose, onFriendAdded }) {
  const [inputId, setInputId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleSendRequest = async () => {
    const trimmedId = inputId.trim();
    if (!trimmedId) return;

    const token = localStorage.getItem("token");
    const currentUserId = localStorage.getItem("userId");

    try {
      // 1. 아이디 존재 여부 확인 (아이디 중복확인 API)
      const checkRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/check-id/${trimmedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const checkData = await checkRes.json();

      if (checkData.available === false) {
        // 2. 아이디가 존재함 → 친구 요청 보내기
        const friendReqRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/friends`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              fromUserId: currentUserId,
              toUserId: trimmedId,
            }),
          }
        );

        if (!friendReqRes.ok) {
          const errText = await friendReqRes.text();
          console.error("친구 요청 실패:", errText);
          setErrorMessage("친구 요청 중 오류가 발생했습니다.");
          return;
        }

        const newFriend = await friendReqRes.json();

        // 3. 친구 목록에 반영
        onFriendAdded({
          id: newFriend.id,
          name: newFriend.name,
        });

        onClose();
      } else {
        setErrorMessage("존재하지 않는 사용자입니다.");
      }
    } catch (error) {
      console.error("요청 실패:", error);
      setErrorMessage("네트워크 오류가 발생했습니다.");
    }
  };

  return (
    <div
      className="absolute top-[600px] left-[410px] z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white flex flex-col px-[35px] py-[40px] w-[268px] h-[215px] shadow-sm border border-[#DDDDDD]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[20px] font-[600]">친구 추가</h2>
          <button onClick={onClose}>
            <img src={closeBtn} alt="닫기" className="w-[32px] h-[32px]" />
          </button>
        </div>

        <div>
          <p className="mb-2 ml-2">아이디 입력</p>

          <div className="flex flex-row items-center gap-2 w-full">
            <div className="flex items-center gap-2 border rounded-[10px] px-4 py-2 w-[162px] h-[36px]">
              <input
                className="text-sm placeholder-gray-400 w-full focus:outline-none"
                placeholder="아이디 입력"
                value={inputId}
                onChange={(e) => {
                  setInputId(e.target.value);
                  setErrorMessage("");
                }}
              />
            </div>
            <img
              src={inputId.trim().length > 0 ? sendHover : sendDefault}
              alt="보내기"
              className={`w-[36px] h-[36px] transition-opacity ${
                inputId.trim()
                  ? "cursor-pointer opacity-100"
                  : "cursor-default opacity-30"
              }`}
              onClick={inputId.trim() ? handleSendRequest : null}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          </div>
        </div>

        {errorMessage && (
          <p className="text-xs text-[#B3261E] pl-1 mt-1">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}

export default FriendInviteModal;
