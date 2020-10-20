import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SignInEmail, SignUpEmail} from '../../redux/actions'

const Login = () => {
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

  const handleSignUpSubmit = e => {
    console.log(e)
    e.preventDefault();
    dispatch(SignUpEmail(user))
  }

  return (
    <>
      <h1>Log In</h1>
      <div>
        <input type="text" placeholder="Email" name="email" onChange={handleChange}/><br />
        <input type="password" placeholder="Password" name="password" onChange={handleChange}/><br />
      <button type="submit" onClick={handleLoginSubmit}>Log in</button>
        <button type="submit" onClick={handleSignUpSubmit}>Register</button>
    </div>
      {user.error && <h4>{user.error}</h4>}
    </>
  )
};

export default Login;