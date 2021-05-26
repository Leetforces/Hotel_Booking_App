import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Avatar, Badge } from "antd";
import moment from "moment";
import { getAccountBalance, payoutSetting } from "../actions/stripe";
import { SearchOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
const { Meta } = Card;
const { Ribbon } = Badge;
const ConnectNav = () => {
  const [loading, setLoading] = useState(false);
  const { auth } = useSelector((state) => ({ ...state }));
  const { user, token } = auth;
  const [balance, setBalance] = useState(0);

  const currencyFormatter = (data) => {
    // data :[{amount: 10,currentcy:"usd", source_types:[object]}]
    return (data.amount / 100).toLocaleString(data.currency, {
      style: "currency",
      currency: data.currency,
    });
  };
  useEffect(() => {
    getAccountBalance(token).then((res) => {
      console.log("Balance REsponse=> ",res);
       setBalance(res.data.balance);
    });
  }, []);

  const handlePayoutSettings = async (event) => {
    console.log("Loading==>", loading);
    setLoading(true);
    try {
      const res = await payoutSetting(token);
      console.log("REsponse in handlePayout=====>", res);
      setLoading(false);
      window.location.href = res.data.url;
    } catch (err) {
      console.log("Error in handlePayout", err);
      setLoading(false);
      toast("Unable to access settings . Try Again.");
    }
  };
  return (
    <div className="d-flex justify-content-around">
      <Card>
        <Meta
          avatar={<Avatar>{user.name[0]}</Avatar>}
          title={user.name}
          description={`Joined ${moment(user.createdAt).fromNow()}`}
        />
      </Card>
      {auth &&
        auth.user &&
        auth.user.stripe_seller &&
        auth.user.stripe_seller.charges_enabled && (
          <>
            <Ribbon text="Available " color="grey">
              <Card className="bg-light pt-1">
                    <span className="lead">
                      {balance} $
                    </span>
                 
              </Card>
            </Ribbon>
            {/* <Ribbon text="Payouts" color="silver">
              <Card onClick={handlePayoutSettings} className="bg-light pointer">
                <SearchOutlined className="h5 pt-2" />
              </Card>
            </Ribbon> */}
          </>
        )}
    </div>
  );
};

export default ConnectNav;
