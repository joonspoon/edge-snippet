import logo from "./uni.png";
import './App.css';
import * as Token from './swappery/tokenAddresses.js';

function App() {

  const uniswapContractAddress:string = Token.UNI;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {uniswapContractAddress}
        </p>
      </header>
    </div>
  );
}

export default App;
