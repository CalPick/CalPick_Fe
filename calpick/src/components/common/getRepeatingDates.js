/*
getRepeatingDates.js
*/
export function getRepeatingDates({
  startDate,      // Date object
  endDate,        // Date object
  repeatType,     // "weekly" | "biweekly" | "monthly"
  repeatDays,     // [0,3,4]  // Sun~Sat (not used in monthly)
}) {
  const result = [];
  function copyDate(date) {
    return new Date(date.getTime());
  }

  if (repeatType === "weekly" || repeatType === "biweekly") {
    const weekGap = repeatType === "weekly" ? 1 : 2;
    let weekStart = copyDate(startDate);
    weekStart.setHours(0, 0, 0, 0); // Normalize time
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const days = repeatDays && repeatDays.length > 0 ? repeatDays : [startDate.getDay()];

    while (weekStart <= endDate) {
      for (let d of days) {
        let dt = copyDate(weekStart);
        dt.setDate(dt.getDate() + d);
        
        const normalizedStartDate = new Date(startDate.getTime());
        normalizedStartDate.setHours(0,0,0,0);

        if (dt >= normalizedStartDate && dt <= endDate) {
          if (!result.find(x => x.getTime() === dt.getTime())) {
            result.push(copyDate(dt));
          }
        }
      }
      weekStart.setDate(weekStart.getDate() + weekGap * 7);
    }
  } else if (repeatType === "monthly") {
    let monthCursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const targetDay = startDate.getDate();

    while (monthCursor <= endDate) {
      const y = monthCursor.getFullYear();
      const m = monthCursor.getMonth();
      const lastDay = new Date(y, m + 1, 0).getDate();

      if (targetDay <= lastDay) {
        const candidate = new Date(y, m, targetDay);
        candidate.setHours(0,0,0,0); // Normalize time

        const normalizedStartDate = new Date(startDate.getTime());
        normalizedStartDate.setHours(0,0,0,0);

        if (candidate >= normalizedStartDate && candidate <= endDate) {
          result.push(candidate);
        }
      }
      monthCursor.setMonth(monthCursor.getMonth() + 1);
    }
  }

  result.sort((a, b) => a - b);
  return result;
}
