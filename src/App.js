import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom" //BrowserRouter as Router
import {useSelector } from "react-redux";
import './index.css';
import AddPage from './components/Add';
import Details from './components/Details'
import Login from './components/LoginPage/Login'
import LoadTickers from './components/LoadTickers';


const App = () => {
  let loggedin = useSelector(state => state.AddTickers.loggedin)
  const PrivateRoute = ({...props}) => {

    let uid = sessionStorage.getItem('uid')
    return (!!uid || !!loggedin) ? <Route {...props}>{props.children}</Route> : <Redirect to="/login" />
  }

  return (
    <Switch>
      <Route path='/' exact>
        <Redirect to="/dashboard" />
      </Route>
      <PrivateRoute path='/dashboard'>
        <LoadTickers />
      </PrivateRoute>
      <PrivateRoute path='/add' >
        <AddPage />
      </PrivateRoute>
      <PrivateRoute path='/details/:ticker'>
        <Details />
      </PrivateRoute>
      <Route path='/login' >
        <Login />
      </Route>
    </Switch>
  );
}

export default App;