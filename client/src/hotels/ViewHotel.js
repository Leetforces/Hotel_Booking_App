import React, { useState, useEffect } from "react";
import { read, diffDays, isAlreadyBooked } from "../actions/hotel";
import moment from "moment";
import { useSelector } from "react-redux";
import { getSessionId, makePayment } from "../actions/stripe";
import { loadStripe } from "@stripe/stripe-js";

import StripeCheckout from 'react-stripe-checkout';
import { toast } from "react-toastify";

const ViewHotel = ({ match, history }) => {
  const [hotel, setHotel] = useState({});
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadyBooked, setAlreadyBooked] = useState(false);

  const { auth } = useSelector((state) => ({ ...state }));

  const [product, setProduct] = useState({
    name: "react from fb",
    price: 10,
    productby: "Facebook",
  });

  useEffect(() => {
    loadSellerHotel();
  }, []);
  useEffect(() => {
    if (auth && auth.token) {
      alreadyBookedFun();
    }
  }, [])
  const alreadyBookedFun = async () => {
    const res = await isAlreadyBooked(auth.token, match.params.hotelId);
    if (res && res.data && res.data.ok) setAlreadyBooked(true);
    console.log("res already book====>", res);
    return res;
  }
  const loadSellerHotel = async () => {
    let res = await read(match.params.hotelId);
    //console.log(res);
    setHotel(res.data);
    setImage(`${process.env.REACT_APP_API}/hotel/image/${res.data._id}`);
  };
  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!auth || !auth.token) {
      history.push("/login");
      return;
    }

    setLoading(false);

  }
  const handleClickPayment = async (data) => {
    setLoading(true);
    try {
      const token = auth.token;
      const res = await makePayment(token, data, hotel.price, match.params.hotelId);
      console.log("result after booking", res);
      toast.success(res.data);
      history.push("/dashboard");
    } catch (err) {
      toast.error(err);
    }



    // console.log(auth.token, match.params.hotelId);
    // let res = await getSessionId(auth.token, match.params.hotelId);
    // // console.log("Get sessionId response", res.data.sessionId);
    // const stripe = await loadStripe(process.env.REACT_APP_STRIPE_KEY);
    // stripe
    //   .redirectToCheckout({
    //     sessionId: res.data.sessionId,
    //   })
    //   .then((result) => console.log(result));

    setLoading(false);
  };

  return (
    <>
      <div className="container-fluid bg-secondary p-5 text-center">
        <h2>{hotel.title}</h2>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <br />
            <img src={image} alt={hotel.title} className="img img-fluid m-2" />
          </div>
          <div className="col-md-6">
            <br />
            <b>{hotel.content}</b>

            <div className="container ">
              <div className="row ">
                <div className="col-6">
                  <p className="alert alert-info mt-3"> Price: &nbsp; ${hotel.price} </p>

                </div>
                <div className="col-6">
                  <p className="alert alert-info mt-3"> Location: &nbsp; {hotel.location}</p>

                </div>
              </div>
            </div>

            <p className="card-text">
              <span className="float-right text-primary">
                for {diffDays(hotel.from, hotel.to)}{" "}
                {diffDays(hotel.from, hotel.to) <= 1 ? "day" : "days"}
              </span>
            </p>
            <p>
              From <br />
              {moment(new Date(hotel.from)).format("MMMM Do YYYY, h:mm:ss a")}
            </p>
            <p>
              To <br />
              {moment(new Date(hotel.to)).format("MMMM Do YYYY, h:mm:ss a")}
            </p>
            <i>Posted by {hotel.postedBy && hotel.postedBy.name}</i>
            <br />

            {auth && auth.token && !loading && !alreadyBooked && (
              <>
                <StripeCheckout
                  stripeKey={process.env.REACT_APP_STRIPE_KEY}
                  token={handleClickPayment}
                  name="Book Hotel"
                  amount={hotel.price * 100}
                  billingAddress

                >
                  <button
                    className="btn btn-block btn-lg btn-primary mt-3"
                    disabled={loading || alreadyBooked}
                    onClick={handleClick}
                  >
                    {loading
                      ? "Loading..."
                      : alreadyBooked
                        ? "Already Booked"
                        : auth && auth.token
                          ? `Book Now in ${hotel.price} $`
                          : "Login to Book"}
                  </button>

                </StripeCheckout>
              </>
            )}
            {
              (loading || alreadyBooked || !auth) && (
                <>
                  <button
                    onClick={handleClick}
                    className="btn btn-block btn-lg btn-primary mt-3"
                    disabled={loading || alreadyBooked}
                  >
                    {loading
                      ? "Loading..."
                      : alreadyBooked
                        ? "Already Booked"
                        : "Login to Book"}
                  </button>
                </>
              )
            }

          </div>
        </div>
      </div>
    </>
  );
};

export default ViewHotel;
