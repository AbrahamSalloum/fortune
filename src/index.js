import React from 'react';
import ReactDOM from 'react-dom';
import {Switch, Route, BrowserRouter, useHistory, Redirect   } from "react-router-dom" //BrowserRouter as Router
import { Provider, useSelector } from "react-redux";
import store from "./redux/store";
import './index.css';
import App from './App';
import AddPage from './components/Add';
import Details from './components/Details'
import {startLogin, startsetTickers} from './redux/actions'
import GoogleLogin from 'react-google-login';


const LoadGoogleLogin = () => {

  const load = (response) => { 
    const userinfo = {userid: response.profileObj.googleId, username: response.profileObj.email, password: response.googleId}
    store.dispatch(startLogin(JSON.stringify(userinfo)))
    store.dispatch(startsetTickers())
    ReactDOM.render(<Provider store={store}><Start /></Provider>, document.getElementById('root'));  
  }

  const Start = () =>  {
    let history = useHistory();
    const jwt =  useSelector(state => state.AddTickers.jwt)
    while(!jwt){
      return false
    }
    return(
      <Provider store={store}>
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
        </Provider>
    )
    
  }

  return(
    <div style={{"backgroundColor": "#e2e4a5", "display": "flex", "flexDirection": "column", "justifyContent": "center", "alignItems": "center","textAlign": "center","minHeight": "100vh"}}>
      <GoogleLogin
        clientId="653707267747-4vntcc7pvm0cc26t503u6trnt04da2bl.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={load}
        onFailure={err => console.log('fail', err)}
        isSignedIn={true}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  )
}

ReactDOM.render(<LoadGoogleLogin />, document.getElementById('root'));
