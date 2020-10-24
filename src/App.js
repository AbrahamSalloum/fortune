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

 const PrivateRoute = ({uid, ...props}) =>  uid ? <Route {...props}>{props.children}</Route> : <Redirect to="/login" />

  return (
      <Switch>
        <Route path='/' exact>
          <Redirect to="/dashboard" />
        </Route>
        <PrivateRoute uid={uid} path='/dashboard'>
          <LoadTickers />
        </PrivateRoute>
        <PrivateRoute uid={uid} path='/add' >
         <AddPage />
        </PrivateRoute>
        <PrivateRoute uid={uid} path='/details/:ticker'>
          <Details />
        </PrivateRoute>
        <Route path='/login' >
          <Login />
        </Route>
      </Switch>
    );
}

export default App;