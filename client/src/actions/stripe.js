import axios from "axios";
export const createConnectAccount = async (token) =>
  await axios.post(
    `${process.env.REACT_APP_API}/create-connect-account`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const getAccountStatus = async (token) =>
  await axios.post(
    `${process.env.REACT_APP_API}/get-account-status`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const getAccountBalance = async (token) =>
  await axios.post(
    `${process.env.REACT_APP_API}/get-account-balance`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const payoutSetting = async (token) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API}/payout-setting`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};
export const currencyFormatter = (data) => {
  // data :[{amount: 10,currentcy:"usd", source_types:[object]}]
  return (data.amount / 100).toLocaleString(data.currency, {
    style: "currency",
    currency: data.currency,
  });
};

export const getSessionId = async (token, hotelId) =>
  await axios.post(
    `${process.env.REACT_APP_API}/stripe-session-id`,
    {
      hotelId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );


  export const stripeSuccessRequest = async(token,hotelId) => await axios.post(
    `${process.env.REACT_APP_API}/stripe-success`,{hotelId},{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );



  export const makePayment = async(token,data,price,hotelId) =>{
     const res=  await axios.post(
      `${process.env.REACT_APP_API}/payment`,{data,price,hotelId},{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      } );

      return res;
  }
  export const activateAccount = async(token,holderName,accountNo,ifsc,password) =>{
     const res=  await axios.post(
      `${process.env.REACT_APP_API}/activate-account`,{holderName,accountNo,ifsc,password},{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      } );

      return res;
  }