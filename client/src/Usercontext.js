import { createContext, useState } from "react";

export const UserContext=createContext();

export function UserContextProvider({children}){
    // async function login(e){
    //     e.preventDefault();
    //     const response=await axios.post('http://localhost:4000/login',{userName,password},{withCredentials:true});
    //     console.log(response);
    //     if(response.status===200)
    //     {
    //       setRedirect(true);
    //       setUserinfo(response.data);
    //     }
    //     else{
    //       alert('Incorrect Credentials');
    //     }
    //   }
    const [userInfo,setUserinfo]=useState({});
    return (
    <UserContext.Provider value={{userInfo,setUserinfo}}>
        {children}
    </UserContext.Provider>
    );
}