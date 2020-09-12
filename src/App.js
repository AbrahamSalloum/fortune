import React from 'react';
import {Link} from "react-router-dom"
import './App.css';
import LoadTickers from './components/LoadTickers';


class App extends React.Component {

  render(){
    return (
      <div className="App">
        <div className="AddHeader">
          <h1>Dashboard</h1> <Link to="/add">
          <button className="addBtn">
            <span>Add</span>
          </button></Link>
        </div>
        <LoadTickers />
      </div>
    );
  }
}

export default App;