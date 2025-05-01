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

module.exports = {
  getTime,
  getMonthsBetweenDates,
  getDaysInMonthFromTimestamp,
  getMilisecondsOnMongth,
  timeToMilliseconds,
  isSameDay,
};
