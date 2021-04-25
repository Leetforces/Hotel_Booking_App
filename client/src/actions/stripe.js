import axios from "axios";

export const createConnectAccount = async (token) =>
    await axios.post(`${process.env.REACT_APP_API}/create-connect-account`, {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

export const getAccountStatus = async (token) =>
    await axios.post(`${process.env.REACT_APP_API}/get-account-status`, {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });


export const getAccountBalance = async (token) =>
    await axios.post(`${process.env.REACT_APP_API}/get-account-balance`, {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

export const payoutSetting = async (token)=>{
    const res=await axios.post(`${process.env.REACT_APP_API}/payout-setting`,{},{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return res;
}
