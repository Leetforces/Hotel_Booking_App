import axios from 'axios';

export const register = async (user)=>{
    const res= await axios.post(`${process.env.REACT_APP_API}/register`,user);
    return res;
}
export const login = async (user)=>{
    const res= await axios.post(`${process.env.REACT_APP_API}/login`,user);
    return res;
}