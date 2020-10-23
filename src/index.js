import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, useHistory} from "react-router-dom" //BrowserRouter as Router
import { Provider } from "react-redux";
import store from "./redux/store";
import './index.css';
import App from './App';
import {firebase} from './firebase/firebase';
import {ReactReduxFirebaseProvider} from 'react-redux-firebase'

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