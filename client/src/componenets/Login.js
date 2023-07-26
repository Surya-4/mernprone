import axios from 'axios';
import React, { useContext, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import { UserContext } from '../Usercontext';

function Login() {
    const [userName,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [redirect,setRedirect]=useState(false);
    const {setUserinfo}=useContext(UserContext);
    const navigate=useNavigate();
    async function login(e){
      e.preventDefault();
      const response=await axios.post('http://localhost:4000/login',{userName,password},{withCredentials:true});
      console.log(response);
      if(response.status===200)
      {
        setRedirect(true);
        setUserinfo(response.data);
      }
      else{
        alert('Incorrect Credentials');
      }
    }
    console.log(redirect)
    if(redirect)
    {
      navigate('/');
    }
  return (
    <>
    <h1>Login</h1>
    <form className="login" onSubmit={login}>
        <input type="text" 
        placeholder="username"
        value={userName}
        onChange={(e)=>{setUsername(e.target.value)}}
        />
        <input type="text" 
        placeholder="password"
        value={password}
        onChange={(e)=>{setPassword(e.target.value)}}/>
        <button onClick={()=>{console.log({userName,password})}}>Submit</button>
    </form>
    </>
  )
}

export default Login;