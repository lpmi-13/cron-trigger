import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import MultipleChoiceButton from '../MultipleChoiceButton';
import CorrectMessage from '../CorrectMessage';
import { createDistractors, generateCronPhrase, generateSimpleCronString } from '../../util';

const PAUSE_LENGTH = 3000;

const CronWords = ({ firstView, onView }) => {

    const [cronString, setCronString] = useState(generateSimpleCronString())
    const [cronPhrase, setCronPhrase] = useState(generateCronPhrase(cronString))
    const [distractors, setDistractors] = useState(createDistractors(cronString))
    const [correctAnswer, setCorrectAnswer] = useState(false);

    const handleSelection = (event) => {
      setCorrectAnswer(event.target.innerText === cronPhrase)
    }

    useEffect(() => {
        setTimeout(() => {
          onView(false);
        }, PAUSE_LENGTH)
    })

    useEffect(() => {
        setDistractors(createDistractors(cronString));
        setCronPhrase(generateCronPhrase(cronString));
    }, [cronString])

    const handleClickNext = () => {
        setCronString(generateSimpleCronString());
        setCorrectAnswer(false);
    }

    return (
        <>
            {
              firstView && (
               <div className="firstView">
                click the correct answer for the cron
               </div>
               )
            }
            <div className="readThisCron">
                <pre>
                  {cronString}
                </pre>
            </div>
            <div className="multipleChoice">
                {distractors.map(choice => {
                    return <MultipleChoiceButton phrase={generateCronPhrase(choice)} key={choice} onClick={handleSelection} />
                })}
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

export default CronWords;