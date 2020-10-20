import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import {Switch, Route, BrowserRouter, useHistory, Redirect   } from "react-router-dom" //BrowserRouter as Router
import { Provider, useSelector } from "react-redux";
import store from "./redux/store";
import './index.css';
import App from './App';
import AddPage from './components/Add';
import Details from './components/Details'
import { startLogin, startsetTickers, checkJWT, createJWT, } from './redux/actions'

import {firebase, firebaseConfig} from './firebase/firebase';
import Login from './components/LoginPage/Login'
import Signup from './components/LoginPage/Signup'
import {ReactReduxFirebaseProvider} from 'react-redux-firebase'


const rrfProps = {
  firebase: firebase,
  config: {
    userProfile: 'users'
  },
  dispatch: store.dispatch
}

const Start = () =>  {

  let history = useHistory();
  let jwt =  useSelector(state => state.AddTickers.jwt)
  let uid = useSelector(state => state.AddTickers.uid)
  let firebasedata = useSelector(state => state.firebase.auth.uid)
  store.dispatch(checkJWT())


  while (!firebasedata){
    return <Login />
  }

  while (!jwt || !uid){
    return false
  }

  store.dispatch(startsetTickers())

    return(
      <BrowserRouter history={history}>
       <Switch>
            <Route path='/dashboard' component={App} />
            <Route path='/add' component={AddPage} />
            <Route path='/details/:ticker' component={Details} />
            <Route path='/'>
              <Redirect to='/dashboard' />
            </Route>
        </Switch>
      </BrowserRouter>
    )
}

const x = (
  <ReactReduxFirebaseProvider {...rrfProps}>
    <Provider store={store}>
      <Start />
    </Provider>
  </ReactReduxFirebaseProvider>
)

let loadmain = false
const load = () => {

  if (!loadmain) {
    ReactDOM.render(x, document.getElementById('root'));
    loadmain = true
  }

}
load()