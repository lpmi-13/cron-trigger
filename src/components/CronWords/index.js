import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import MultipleChoiceButton from '../MultipleChoiceButton';
import CorrectMessage from '../CorrectMessage';
import { createDistractors, generateCronPhrase, generateSimpleCronString } from '../../util';


const CronWords = () => {

    const [cronString, setCronString] = useState(generateSimpleCronString())
    const [cronPhrase, setCronPhrase] = useState(generateCronPhrase(cronString))
    const [distractors, setDistractors] = useState(createDistractors(cronString))
    const [correctAnswer, setCorrectAnswer] = useState(false);

    const handleSelection = (event) => {
      console.log(event.target.innerText);
      console.log(cronPhrase);
      setCorrectAnswer(event.target.innerText === cronPhrase)
    }

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
            <div className="readThisCron">
                {cronString}
            </div>
            <div className="multipleChoice">
                {distractors.map(choice => {
                    return <MultipleChoiceButton cronPhrase={generateCronPhrase(choice)} key={choice} onClick={handleSelection} />
                })}
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
          <CorrectMessage active={correctAnswer}/>
        </>
    )
}

export default CronWords;