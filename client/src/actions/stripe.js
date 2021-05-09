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
export const currencyFormatter = (data) => {
    // data :[{amount: 10,currentcy:"usd", source_types:[object]}]
    return (data.amount ).toLocaleString(data.currency, {
        style: "currency",
        currency: data.currency,
    })
}

export const diffDays =(from ,to)=>{
    const day= 24*60*60*1000; // milliseconds in one day
    const start = new Date(from);
    const end= new Date(to);
    const diff=Math.round(Math.abs((end-start)/day));
    return diff;
}