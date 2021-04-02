import { useState } from 'react';
import './App.scss';
import { motion } from 'framer-motion';

import CronDigits from './components/CronDigits';
import CronWords from './components/CronWords';
// import SampleHorizontalList from './components/SampleHorizontalList';

const App = () => {

  const [mode, setMode] = useState(true)

  const toggleMode = () => setMode(!mode)
  return (
    <div className="App">
      <header className="App-header">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`modeButton ${mode ? 'active' : 'inactive'}`}
            disabled={mode}
            onClick={toggleMode}
            aria-label="read a cron"
            >
            Read a Cron
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`modeButton ${mode ? 'inactive' : 'active'}`}
            disabled={!mode}
            onClick={toggleMode}
            aria-label="write a cron"
            >
            Write a Cron
          </motion.button>
      </header>
      <main className="App-body">
        {
          mode
          ? <CronDigits />
          : <CronWords />
        }
      </main>
    </div>
  );
}

export default App;
