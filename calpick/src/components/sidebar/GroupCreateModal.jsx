import React, { useState } from "react";
import closeBtn from "../../assets/closebtn.svg";

const friendList = [
  { id: 1, name: "이수현", isFriend: true },
  { id: 2, name: "김건우", isFriend: true },
  { id: 3, name: "천서현", isFriend: true },
  { id: 4, name: "김인규", isFriend: true },
  { id: 5, name: "김아연", isFriend: true },
  { id: 6, name: "조현준", isFriend: false }, // 친구가 아님
];

export default function GroupCreateModal({ onClose }) {
  const [selectedFriendIds, setSelectedFriendIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [groupName, setGroupName] = useState("");

  // 체크된 친구 함수
  const handleFriendToggle = (id) => {
    setSelectedFriendIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const isButtonActive = selectedFriendIds.length >= 2;

 
    // ✅ 그룹 생성 요청
    const handleCreateGroup = async () => {
      if (!isButtonActive) return;

      try {
        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${baseUrl}/api/groups`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            groupName: groupName,
            memberIds: selectedFriendIds,
          }),
        });

        if (!res.ok) {
      const errorText = await res.text();

      if (res.status === 403) {
        alert("로그인이 필요합니다. 다시 로그인해주세요.");
      } else if (res.status === 401 || errorText.includes("AccessDenied")) {
        alert("친구가 아닌 사용자는 그룹에 초대할 수 없습니다.");
      } else {
        alert("그룹 생성 실패: " + errorText);
      }

      console.error("응답 오류:", res.status, errorText);
      return;
    }

    alert("그룹 생성 완료!");
    onGroupCreated?.();
    onClose();
  } catch (error) {
    console.error("서버 오류:", error);
    alert("서버 오류가 발생했습니다.");
  }
};
  return (
    <div
      className="absolute top-[150px] left-[410px] z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white flex flex-col gap-[20px] px-[35px] py-[40px] w-[268px] shadow-sm border border-[#DDDDDD]">
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-[600]">그룹 생성</h2>
          <button onClick={onClose}>
            <img src={closeBtn} alt="닫기" className="w-[32px] h-[32px]" />
          </button>
        </div>

        <input
          type="text"
          placeholder="그룹명"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full h-[38px] border rounded-xl focus:outline-none px-[14px] py-[7px] text-[16px] font-[400]"
        />

        {/* 선택된 친구 목록 */}
        <div className="text-[16px] font-[400] px-[5px]">
          {selectedFriendIds
            .map((id) => friendList.find((friend) => friend.id === id)?.name)
            .join(", ")}
        </div>

        <hr className="border-t " />

        {/* 닉네임 검색 */}
        <div>
          <label className="text-[16px] font-[500] p-[5px]">친구 초대</label>
          <input
            type="text"
            placeholder="닉네임 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-[38px] mt-[10px] border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-black px-[14px] py-[7px] text-[16px] font-[400]"
          />
        </div>

        {/* 친구 선택 */}
        <div className="h-[100px] overflow-y-auto space-y-2 scrollbar-hide">
          {friendList
            .filter((friend) => friend.name.includes(searchTerm))
            .map((friend) => (
              <label
                key={friend.id}
                className="flex justify-between items-center text-[16px] font-[400] mb-[12px] px-[5px]"
              >
                {friend.name}
                <input
                  type="checkbox"
                  checked={selectedFriendIds.includes(friend.id)}
                  onChange={() => handleFriendToggle(friend.id)}
                  className="
            appearance-none w-[16px] h-[16px]
            border border-gray-400 rounded-full
            cursor-pointer
            checked:bg-black checked:shadow-[0_0_0_1.6px_black] checked:border-white"
                />
              </label>
            ))}
        </div>

        <div>
          <p className="text-[15px] font-[400] text-center mb-3">
            생성 후 그룹명 변경 불가
          </p>

          <button
            onClick={handleCreateGroup}
            className={`w-full h-[38px] rounded-[20px] py-2 text-[18px] font-[600] ${
              isButtonActive
                ? "bg-black text-white"
                : "bg-[#F4F4F4] text-opacity-20 text-black"
            }`}
            disabled={!isButtonActive}
          >
            생성하기
          </button>
        </div>
      </div>
    </div>
  );
}
