import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, BrowserRouter, Router, useHistory, Redirect   } from "react-router-dom" //BrowserRouter as Router
import { Provider, useSelector } from "react-redux";
import store from "./redux/store";
import './index.css';
import App from './App';
import AddPage from './components/Add';
import Details from './components/Details'
import {startsetTickers, checkJWT } from './redux/actions'
//import history from './history'
import {firebase} from './firebase/firebase';
import Login from './components/LoginPage/Login'
import {ReactReduxFirebaseProvider} from 'react-redux-firebase'
import LoadTickers from './components/LoadTickers';

const rrfProps = {
  firebase: firebase,
  config: {
    userProfile: 'users'
  },
  dispatch: store.dispatch
}



const Start = () =>  {
  let history = useHistory()
  return(
  <React.StrictMode>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <Provider store={store}>
          <BrowserRouter history={history}>
          <App />
          </BrowserRouter>
      </Provider>
    </ReactReduxFirebaseProvider>
  </React.StrictMode>
    )
}


ReactDOM.render(<Start />, document.getElementById('root'));