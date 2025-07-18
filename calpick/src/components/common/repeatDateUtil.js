// getRepeatingDates.js
export function getRepeatingDates({
  startDate,      // Date 객체
  endDate,        // Date 객체
  repeatType,     // "weekly" | "biweekly" | "monthly"
  repeatDays,     // [0,3,4]  // 일~토
}) {
  const result = [];
  const msInDay = 24 * 60 * 60 * 1000;

  // repeatDays가 없으면 시작 요일만
  const days = repeatDays && repeatDays.length > 0 ? repeatDays : [startDate.getDay()];

  // date 복사 유틸
  function copyDate(date) {
    return new Date(date.getTime());
  }

  if (repeatType === "weekly" || repeatType === "biweekly") {
    // 반복 간격: 1주 or 2주
    const weekGap = repeatType === "weekly" ? 1 : 2;
    // 시작 기준일자(시작일 주의 일요일)
    let weekStart = copyDate(startDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    while (weekStart <= endDate) {
      for (let d of days) {
        // 해당 주의 d요일
        let dt = copyDate(weekStart);
        dt.setDate(dt.getDate() + d);
        if (dt >= startDate && dt <= endDate) {
          // 중복 방지
          if (!result.find(x => x.getTime() === dt.getTime())) result.push(copyDate(dt));
        }
      }
      weekStart.setDate(weekStart.getDate() + weekGap * 7);
    }
  } else if (repeatType === "monthly") {
    // ---------- 여기부터 수정 ----------
    let monthCursor = copyDate(startDate);
    const targetDay = startDate.getDate();
    while (monthCursor <= endDate) {
      const y = monthCursor.getFullYear();
      const m = monthCursor.getMonth();
      // 각 달의 마지막 일 구하기
      const lastDay = new Date(y, m + 1, 0).getDate();
      if (targetDay <= lastDay) {
        const candidate = new Date(y, m, targetDay,
          startDate.getHours(),
          startDate.getMinutes(),
          startDate.getSeconds()
        );
        if (candidate >= startDate && candidate <= endDate) {
          result.push(candidate);
        }
      }
      // 다음 달로 이동
      monthCursor.setMonth(monthCursor.getMonth() + 1);
      // rollover 방지 (예: 1월 31일 → 2월 28/29일 → 3월 31일 등)
      monthCursor.setDate(1);
    }
    // ---------- 여기까지 수정 ----------
  }

  // 날짜 오름차순 정렬
  result.sort((a, b) => a - b);
  return result;
}
