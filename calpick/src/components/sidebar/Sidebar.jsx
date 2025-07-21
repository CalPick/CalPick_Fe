import React, { useState, useEffect } from "react";
import axios from "axios";
import GroupListPanel from "./GroupListPanel";
import FriendItem from "./FriendItem";
import mailIcon from "../../assets/mailicon-default.svg";
import plusIcon from "../../assets/plusicon.svg";
import GroupCreateModal from "./GroupCreateModal";
import InboxModal from "./GroupInboxModal";
import FriendsInboxModal from "./FriendsInboxModal";
import FriendInviteModal from "./FriendInviteModal";

function Sidebar({ onCalendarClick, onGoBack, viewedUser }) {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isGroupInboxOpen, setIsGroupInboxOpen] = useState(false);
  const [isFriendInviteOpen, setIsFriendInviteOpen] = useState(false);
  const [isFriendInboxOpen, setIsFriendInboxOpen] = useState(false);

  const [groupList, setGroupList] = useState([]);
  const [friendList, setFriendList] = useState([]);

  const currentUserId = localStorage.getItem("userId");

  const openGroupModal = () => setIsGroupModalOpen(true);
  const closeGroupModal = () => setIsGroupModalOpen(false);
  const openGroupInboxModal = () => setIsGroupInboxOpen(true);
  const closeGroupInboxModal = () => setIsGroupInboxOpen(false);
  const openFriendInviteModal = () => setIsFriendInviteOpen(true);
  const closeFriendInviteModal = () => setIsFriendInviteOpen(false);

  // ✅ 친구 목록 서버에서 불러오기
  const refreshFriendList = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/friends`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // ✅ 수신자 기준으로 필터링
      setFriendList(data.filter(f => f.status === "ACCEPTED"));
    } catch {
      console.error("친구 목록 불러오기 실패");
    }
  };

  const fetchGroups = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/groups/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setGroupList(data);
    } catch {
      console.error("그룹 목록 불러오기 실패");
    }
  };

  useEffect(() => {
    fetchGroups();
    refreshFriendList();
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshFriendList, 30000);
    return () => clearInterval(interval);
  }, []);

  // const isViewingFriendCalendar =
  //   viewedUser && viewedUser.id !== currentUserId;

  const handleFriendCalendarClick = (userId, name) => {
    onCalendarClick({ id: userId, name });
  };

  return (
    <>
      <aside className="absolute left-[130px] top-[186px] w-[254px] h-[715px] mt-[-36px] gap-8 flex flex-col items-center justify-start">
        {isViewingFriendCalendar ? (
          <div className="w-[289px] h-auto mr-8">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <span className="text-[18px] font-[600]">친구 달력</span>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-center">
              <p className="text-xl font-semibold">{viewedUser.name}</p>
              <p className="text-sm text-gray-500">ID: {viewedUser.id}</p>
              <button
                onClick={onGoBack}
                className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800 transition-colors"
              >
                내 캘린더로 돌아가기
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 그룹 섹션 */}
            <div className="w-[289px] h-[459px] mr-8 flex-shrink-0">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <span className="text-[18px] font-[600]">그룹</span>
                <div className="flex items-center gap-2">
                  <img
                    src={mailIcon}
                    alt="메일"
                    onClick={openGroupInboxModal}
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
            <div className="w-[289px] mr-8 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between border-b border-black pb-2 flex-shrink-0">
                <span className="text-[18px] font-[600]">친구</span>
                <div className="flex items-center gap-2">
                  <img
                    src={mailIcon}
                    alt="메일함"
                    className="w-[32px] h-[32px] cursor-pointer"
                    onClick={() => setIsFriendInboxOpen(true)}
                  />
                  <img
                    src={plusIcon}
                    alt="추가"
                    onClick={openFriendInviteModal}
                    className="w-[32px] h-[32px] cursor-pointer"
                  />
                </div>
              </div>
              <div className="mt-4 flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-7">
                {friendList.map((f, index) => (
                  <FriendItem
                    key={index}
                    friend={{
                      id: f.addresseeUserId,
                      name: f.addresseeNickname,
                    }}
                    onCalendarClick={handleFriendCalendarClick}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </aside>

      {isGroupInboxOpen && <InboxModal onClose={closeGroupInboxModal} />}
      {isGroupModalOpen && (
        <GroupCreateModal onClose={closeGroupModal} onGroupCreated={fetchGroups} />
      )}
      {isFriendInviteOpen && (
        <FriendInviteModal
          onClose={closeFriendInviteModal}
          onFriendAdded={refreshFriendList} // ✅ 목록 새로고침
        />
      )}
      {isFriendInboxOpen && (
        <FriendsInboxModal
          onClose={() => setIsFriendInboxOpen(false)}
          onFriendAccepted={refreshFriendList}
          onFriendRejected={refreshFriendList}
        />
      )}
    </>
  );
}

export default Sidebar;
