import React from "react";
import DashboardNav from "../components/DashboardNav";
import ConnectNav from "../components/ConnectNav";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { HomeOutlined } from "@ant-design/icons";
import { createConnectAccount } from "../actions/stripe";
import { sellerHotels, deleteHotel,checkOrderPresentForThisHotel } from "../actions/hotel";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import SmallCard from "../components/cards/SmallCard";

const DashboardSeller = ({ history }) => {
  const { auth } = useSelector((state) => ({ ...state }));
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSellersHotels();
  }, []);
  const loadSellersHotels = async () => {
    let { data } = await sellerHotels(auth.token);
    setHotels(data);
  };
  const handleClick = async () => {
    setLoading(true);
    try {
      let res = await createConnectAccount(auth.token);
      console.log(res);
      toast.success(res.data);
      setLoading(false);
      history.push("/Submit_Details_To_Post_Hotels");
    } catch (err) {
      console.log(err);
      toast.error("Stripe connect failed,Try again.");
      setLoading(false);
    }
  };

  const handleHotelDelete = async (hotelId) => {

    /*
    check this hotel is present active  order (that's means company didn't get all money from this hotel. so, you can't delete) 
    */

    const res = await checkOrderPresentForThisHotel(auth.token,hotelId);
    console.log("response=>",res);
    if ((res.data.ok)) {
      toast.error("You Can't delete right now. you didn't received your full payments of this hotel");
      return;
    }
    else {
      if (!window.confirm("Are you sure?")) return;

      deleteHotel(auth.token, hotelId).then((res) => {
        toast.success("Hotel Deleted");
        loadSellersHotels();
      });
    }
  };

  const connected = () => (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-10">
          <h2>Your Hotels</h2>
        </div>
        <div className="col-md-2">
          <Link to="/hotels/new" className="btn btn-primary">
            + Add New
          </Link>
        </div>
      </div>
      <div className="row">
        {hotels.map((h) => (
          <SmallCard
            key={h._id}
            h={h}
            showViewMoreButton={false}
            owner={true}
            handleHotelDelete={handleHotelDelete}
          />
        ))}
      </div>
    </div>
  );

  const notConnected = () => (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6 offset-md-3 text-center">
          <div className="p-5 pointer">
            <HomeOutlined className="h1" />
            <h4>setup payouts to post hotel rooms</h4>
            <p className="lead">
              MERN partners with stripe to transfer earnings to your bank
              account
            </p>
            <button
              disabled={loading}
              onClick={handleClick}
              className="btn btn-primary mb-3"
            >
              {loading ? "processing..." : "setup Payouts"}
            </button>
            {/* <p className="text-muted">
              <small>
                you'll be redirected to stripe to complete the on boarding
                process.
              </small>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="container-fluid bg-secondary p-5">
        <ConnectNav />
      </div>
      <div className="container-fluid p-4">
        <DashboardNav />
      </div>
      {auth &&
        auth.user &&
        auth.user.stripe_seller &&
        auth.user.stripe_seller.charges_enabled
        ? connected()
        : notConnected()}
    </>
  );
};

export default DashboardSeller;
