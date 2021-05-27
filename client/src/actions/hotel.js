import axios from "axios";

export const createHotel = async (token, data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API}/create-hotel`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export const allHotels = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API}/hotels`, {});
  return res;
};

export const sellerHotels = async (token) =>
  await axios.get(`${process.env.REACT_APP_API}/seller-hotels`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteHotel = async (token, hotelId) =>
  await axios.delete(`${process.env.REACT_APP_API}/delete-hotel/${hotelId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const read = async (hotelId) =>
  await axios.get(`${process.env.REACT_APP_API}/hotel/${hotelId}`);

export const updateHotel = async (token, data, hotelId) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API}/update-hotel/${hotelId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export const diffDays = (from, to) => {
  const day = 24 * 60 * 60 * 1000; // milliseconds in one day
  const start = new Date(from);
  const end = new Date(to);
  const diff = Math.round(Math.abs((end - start) / day));
  return diff;
};

export const userHotelBookings = async(token)=>{
  const res= await axios.get(`${process.env.REACT_APP_API}/user-hotel-bookings`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
}
export const isAlreadyBooked = async(token,hotelId)=>{
  const res= await axios.get(`${process.env.REACT_APP_API}/is-already-booked/${hotelId}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res;
}
export const searchListings = async(query)=>{
  const res= await axios.post(`${process.env.REACT_APP_API}/search-listings`,query);
  return res; 
}

export const checkOrderPresentForThisHotel=  async(token,hotelId)=>{
  const res= await axios.get(`${process.env.REACT_APP_API}/check-order-present-for-hotel/${hotelId}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res;
}
