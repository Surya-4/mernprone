import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Usercontext';

function Header() {
  const { userInfo, setUserinfo } = useContext(UserContext);
  const navigate = useNavigate();

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    }).then(() => {
      setUserinfo(null);
      navigate('/login'); // Redirect explicitly after logout
    });
  }

  const userName = userInfo?.userName;

  return (
    <div className="header">
      <div className="logo">
        <Link to="/">BlogSpace</Link>
      </div>
      <nav>
        {userName ? (
          <>
            <Link to="/create">Create a new post</Link>
            <span
              onClick={logout}
              style={{ cursor: 'pointer', marginLeft: '10px' }}
            >
              Logout
            </span>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" style={{ marginLeft: '10px' }}>Register</Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Header;
