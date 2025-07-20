import React from "react";
import GroupItem from "./GroupItem";

function GroupListPanel({ groupList }) {
  return (
    <div className="flex flex-col gap-4 mt-4 h-[400px] overflow-y-auto pr-1 scrollbar-hide">
      {groupList &&
        groupList.map((group, index) => (
          <GroupItem
            key={index}
            groupName={group.groupName}
            members={group.members}
          />
        ))}
    </div>
  );
}

export default GroupListPanel;
