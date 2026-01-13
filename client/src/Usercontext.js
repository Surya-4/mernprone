import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [userInfo, setUserinfo] = useState(null);

  // Fetch current user once
  useEffect(() => {
    axios.get('http://localhost:4000/profile', { withCredentials: true })
      .then(res => {
        if (res.data?.userName) {
          setUserinfo(res.data);
        }
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserinfo }}>
      {children}
    </UserContext.Provider>
  );
}
