import CalendarWrapper from "./CalendarWrapper";

export default function CalendarPage({ userId }) {
  return (
    <div className=" relative w-full max-w-[1440px] h-[1024px] mx-auto bg-transparent
      "
    >
      {/* 그룹 패널 */}
      <aside className="
        absolute
        left-[50px]
        top-[153px]
        w-[214px]
        h-[760px]
      [background-color:#D9D9D9]
        rounded-xl
        flex flex-col
        items-center
        pt-8
        font-bold text-gray-700
      ">
        그룹
      </aside>

      {/* 캘린더 패널 */}
      <main className="
        absolute
        left-[300px]     // 118+320+36
        top-[153px]
        w-[924px]
        h-[760px]
        bg-white
        rounded-xl
        flex flex-col
      ">
        <CalendarWrapper userId={userId} />
      </main>
    </div>
  );
}
