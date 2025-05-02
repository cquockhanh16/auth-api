function getTime(time, type = "day") {
  let formatTime = new Date(time);
  switch (type) {
    case "day":
      return formatTime.getDate();
    case "month":
      return formatTime.getMonth() + 1;
    case "year":
      return formatTime.getFullYear();
    default:
      return formatTime.getDate();
  }
}

const getMonthsBetweenDates = (ms1, ms2) => {
  const date1 = new Date(+ms1);
  const date2 = new Date(+ms2);

  // Lấy năm và tháng của từng ngày
  const year1 = date1.getFullYear();
  const month1 = date1.getMonth();

  const year2 = date2.getFullYear();
  const month2 = date2.getMonth();

  // Tính số tháng chênh lệch
  const months = (year2 - year1) * 12 + (month2 - month1);

  // Trả về giá trị tuyệt đối để không bị âm nếu date2 < date1
  return Math.abs(months);
};

function countWeekdays(year, month) {
  // Lưu ý: Tháng trong JavaScript bắt đầu từ 0 (0 = tháng 1, 11 = tháng 12)
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Lấy số ngày trong tháng
  let count = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const dayOfWeek = currentDate.getDay(); // 0 (Chủ Nhật) đến 6 (Thứ Bảy)

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++; // Tăng biến đếm nếu không phải Thứ Bảy hoặc Chủ Nhật
    }
  }

  return count;
}

function countWeekdays(year, month) {
  // Lưu ý: Tháng trong JavaScript bắt đầu từ 0 (0 = tháng 1, 11 = tháng 12)
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Lấy số ngày trong tháng
  let count = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month + 1, day);
    const dayOfWeek = currentDate.getDay(); // 0 (Chủ Nhật) đến 6 (Thứ Bảy)

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++; // Tăng biến đếm nếu không phải Thứ Bảy (6) hoặc Chủ Nhật (0)
    }
  }

  return count;
}

function getDaysInMonthFromTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11
  return countWeekdays(year, month);
}

function getMilisecondsOnMongth(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11
  return new Date(year, month + 2, 0).getTime();
}

function timeToMilliseconds(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours * 3600 + minutes * 60) * 1000;
}

function isSameDay(timestamp1, timestamp2) {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  // Đặt về cùng thời điểm 00:00:00.000
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);

  return date1.getTime() === date2.getTime();
}
// function getStartOfDayUTC(timestamp) {
//   // Bước 1: Validate timestamp
//   const ts = Number(timestamp);
//   if (isNaN(ts)) throw new Error("Invalid timestamp");

//   // Bước 2: Chuyển đổi trực tiếp không qua timezone local
//   const utcMidnight = new Date(ts);
//   utcMidnight.setUTCHours(0, 0, 0, 0); // Force về 00:00:00.000 UTC

//   // Bước 3: Trả về timestamp chính xác
//   return utcMidnight.getTime();
// }

function getStartOfDayUTC(timestamp) {
  // Bước 1: Ép kiểu và validate
  const ts = Number(timestamp);
  if (isNaN(ts)) throw new Error("Invalid timestamp");

  // Bước 2: Tạo Date object và set về 00:00 UTC
  const date = new Date(ts);
  const utcDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );

  // Bước 3: Trả về timestamp
  return utcDate.getTime();
}

// function getStartOfDayUTC(timestamp) {
//   // 1. Ép kiểu chắc chắn
//   const ts = Math.floor(Number(timestamp));

//   // 2. Tính số miliseconds trong 1 ngày
//   const MS_PER_DAY = 86400000;

//   // 3. Làm tròn về đầu ngày UTC
//   return Math.floor(ts / MS_PER_DAY) * MS_PER_DAY;
// }

// function getStartOfDayUTC(timestamp) {
//   const SECONDS_PER_DAY = 86400;
//   const timestampSeconds = Math.floor(timestamp / 1000);
//   const daysSinceEpoch = Math.floor(timestampSeconds / SECONDS_PER_DAY);
//   return daysSinceEpoch * SECONDS_PER_DAY * 1000;
// }

const normalizeTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

module.exports = {
  getTime,
  getMonthsBetweenDates,
  getDaysInMonthFromTimestamp,
  getMilisecondsOnMongth,
  timeToMilliseconds,
  isSameDay,
  getStartOfDayUTC,
};
