import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {SignInEmail} from '../../redux/actions'
import {SignUpEmail} from '../../redux/actions'
import {googleSignin} from '../../redux/actions'
import { ResetPassword } from '../../redux/actions'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import GoogleButton from 'react-google-button'
import { useHistory } from "react-router-dom"


const Login = () => {
  let history = useHistory()
  const loginmsg = useSelector(state => state.AddTickers.loginmsg)
  const dispatch = useDispatch();
  let jwt = useSelector(state => state.AddTickers.jwt)
  let uid = useSelector(state => state.firebase.auth.uid)

  useEffect(() => {

    if (!!jwt && !!uid) {
      history.push("/dashboard");
    }
  });

  const [hints, setHint] = useState('')
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
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if(user.email == false || user.passord == false){
      setHint('Please type valid email and password to login')
      return
    }
    setHint('')
    dispatch(SignInEmail(user))

  }

  const handleGoogleSigninSubmit = (e) => {
    e.preventDefault();
    dispatch(googleSignin())
  }

  const SendPasswordResetEmail = (e) => {
    e.preventDefault();
    if(user.email == false){
      setHint('Please type valid email and press \'reset password\'')
    }
    dispatch(ResetPassword(user));
  }

  const handleSignUpSubmit = (e) => {
    e.preventDefault();

    if (user.email == false || user.passord == false) {
      setHint('Please type valid email and password to register')
      return
    }
    setHint('')
    dispatch(SignUpEmail(user))
  }


  return (
    <div className="bgbg">
      <div className="loginContainer ">
        <div className="loginf ">
          <h1>Login</h1>
        </div>

        <div className="loginf">
          <TextField  fullWidth={true} id="standard-basic" label="Email" variant="outlined" type="text" placeholder="Email" name="email" onChange={handleChange} />
          </div>
        <div className="loginf">
          <TextField  fullWidth={true} id="standard-basic" label="Password" variant="outlined" type="password" placeholder="Password" name="password" onChange={handleChange} />
        </div>
        <div className="loginf alignleft">
          <button className="buttonlikelink" onClick={(e) => { SendPasswordResetEmail(e)}}>reset password...</button>
        </div>
        <div className="loginf">
          <Button style={{ "height": "50px", "borderRadius": 0, "width": "100%"}} color="primary" variant="contained" onClick={(e) => {handleLoginSubmit(e)}}>Log in</Button>
        </div>
        <div className="loginf">
          <Button style={{ "height": "50px", "borderRadius": 0, "width": "100%"}} color="secondary" variant="contained" onClick={(e) => {handleSignUpSubmit(e)}}>Register</Button>
        </div>
        <div className="loginf">
          <GoogleButton style={{"width": "100%"}} onClick={handleGoogleSigninSubmit} />
        </div>
        <div>{loginmsg}</div>
        <div>{hints}</div>

     </div>
</div>

  )
};

export default Login;