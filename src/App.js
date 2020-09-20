import React from 'react';
import {Link} from "react-router-dom"
import './App.css';
import LoadTickers from './components/LoadTickers';


class App extends React.Component {

  render(){
    return (
      <div className="App">
        <LoadTickers />
      </div>
    );
  }
}

export default App;