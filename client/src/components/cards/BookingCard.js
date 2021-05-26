import React,{useState} from "react";
import { useHistory, Link } from "react-router-dom";
import { currencyFormatter } from "../../actions/stripe";
import { diffDays } from "../../actions/hotel";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import OrderModal from '../modals/OrderModal'
const BookingCard = ({
  hotel,
  session,
  orderedBy
}) => {
    const [showModal,setShowModal] = useState(false);
  const history = useHistory();
  return (
    <>
      <div className="container-fluid card mb-3">
        <div className="row no-gutters">
          <div className="col-md-4">
            {hotel.image && hotel.image.contentType ? (
              <img
                src={`${process.env.REACT_APP_API}/hotel/image/${hotel._id}`}
                alt="default hotel image"
                className="card-image img img-fluid"
              />
            ) : (
              <img
                src="https://via.placeholder.com/900x500.png?text=MERN+Booking"
                alt="default hotel image"
                className="card-image img img-fluid"
              />
            )}
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h3 className="cart-title">
                {hotel.title}{" "}
                <span className="float-right text-primary">
                  {currencyFormatter({
                    amount: hotel.price * 100,
                    currency: "usd",
                  })}
                </span>{" "}
              </h3>

              <p className="alert alert-info">{hotel.location}</p>
              <p className="card-text">{`${hotel.content.substring(0, 200)}...`}</p>
              <p className="card-text">
                <span className="float-right text-primary">
                  for {diffDays(hotel.from, hotel.to)}{" "}
                  {diffDays(hotel.from, hotel.to) <= 1 ? "day" : "days"}
                </span>
              </p>
              <p className="card-text">{hotel.bed} bed</p>
              <p className="card-text">
                Avalilable from {new Date(hotel.from).toLocaleDateString()}
              </p>
              {showModal && <OrderModal session={session} orderedBy={orderedBy}
                  showModal={showModal}
                  setShowModal={setShowModal}
              />}
              <div className="d-flex justify-content-between h5">
                
                  <button
                    onClick={() => setShowModal(!showModal)}
                    className="btn btn-primary"
                  >
                    Show Payment Info
                  </button>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingCard;
