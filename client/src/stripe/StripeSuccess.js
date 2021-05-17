import React, {useState,useEffect} from 'react';
import {useSelector} from "react-redux";
import {stripeSuccessRequest} from "../actions/stripe";

import {LoadingOutlined} from '@ant-design/icons';
const StripeSuccess = ({match}) => {
    const {
        auth: { token },
    } = useSelector((state) => ({ ...state}));

    useEffect(() =>{

        stripeSuccessRequest(token,match.params.hotelId).then((res) => {
            if(res.data.success) {
                window.history.push("/dashboard");
            }else{
                window.history.push("/stripe/cancel");
            }
        });

    }, [match.params.hotelId]);


    return (
        <div className="container">
          <div className="d-flex justify-content-center p-5">
              <LoadingOutlined className="display-1 text-danger p-5" />
              </div>  

        </div>
    );
};

export default StripeSuccess;