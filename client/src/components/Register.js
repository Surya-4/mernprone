import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Usercontext';

function Register() {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserinfo } = useContext(UserContext); // access context
  const navigate = useNavigate();

  async function register(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:4000/register',
        { userName, password },
        { withCredentials: true } // in case your backend sets cookies
      );
      if (response.status === 200) {
        setRedirect(true);
        setUserinfo(response.data); // optionally log in the user automatically
        alert('Registration Successful');
      } else {
        alert('Registration Failed');
      }
    } catch (error) {
      console.log(error);
      alert('Registration Failed');
    }
  }

  if (redirect) {
    navigate('/'); // redirect to home
  }

  return (
    <>
      <h1>Register</h1>
      <form className="login" onSubmit={register}>
        <input
          type="text"
          placeholder="username"
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default Register;
