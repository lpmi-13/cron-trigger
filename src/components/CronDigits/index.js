import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { cronStringArray, generateCronPhrase } from '../../util';

import SampleHorizontalList from '../SampleHorizontalList';
import CorrectMessage from '../CorrectMessage';

// some good old Fisher-Yates with a very hacky recursion to force no item to go back to its original position
const shuffle = arr => {
  let arrCopy = [...arr]

  var i = arr.length, j, temp;
  while(--i > 0){
    j = Math.floor(Math.random()*(i+1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }

  let completelyRandomized = true;
  // in order to be a good exercise, we don't want any of the items to show up in the same place
  // as the original cron element, and sometimes after a sort, they can move back to where they started,
  // so if any of them do that, we force a re-shuffle until they're all in a different place from
  // the original
  arr.forEach((element, index) => {
    if (arr[index].originalIndex === arrCopy[index].originalIndex) {
      completelyRandomized = false;
    }
  })
  if (completelyRandomized) {
    return arr;
  } else {
    return shuffle(arrCopy);
  }
}

const mixUpDigits = (cronArray) => {
  const newArray = cronArray.split(' ').map((item, index) => {
    return {'item': item, 'originalIndex': index}
  });
  const shuffled = shuffle(newArray); 
  return shuffled;
}

// const PAUSE_LENGTH = 1000;

const CronDigits = () => {

  const [cronIndex, setCronIndex] = useState(0);
  const [cronPhrase, setCronPhrase] = useState(generateCronPhrase(cronStringArray[cronIndex]))
  const [mixedUpCron, setMixedUpCron] = useState(mixUpDigits(cronStringArray[cronIndex]))
  const [correctAnswer, setCorrectAnswer] = useState(false);

  const totalCrons = cronStringArray.length

  const handleClickNext = () => {
    cronIndex >= totalCrons - 1 ? setCronIndex(0) : setCronIndex(cronIndex + 1);
    setCorrectAnswer(false);
  }

  const handleReorderDigits = (sequence) => {
    const reconstructed = sequence.map(t => t.item).join(' ')
    const originalCron = cronStringArray[cronIndex];
    setCorrectAnswer(reconstructed === originalCron)
  }

  useEffect(() => {
    setCronPhrase(generateCronPhrase(cronStringArray[cronIndex]))
    setMixedUpCron(mixUpDigits(cronStringArray[cronIndex]))
  }, [cronIndex]);

    return (
        <div>
          <SampleHorizontalList cronDigits={mixedUpCron} handleReorder={handleReorderDigits} />
          {/* <pre>{cronStringArray[cronIndex]}</pre> */}
          <div className="cronPhrase">
            {cronPhrase}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`nextCron`}
            onClick={handleClickNext}
            aria-label="write a cron"
            >
            next cron
          </motion.button>
          {correctAnswer && <CorrectMessage />}
        </div>
    )
}

export default CronDigits;