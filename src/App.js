import './App.css';

import CronDigits from './components/CronDigits';
import CronWords from './components/CronWords';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Cron Trigger
      </header>
      <main className="App-body">
        <CronDigits />
        <CronWords />
      </main>
    </div>
  );
}

export default App;
