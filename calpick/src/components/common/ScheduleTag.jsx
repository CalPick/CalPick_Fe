import React from "react";
export default function ScheduleTag({ title, color }) {
  let shownTitle = title.length > 7 ? title.slice(0, 7) + "…" : title;
  return (
    <div
      className="inline-block rounded-full px-3 py-1 mt-1 mb-1 text-base font-medium"
      style={{
        background: color,
        color: "#222",
        maxWidth: "90%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
      }}
      title={title}
    >
      {shownTitle}
    </div>
  );
}
