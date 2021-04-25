import axios from "axios";

export const register = async (user) =>
  await axios.post(`${process.env.REACT_APP_API}/register`, user);

export const login = async (user) =>
  await axios.post(`${process.env.REACT_APP_API}/login`, user);

export const resetPassword = async (email) => {
    const res = await axios.post(`${process.env.REACT_APP_API}/resetPassword`,{email});
    return res;
}

export const changePassword = async (password,token) => {
  const res = await axios.post(`${process.env.REACT_APP_API}/updatePassword`,{
      password,
      token,
  });
  return res;
}

//udate user in local storage
export const updateUserInLocalStorage =(user,next)=>{
   if(window.localStorage.getItem('auth')){
     let auth=JSON.parse(localStorage.getItem("auth"));
     auth.user= user; 
     localStorage.setItem("auth",JSON.stringify(auth));
     next();
   }
}