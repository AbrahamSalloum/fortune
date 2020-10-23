import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom" //BrowserRouter as Router
import {useSelector } from "react-redux";
import './index.css';
import AddPage from './components/Add';
import Details from './components/Details'
import Login from './components/LoginPage/Login'
import LoadTickers from './components/LoadTickers';



const App = () => {
 let uid = useSelector(state => state.firebase.auth.uid)

  //uid = true
    return (
<div>
        <Switch>
          <Route path='/' exact>
            <Redirect to="/dashboard" />
          </ Route>
          <Route path='/dashboard'>
            {!!uid ? <LoadTickers /> : <Redirect to="/login" /> }
          </ Route>
          <Route path='/add' >
            {!!uid ? <AddPage /> : <Redirect to="/login" />}
          </ Route>
          <Route path='/details/:ticker'>
            {!!uid ? <Details /> : <Redirect to="/login" />}
          </ Route>
          <Route path='/login' >
            <Login />
          </ Route>
        </Switch>
      </div>

    );
}

export default App;