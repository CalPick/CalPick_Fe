
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import GroupListPanel from "./GroupListPanel";
import FriendItem from "./FriendItem";
import mailIcon from "../../assets/mailicon-default.svg";
import plusIcon from "../../assets/plusicon.svg";
import GroupCreateModal from "./GroupCreateModal";
import InboxModal from "./InboxModal";

// *** MODIFIED: `friendList` prop is removed ***
function Sidebar({ viewedUser, currentUserId, onCalendarClick, onGoBack }) {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [groupList, setGroupList] = useState([]);
  
  // *** ADDED: State for friend list is now managed here ***
  const [friendList, setFriendList] = useState([]);

  const openGroupModal = () => setIsGroupModalOpen(true);
  const closeGroupModal = () => setIsGroupModalOpen(false);
  const openInboxModal = () => setIsInboxOpen(true);
  const closeInboxModal = () => setIsInboxOpen(false);

  // *** ADDED: useEffect to fetch friend list ***
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/friends`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (Array.isArray(response.data)) {
          setFriendList(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch friend list:", error);
        setFriendList([]);
      }
    };

    fetchFriends();
  }, []); // Runs once on mount

  const fetchGroups = async () => {
    // ... (group fetching logic remains the same)
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // *** ADDED: Handler to find the friend object and pass it up ***
  const handleFriendCalendarClick = (friendId) => {
    const friend = friendList.find(f => f.id === friendId);
    if (friend) {
      onCalendarClick(friend); // Pass the whole object to the parent
    }
  };

  const isViewingFriendCalendar = viewedUser.id !== currentUserId;

  return (
    <>
      <aside className="absolute left-[130px] top-[186px] w-[254px] h-[715px] mt-[-36px] gap-8 flex flex-col items-center justify-start">
        {isViewingFriendCalendar ? (
          // ... (Friend Calendar View remains the same)
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
            {/* ... (Group Section remains the same) */}
            <div className="w-[289px] h-[459px] mr-8 flex-shrink-0">
               <div className="flex items-center justify-between border-b border-black pb-2">
                 <span className="text-[18px] font-[600]">그룹</span>
                 <div className="flex items-center gap-2">
                   <img src={mailIcon} alt="메일" onClick={openInboxModal} className="cursor-pointer" />
                   <img src={plusIcon} alt="추가" onClick={openGroupModal} className="cursor-pointer" />
                 </div>
               </div>
               <GroupListPanel groupList={groupList} />
             </div>

            <div className="w-[289px] mr-8 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between border-b border-black pb-2 flex-shrink-0">
                <span className="text-[18px] font-[600]">친구</span>
                <div className="flex items-center gap-2">
                  <img src={mailIcon} alt="메일" />
                  <img src={plusIcon} alt="추가" />
                </div>
              </div>
              <div className="mt-4 flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-7">
                {friendList.map((friend) => (
                  // *** MODIFIED: Passes click to the new internal handler ***
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
      {isGroupModalOpen && <GroupCreateModal onClose={closeGroupModal} onGroupCreated={fetchGroups} />}
    </>
  );
}

export default Sidebar;