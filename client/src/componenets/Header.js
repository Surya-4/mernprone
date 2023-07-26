import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from '../Usercontext';
import { useNavigate } from 'react-router-dom';
function Header() {
  const {userInfo,setUserinfo}=useContext(UserContext);
  const navigate=useNavigate();
  
  function logout(){
    fetch('http://localhost:4000/logout',{
      credentials:'include',
      method:'POST',
    });
    setUserinfo(null);
  }
  useEffect(()=>{
    fetch('http://localhost:4000/profile',{
      credentials:'include',
    }
    ).then(response=>{
      response.json().then(userInfo=>{
        console.log(userInfo)
        setUserinfo(userInfo);
      });
    });
  },[setUserinfo]);
  
  const userName=userInfo?.userName;
  if(!userInfo)
    {
      navigate('/');
    }
  return (
    <>
    <div className="header">
        <div className="logo">
            <Link to="/">BlogSpace</Link>
        </div>            
        <nav>
          {userName && (
            <>
            <Link to='/create'>Create a new post</Link>
            <a onClick={logout}>Logout</a>
            </>
          )}
          {!userName && (
            <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            </>
          )}
        </nav>
    </div>
    </>
  )
}

export default Header;