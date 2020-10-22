import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {SignInEmail} from '../../redux/actions'
import {SignUpEmail} from '../../redux/actions'
import {googleSignin} from '../../redux/actions'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import GoogleButton from 'react-google-button'
import { useHistory } from "react-router-dom"
const Login = () => {
  let history = useHistory()
  const loginmsg = useSelector(state => state.AddTickers.loginmsg)
  let firebasedata = useSelector(state => state.firebase.auth.uid)
  const dispatch = useDispatch();
  let jwt = useSelector(state => state.AddTickers.jwt)
  let uid = useSelector(state => state.AddTickers.uid)

  useEffect(() => {

    if (!!jwt && !!uid) {
      history.push("/dashboard");
    }
  });

  const [user, setUser] = useState({
    email: '',
    password: '',
    error: '',
  });


  const handleChange = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
      error: '',
    })
  };

  const handleLoginSubmit = e => {
    e.preventDefault();
    dispatch(SignInEmail(user))
  }

  const handleGoogleSigninSubmit = e => {
    e.preventDefault();
    dispatch(googleSignin())
  }

  const handleSignUpSubmit = e => {
    e.preventDefault();
    dispatch(SignUpEmail(user))
  }

  const handlePassReset = e => {
    e.preventDefault();
  }

  return (
    <div style={{
    "display": "flex",
    "flexDirection": "column",
      "justifyContent": "center",
    "alignItems": "center",
    "textAlign": "center",
    "minHeight": "100vh",
    "backgroundColor": "silver",
    }}>
      <div style={{ "display": "flex", "alignItems": "stretch", "width": "25rem", "backgroundColor": "white", "flexDirection": "column",  "padding":" 1.2rem 1.6rem"}}>
          <h1>Login:</h1>
          <TextField id="outlined-basic" label="Email" variant="outlined" type="text" placeholder="Email" name="email" onChange={handleChange} />
          <TextField id="outlined-basic" label="Password" variant="outlined" type="password" placeholder="Password" name="password" onChange={handleChange} />
        <div style={{ "marginLeft": 0, "marginRight": "auto" }}><a href="#" onClick={(e) => { handlePassReset(e)}}>reset password...</a></div>
        <Button style={{ "height": "50px", "borderRadius": 0 }} color="primary" variant="contained" onClick={(e) => {handleLoginSubmit(e)}}>Log in</Button>
        <Button style={{ "height": "50px", "borderRadius": 0 }} color="secondary" variant="contained" onClick={(e) => {handleSignUpSubmit(e)}}>Register</Button>
        <GoogleButton style={{"width": "100%"}} onClick={handleGoogleSigninSubmit} />

        {loginmsg}
     </div>
  </div>

  )
};

export default Login;