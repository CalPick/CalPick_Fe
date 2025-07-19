import React from "react";
export default function ScheduleTag({ title, color }) {
  // showTitle (표시 텍스트)
  const showTitle = title.length > 7 ? title.slice(0, 7) + "…" : title;
  return (
    <div
      className="
        flex items-center
        rounded-full pl-2 pr-2 py-[1px] mt-0 mb-1 text-[13px] font-medium
        max-w-[90%]
        h-[16px]
        overflow-hidden whitespace-nowrap text-ellipsis
      "
      style={{
        background: color,
        color: "#222",
      }}
      title={title}
    >
      {showTitle}
    </div>
  );
}
