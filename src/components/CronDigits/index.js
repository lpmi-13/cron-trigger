import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { generateCronPhrase, generateCronString } from '../../util';

import CronDigitsList from '../CronDigitsList';
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

const PAUSE_LENGTH = 3000;

const CronDigits = ({ firstView, onView }) => {

  const newCron = generateCronString();

  const [cronString, setCronString] = useState(newCron)
  const [cronPhrase, setCronPhrase] = useState(generateCronPhrase(cronString))
  const [mixedUpCron, setMixedUpCron] = useState(mixUpDigits(cronString))
  const [correctAnswer, setCorrectAnswer] = useState(false);

  const handleClickNext = () => {
    setCronString(generateCronString())
    setCorrectAnswer(false);
  }

  const handleReorderDigits = (sequence) =>  {
    const reconstructed = sequence.map(t => t.item).join(' ')
    setCorrectAnswer(reconstructed === cronString)
  }

  useEffect(() => {
    setTimeout(() => {
      onView(false);
    }, PAUSE_LENGTH)
  })

  useEffect(() => {
    setCronPhrase(generateCronPhrase(cronString))
    setMixedUpCron(mixUpDigits(cronString))
  }, [cronString]);

    return (
        <>
          {firstView && (
            <div className="firstView">
              drag and re-arrange to match the phrase
            </div>
          )}
          <CronDigitsList cronDigits={mixedUpCron} handleReorder={handleReorderDigits} />
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
            next
          </motion.button>
          <CorrectMessage active={correctAnswer}/>
        </>
    )
}

export default CronDigits;