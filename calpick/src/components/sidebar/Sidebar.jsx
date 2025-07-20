import React, { useState, useEffect } from "react";
import axios from "axios";
import GroupListPanel from "./GroupListPanel";
import FriendItem from "./FriendItem";
import mailIcon from "../../assets/mailicon-default.svg";
import plusIcon from "../../assets/plusicon.svg";
import GroupCreateModal from "./GroupCreateModal";
import InboxModal from "./GroupInboxModal"; // Group Inbox Modal
import FriendsInboxModal from "./FriendsInboxModal"; // Friends Inbox Modal
import FriendInviteModal from "./FriendInviteModal";
import GroupViewModal from "./GroupViewModal"; // Assuming this modal is used somewhere

function Sidebar({ viewedUser, currentUserId, onCalendarClick, onGoBack }) {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [showFriendInbox, setShowFriendInbox] = useState(false);
  const [showGroupViewModal, setShowGroupViewModal] = useState(false);

  const [groupList, setGroupList] = useState([]);
  const [friendList, setFriendList] = useState([]);

  const openGroupModal = () => setIsGroupModalOpen(true);
  const closeGroupModal = () => setIsGroupModalOpen(false);
  const openInboxModal = () => setIsInboxOpen(true);
  const closeInboxModal = () => setIsInboxOpen(false);
  const openInviteModal = () => setIsInviteOpen(true);
  const closeInviteModal = () => setIsInviteOpen(false);
  const openGroupViewModal = () => setShowGroupViewModal(true);
  const closeGroupViewModal = () => setShowGroupViewModal(false);

  const handleFriendAdded = (newFriend) => {
    setFriendList((prevList) => [...prevList, newFriend]);
  };

  // ✅ 그룹 목록 불러오기 함수
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

  // ✅ 친구 목록 불러오기 함수 (API 호출 우선, 실패 시 더미 데이터)
  const fetchFriends = async () => {
    const token = localStorage.getItem("token");
    let fetchedFriends = [];

    if (token) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/friends`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (Array.isArray(response.data)) {
          fetchedFriends = response.data;
        }
      } catch (error) {
        console.error("Failed to fetch friend list from API:", error);
        // API 호출 실패 시 더미 데이터 사용
        fetchedFriends = [
          { id: 'friend1', name: '김철수' },
          { id: 'friend2', name: '이영희' },
          { id: 'friend3', name: '박민준' },
          { id: 'friend4', name: '최지우' },
          { id: 'friend5', name: '정다빈' },
          { id: 'friend6', name: '윤서아' },
          { id: 'friend7', name: '강하늘' },
          { id: 'friend8', name: '조이현' },
          { id: 'friend9', name: '송강' },
          { id: 'friend10', name: '한소희' },
          { id: 'friend11', name: '안효섭' },
          { id: 'friend12', name: '김세정' },
        ];
      }
    } else {
      console.warn("No token found for fetching friends. Using dummy data.");
      // 토큰이 없을 경우 더미 데이터 사용
      fetchedFriends = [
        { id: 'friend1', name: '김철수' },
        { id: 'friend2', name: '이영희' },
        { id: 'friend3', name: '박민준' },
        { id: 'friend4', name: '최지우' },
        { id: 'friend5', name: '정다빈' },
        { id: 'friend6', name: '윤서아' },
        { id: 'friend7', name: '강하늘' },
        { id: 'friend8', name: '조이현' },
        { id: 'friend9', name: '송강' },
        { id: 'friend10', name: '한소희' },
        { id: 'friend11', name: '안효섭' },
        { id: 'friend12', name: '김세정' },
      ];
    }
    setFriendList(fetchedFriends);
  };

  // 친구 캘린더 클릭 핸들러
  const handleFriendCalendarClick = (friendId) => {
    const friend = friendList.find(f => f.id === friendId);
    if (friend) {
      onCalendarClick(friend); // 부모 컴포넌트로 친구 객체 전달
    }
  };

  useEffect(() => {
    fetchGroups(); // 마운트 시 그룹 목록 초기 로딩
    fetchFriends(); // 마운트 시 친구 목록 초기 로딩
  }, []);

  const isViewingFriendCalendar = viewedUser.id !== currentUserId; // props에서 파생

  return (
    <>
      <aside
        className="
        absolute left-[130px] top-[186px] w-[254px] h-[715px] mt-[-36px]
        gap-8 flex flex-col items-center justify-start"
      >
        {isViewingFriendCalendar ? (
          // 친구 캘린더 뷰
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
                  <FriendItem
                    key={friend.id}
                    id={friend.id}
                    name={friend.name}
                    onCalendarClick={handleFriendCalendarClick}
                  />
                ))}
              </div>
            </div>
          </>
        )}
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
          onFriendAdded={handleFriendAdded}
        />
      )}
      {showFriendInbox && (
        <FriendsInboxModal onClose={() => setShowFriendInbox(false)} />
      )}
      {showGroupViewModal && (
        <GroupViewModal onClose={closeGroupViewModal} />
      )}
    </>
  );
}

export default Sidebar;