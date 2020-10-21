import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {SignInEmail} from '../../redux/actions'
import {SignUpEmail} from '../../redux/actions'
import {googleSignin} from '../../redux/actions'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import GoogleButton from 'react-google-button'

const Login = () => {

  const loginmsg = useSelector(state => state.AddTickers.loginmsg)
  const dispatch = useDispatch();
  // User State
  const [user, setUser] = useState({
    email: '',
    password: '',
    error: '',
  });

  // onChange function
  const handleChange = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
      error: '',
    })
  };

  // Submit function (Log in user)
  const handleLoginSubmit = e => {
    console.log(e)
    e.preventDefault();
    dispatch(SignInEmail(user))

  }

  const handleGoogleSigninSubmit = e => {
    console.log(e)
    e.preventDefault();
    dispatch(googleSignin())

  }

  const handleSignUpSubmit = e => {
    console.log(e)
    e.preventDefault();
    dispatch(SignUpEmail(user))
  }

  return (
    <div style={{
    "display": "flex",
    "flex-direction": "column",
      "justify-content": "center",
    "align-items": "center",
    "text-align": "center",
    "min-height": "100vh",
    "background-color": "silver",
    }}>
      <div style={{ "display": "flex", "width": "25rem", "background-color": "white", "flex-direction": "column",  "padding":" 1.2rem 1.6rem"}}>
          <h1>Login:</h1>
          <TextField id="outlined-basic" label="Email" variant="outlined" type="text" placeholder="Email" name="email" onChange={handleChange} />
          <TextField id="outlined-basic" label="Password" variant="outlined" type="password" placeholder="Password" name="password" onChange={handleChange} />

        <Button style={{ "height": "50px", "borderRadius": 0 }} color="primary" variant="contained" onClick={handleLoginSubmit}>Log in</Button>
        <Button style={{ "height": "50px", "borderRadius": 0 }} color="secondary" variant="contained" onClick={handleSignUpSubmit}>Register</Button>
        <GoogleButton style={{"width": "100%"}} onClick={handleGoogleSigninSubmit} />

        {loginmsg}
     </div>
  </div>




  )
};

export default Login;