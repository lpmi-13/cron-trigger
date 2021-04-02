
// to deal with 24-hour format
const transformNumberToHours = (number) => number > 12 ? number - 12 : number;
const amOrPm = (number) => number >= 12 ? 'PM' : 'AM';

const getMinutes = (minutes) => minutes === '*' ? 'every minute after' : `at ${minutes} minutes after`;

const getHours = (hours) => {
  if (hours === 0) {
    return '12AM';
  } else {
    const suffix = hours === '*' ? '' : amOrPm(hours);
    return hours === '*' ? 'every hour' : `${transformNumberToHours(hours)}${suffix}`;
  }
}

const monthNameMap = {
  '1': 'January',
  '2': 'February',
  '3': 'March',
  '4': 'April',
  '5': 'May',
  '6': 'June',
  '7': 'July',
  '8': 'August',
  '9': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
}

const dayNameMap = {
  // you can sometimes specify 'Sunday' as '7', but that's non-standard, so I didn't include it
    '0': 'sunday',
    '1': 'monday',
    '2': 'tuesday',
    '3': 'wednesday',
    '4': 'thursday',
    '5': 'friday',
    '6': 'saturday',
};

const dayOfMonthSuffix = (day) => {
  switch(day){
    case '':
      return '';
    case '1':
    case '21':
    case '31':
      return 'st';
    case '2':
    case '22':
      return 'nd';
    case '3':
    case '23':
      return 'rd';
    default:
      return 'th';
  }
}

// this is a terrible name, and I feel terrible for creating it
const getDayOfMonthAndMonthAndDayOfWeek = (dayOfMonth, month, dayOfWeek) => {
  // we need to combine the day of month, month and day of week check into one function
  // the possibilities are:
  // DAY OF MONTH  --  MONTH  --  DAY OF WEEK
  //     *               *            *            "every day in every month"
  //     *               5            *            "every day in May"
  //     *               *            5            "every Friday"
  //     *               5            5            "every Friday in May"
  //     5               *            *            "on the 5th day of every month"
  //     5               5            *            "on the 5th day of May"
  //     5               *            5            "on the 5th day and Fridays every month"
  //     5               5            5            "on the 5th day and Fridays in May"

  let computedMonthPhrase;
    if (dayOfMonth === '*') {
      if (month === '*') {
        if (dayOfWeek === '*') {
          //     *               *            *            "every day in every month"
          computedMonthPhrase = 'every day in every month'
        } else {
          //     *               *            5            "every Friday"
          computedMonthPhrase = `every ${dayNameMap[dayOfWeek]}`
        }
      } else {
        if (dayOfWeek === '*') {
          //     *               5            *            "every day in May"
          computedMonthPhrase = `every day in ${monthNameMap[month]}`
        } else {
          //     *               5            5            "every Friday in May"
          computedMonthPhrase = `every ${dayNameMap[dayOfWeek]} in ${monthNameMap[month]}`
        }
      }
    } else {
      if (month === '*') {
        if (dayOfWeek === '*') {
          //     5               *            *            "on the 5th day of every month"
          computedMonthPhrase = `on the ${dayOfMonth}${dayOfMonthSuffix(dayOfMonth)} day of every month`
        } else {
          //     5               *            5            "on the 5th day and Fridays every month"
          computedMonthPhrase = `on the ${dayOfMonth}${dayOfMonthSuffix(dayOfMonth)} day and ${dayNameMap[dayOfWeek]}s every month`
        }
      } else {
        if (dayOfWeek === '*') {
          //     5               5            *            "on the 5th day of May"
          computedMonthPhrase = `on the ${dayOfMonth}${dayOfMonthSuffix(dayOfMonth)} day of ${monthNameMap[month]}`
        } else {
          //     5               5            5            "on the 5th day and Fridays in May"
          computedMonthPhrase = `on the ${dayOfMonth}${dayOfMonthSuffix(dayOfMonth)} day and ${dayNameMap[dayOfWeek]}s in ${monthNameMap[month]}`
        }
      }
    }

  return `${computedMonthPhrase}`
}

export const generateCronPhrase = phraseWithDigits => {
  const [ minutes, hours, dayOfMonth, month, dayOfWeek ] = phraseWithDigits.split(' ');

  const minuteChunk = getMinutes(minutes);
  const hoursChunk = getHours(hours);

  const dayMonthWeekChunk = getDayOfMonthAndMonthAndDayOfWeek(dayOfMonth, month, dayOfWeek);

  return `${minuteChunk} ${hoursChunk} ${dayMonthWeekChunk}`
}


const numberRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const generateCronString = () => {
  // this can be a zero
  const minute = () => Math.random() < 0.5 ? '*' : numberRange(0, 59);
  // this can be zero
  const hour = () => Math.random() < 0.5 ? '*' : numberRange(0, 23);
  // this has to start with 1
  const month = () =>  Math.random() < 0.5 ? '*' : numberRange(1, 12);
  const dayOfMonth = () => {
    let generatedDay;
    if (month === 2) {
      generatedDay = numberRange(1, 28);
    } else if (month === 4 || month === 6 || month === 9 || month === 11) {
      generatedDay = numberRange(1,30);
    } else {
      generatedDay = numberRange(1,31);
    }
    return Math.random() < 0.5 ? '*' : generatedDay;
  }
  // this can be 0, since 7 == Sunday is non-standard
  const dayOfWeek = () => Math.random() < 0.5 ? '*' : numberRange(0,6);

  const genMinute = minute()
  const genHour = hour();
  const genMonth = month()
  const genDayOfMonth = dayOfMonth()
  const genDayOfWeek = dayOfWeek();

  const fullString = `${genMinute} ${genHour} ${genDayOfMonth} ${genMonth} ${genDayOfWeek}`;
  // since the correctness check happens after you move something, it doesn't know that this is
  // already correct, and there's not really much sense practicing it anyway
  if (fullString === '* * * * *') {
      return generateCronString()
  }
  return fullString;
}