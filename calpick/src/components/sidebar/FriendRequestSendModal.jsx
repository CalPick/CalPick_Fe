import React, { useState } from "react";

function FriendRequestSendModal({ onClose }) {
  const [targetUserId, setTargetUserId] = useState("");
  const [message, setMessage] = useState("");

  const handleSendRequest = async () => {
    const token = localStorage.getItem("token");
    if (!targetUserId) {
      setMessage("사용자 ID를 입력해주세요.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/friends/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId }),
      });

      if (res.ok) {
        setMessage("친구 요청을 성공적으로 보냈습니다.");
        // 요청 성공 후 모달 닫기 또는 추가 작업
        onClose();
      } else {
        const errorData = await res.json();
        setMessage(`친구 요청 실패: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error("친구 요청 중 오류 발생:", error);
      setMessage("친구 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">친구 요청 보내기</h2>
        <div className="mb-4">
          <label htmlFor="targetUserId" className="block text-sm font-medium text-gray-700 mb-1">
            친구의 사용자 ID
          </label>
          <input
            type="text"
            id="targetUserId"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            placeholder="친구의 ID를 입력하세요"
          />
        </div>
        {message && <p className="text-sm text-red-500 mb-4">{message}</p>}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleSendRequest}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            요청 보내기
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendRequestSendModal;