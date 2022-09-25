import './App.css';
import Sheets from './components/SheetsV2';

function App() {
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <div className="App">
      <Sheets rowsCount={20} colsCount={20} />
    </div>
  );
}

export default App;
