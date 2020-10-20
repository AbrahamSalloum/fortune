import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {useSelector, useDispatch} from 'react-redux';
import {SignUpEmail} from '../../redux/actions'
import Start from '../../index'

const Signup = () => {
  // User State
  const [user, setUser] = useState({
    nickname: '',
    email: '',
    password: '',
    error: '',
  });


  const dispatch = useDispatch();

  // onChange function
  const handleChange = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
      error: '',
    })
  };

  // Submit function (Create account)
  const handleSubmit = e => {
    e.preventDefault();
    dispatch(SignUpEmail(user))
  }

  return (
    <div>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Email" name="email" onChange={handleChange}/><br />
        <input type="password" placeholder="Password" name="password" onChange={handleChange}/><br />
        <button type="submit">Sign Up</button>
      </form>
  </div>
  )
};



export default Signup;