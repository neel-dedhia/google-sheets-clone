// import logo from './logo.svg';
import './App.css';
import Sheets from './components/SheetsV2';

function App() {
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <div className="App">
      <Sheets rowsCount={10} colsCount={10} />
    </div>
  );
}

export default App;
