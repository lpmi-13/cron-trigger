import { useState } from 'react';
import './App.scss';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

import Layout from './components/Layout';
import CronDigits from './components/CronDigits';
import CronWords from './components/CronWords';
import HelpModal from './components/HelpModal';

const App = () => {

  const [mode, setMode] = useState(true)
  const [modalActive, setModalActive] = useState(false);

  const toggleMode = () => setMode(!mode)
  const handleClickModal = () => setModalActive(!modalActive);

  return (
    <Layout>
      <header className="App-header">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`modeButton ${mode ? 'active' : 'inactive'}`}
            disabled={mode}
            onClick={toggleMode}
            aria-label="write a cron"
            >
            Write a Cron
          </motion.button>
          <div role="button" aria-label="help info" className="top-icons">
            <FontAwesomeIcon icon={faQuestionCircle} onClick={handleClickModal} />
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`modeButton ${mode ? 'inactive' : 'active'}`}
            disabled={!mode}
            onClick={toggleMode}
            aria-label="read a cron"
            >
            Read a Cron
          </motion.button>
      </header>
      <main className="App-body">
        {
          mode
          ? <CronDigits />
          : <CronWords />
        }
      </main>
      <HelpModal active={modalActive} onClickClose={handleClickModal}/>
    </Layout>
  );
}

export default App;
