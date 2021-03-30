import axios from 'axios';

export const createConnectAccount = async (token)=>{
    const res= await axios.post(`${process.env.REACT_APP_API}/create-connect-account`,{},{
        headers:{
            authorization: `Bearer ${token}`,
        }
    });
    return res;
}