
// to deal with 24-hour format
const transformNumberToHours = (number) => number > 12 ? number - 12 : number;
const amOrPm = (number) => number >= 12 ? 'PM' : 'AM';

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
  switch(day.slice(-1)){
    case '':
      return '';
    case '1':
      return 'st';
    case '2':
      return 'nd';
    case '3':
      return 'rd';
    default:
      return 'th';
  }
}

const getMinutes = (minutes) => minutes === '*' ? 'every minute after' : `at ${minutes} minutes after`;

const getHours = (hours) => {
  const suffix = hours === '*' ? '' : amOrPm(hours);
  return hours === '*' ? 'every hour' : `${transformNumberToHours(hours)}${suffix}`;
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


// we need to generate stuff like
// At 8AM every day ( 0 8 * * *)
// At minute 45 every Tuesday ( 45 * * * 2)
// At 7:30AM on Sunday (30 7 * * 0)
// At 2PM and 6PM every Wednesday ( 0 14,18 * * 3)
// Every 15 minutes ( 0,15,30,45 * * * *)
// At 4:05AM every day ( 5 4 * * *)
// At 11PM every day in August (0 23 * 8 *)
// at 8PM every day on days 12-20 of the month ( 0 20 12-20 * *)
// At 3:23PM on the first day of every month ( 23 3 1 * *)
// at 2AM and 5PM on Monday in July ( 0 2,17 * 8 1)

export const cronStringArray = [
  '10 * * * *',
  '* 3 * * *',
  '* * * 2 *',
  '* * * * 1',
  '30 4 * * *',
  '25 15 * * *',
  '45 20 * 10 *',
  '20 1 * * 5',
  '18 5 * 4 3',
  '22 20 3 2 *',
  '* * 5 2 5',
  '10 12 5 * 5',
  '30 6 10 * *',
  '55 10 15 4 1',
  '25 * 1 3 3',
  '12 12 2 * *',
]