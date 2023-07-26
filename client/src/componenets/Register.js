import React from 'react'
import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [userName,setUsername]=useState('');
  const [password,setPassword]=useState('');
  async function register(e){
    e.preventDefault();
    const response=await axios.post('http://localhost:4000/register',{userName,password});
    if(response.status===200)
    {
      alert('Registration Succesful');
    }
    else{
      alert('Registration Failed')
    }
  };
  return (
    <>
    <h1>Register</h1>
    <form className='login' onSubmit={register}>
      <input type="text" 
      placeholder="username"
      value={userName}
      onChange={(e)=>{setUsername(e.target.value)}}/>
      <input type="text" 
      placeholder="password"
      value={password}
      onChange={(e)=>{setPassword(e.target.value)}}/>
      {/* <input type="text" 
      placeholder='confirm password'
      value={confirmPassword}
      onChange={(e)=>{setConfirmPassword(e.target.value)}}/> */}
      <button onClick={()=>{console.log({userName,password});}}>Submit</button>
    </form>
    </>
  )
}

export default Register;