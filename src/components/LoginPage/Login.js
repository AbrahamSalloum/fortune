import React, { useState, useEffect} from 'react';
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
  let loggedin = useSelector(state => state.AddTickers.loggedin)

  useEffect(() => {
    if(!!loggedin){
      history.push('/dashboard')
    }
  }, [loggedin, history]);

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if(!!user.email === false || !!user.password === false){
      setHint('Please type valid email and password to login')
      return
    }
    setHint('')
    dispatch(SignInEmail(user, history))
  }

  const handleGoogleSigninSubmit = (e) => {
    e.preventDefault();
    dispatch(googleSignin(history))
  }

  const SendPasswordResetEmail = (e) => {
    e.preventDefault();
    if(!!user.email === false){
      setHint('Please type valid email and press \'reset password\'')
      return
    }
    dispatch(ResetPassword(user));
  }

  const handleSignUpSubmit = (e) => {
    e.preventDefault();

    if (!!user.email === false || !!user.password === false) {
      setHint('Please type valid email and password to register')
      return
    }
    setHint('')
    dispatch(SignUpEmail(user, history))
  }


  return (
      <div className="bgbg">
      <form>
        <div className="loginContainer ">
          <div className="loginf ">
            <h1>Login</h1>
          </div>
          <div className="loginf">
            <TextField
              fullWidth={true}
              id="standard-basic"
              label="Email"
              variant="outlined"
              type="text"
              placeholder="Email"
              name="email" onChange={handleChange}
            />
            </div>
          <div className="loginf">
            <TextField
              fullWidth={true}
              id="standard-basic"
              label="Password"
              variant="outlined"
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
          </div>
          <div className="loginf alignleft">
            <button
              type="button"
              className="buttonlikelink"
              onClick={(e) => { SendPasswordResetEmail(e)}}>reset password...</button>
          </div>
          <div className="loginf">
            <Button
              type="submit"
              style={{ "height": "50px", "borderRadius": 0, "width": "100%"}}
              color="primary"
              variant="contained"
              onClick={(e) => {handleLoginSubmit(e)}}>Log in</Button>
          </div>
          <div className="loginf">
            <Button
              type="button"
              style={{ "height": "50px", "borderRadius": 0, "width": "100%"}}
              color="secondary"
              variant="contained"
              onClick={(e) => {handleSignUpSubmit(e)}}>Register</Button>
          </div>
          <div className="loginf">
            <GoogleButton
              style={{"width": "100%"}}
              onClick={handleGoogleSigninSubmit}
            />
          </div>
          <div>{loginmsg}</div>
          <div>{hints}</div>
          </div>
        </form>
      </div>
  )
}

export default Login;