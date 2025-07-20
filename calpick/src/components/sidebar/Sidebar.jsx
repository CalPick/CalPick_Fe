import React, { useState, useEffect } from "react";
import GroupListPanel from "./GroupListPanel";
import FriendItem from "./FriendItem";
import mailIcon from "../../assets/mailicon-default.svg";
import plusIcon from "../../assets/plusicon.svg";
import GroupCreateModal from "./GroupCreateModal";
import InboxModal from "./GroupInboxModal";
import FriendsInboxModal from "./FriendsInboxModal";
import FriendInviteModal from "./FriendInviteModal";
import GroupViewModal from "./GroupViewModal";

// //목업 데이터
// const friendList = [
//   { id: 1, name: "이수현" },
//   { id: 2, name: "김건우" },
//   { id: 3, name: "천서현" },
//   { id: 4, name: "김인규" },
//   { id: 5, name: "김아연" },
//   { id: 6, name: "이수현" },
//   { id: 7, name: "김건우" },
//   { id: 8, name: "천서현" },
// ];

function Sidebar() {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [showFriendInbox, setShowFriendInbox] = useState(false);
  const [showGroupViewModal, setShowGroupViewModal] = useState(false);

  const [groupList, setGroupList] = useState([]);
  const [friendList, setFriendList] = useState([]);

  const handleFriendAdded = (newFriend) => {
    setFriendList((prevList) => [...prevList, newFriend]);
  };


  const openGroupModal = () => setIsGroupModalOpen(true);
  const closeGroupModal = () => setIsGroupModalOpen(false);
  const openInboxModal = () => setIsInboxOpen(true);
  const closeInboxModal = () => setIsInboxOpen(false);
  const openInviteModal = () => setIsInviteOpen(true);
  const closeInviteModal = () => setIsInviteOpen(false);

  const fetchGroups = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URLL}/api/groups/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("서버 오류 응답:", errorText);
        throw new Error("그룹 생성 실패");
      }

      const data = await res.json();
      setGroupList(data);
    } catch (err) {
      console.error("그룹 목록 조회 실패", err);
    }
  };

  useEffect(() => {
    fetchGroups(); // 마운트 시 초기 로딩
  }, []);

  return (
    <>
      <aside
        className="
        absolute left-[130px] top-[186px] w-[254px] h-[715px] mt-[-36px]
        gap-8 flex flex-col items-center justify-start"
      >
        {/* 그룹 섹션 */}
        <div className="w-[289px] h-[459px] mr-8">
          <div className="flex items-center justify-between border-b border-black pb-2">
            <span className="text-[18px] font-[600]">그룹</span>
            <div className="flex items-center gap-2">
              <img
                src={mailIcon}
                alt="메일"
                onClick={openInboxModal}
                className="w-[32px] h-[32px] cursor-pointer"
              />
              <img
                src={plusIcon}
                alt="추가"
                onClick={openGroupModal}
                className="w-[32px] h-[32px] cursor-pointer"
              />
            </div>
          </div>
          <GroupListPanel groupList={groupList} />
        </div>

        {/* 친구 섹션 */}
        <div className="w-[289px] h-[315px] mr-8">
          <div className="flex items-center justify-between border-b border-black pb-2">
            <span className="text-[18px] font-[600]">친구</span>
            <div className="flex items-center gap-2">
              <img
                src={mailIcon}
                alt="메일함"
                className="w-[32px] h-[32px] cursor-pointer"
                onClick={() => setShowFriendInbox(true)}
              />
              <img
                src={plusIcon}
                alt="추가"
                onClick={openInviteModal}
                className="w-[32px] h-[32px] cursor-pointer"
              />
            </div>
          </div>

          {/* 친구 목록*/}
          <div className="mt-4 h-[200px] overflow-y-auto scrollbar-hide flex flex-col gap-7">
            {friendList.map((friend) => (
              <FriendItem key={friend.id} friend={friend} />
            ))}
          </div>
        </div>
      </aside>

      {isInboxOpen && <InboxModal onClose={closeInboxModal} />}
      {isGroupModalOpen && (
        <GroupCreateModal
          onClose={closeGroupModal}
          onGroupCreated={fetchGroups}
        />
      )}
      
      {isInviteOpen && (
        <FriendInviteModal
          onClose={closeInviteModal}
          onFriendAdded={handleFriendAdded} // ✅ 친구 추가 시 업데이트
        />
      )}
      {showFriendInbox && (
        <FriendsInboxModal onClose={() => setShowFriendInbox(false)} />
      )}
    </>
  );
}

export default Sidebar;
