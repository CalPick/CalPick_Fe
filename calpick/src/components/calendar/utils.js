// src/components/calendar/utils.js
export function getMonthDates(year, month) {
  const dates = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0); // 해당 월 마지막 날짜

  // 1일의 요일 (0:일요일, 6:토요일)
  const startDayOfWeek = firstDay.getDay();

  // 캘린더 6행 * 7열 = 42칸
  const totalCells = 42;

  // 이전달 마지막 날짜
  const prevLastDay = new Date(year, month, 0).getDate();

  // 42칸 돌면서 날짜 채우기
  for (let i = 0; i < totalCells; i++) {
    let dateObj;

    if (i < startDayOfWeek) {
      // 이전 달 날짜
      dateObj = new Date(year, month - 1, prevLastDay - (startDayOfWeek - 1) + i);
    } else if (i >= startDayOfWeek && i < startDayOfWeek + lastDay.getDate()) {
      // 이번 달 날짜
      dateObj = new Date(year, month, i - startDayOfWeek + 1);
    } else {
      // 다음 달 날짜
      dateObj = new Date(year, month + 1, i - startDayOfWeek - lastDay.getDate() + 1);
    }

    dates.push(dateObj);
  }

  return dates;
}
