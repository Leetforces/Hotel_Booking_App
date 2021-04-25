import React, { useEffect } from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {getAccountStatus} from '../actions/stripe'
import {updateUserInLocalStorage} from '../actions/auth'
export default function StripeCallback({ history }) {
    const { auth } = useSelector((state) => ({ ...state }));
    const dispatch = useDispatch();

    useEffect(()=>{
       if(auth && auth.token){
               accountStatus();
       }
    },[auth]);

    const accountStatus= async()=>{
        try{
           const res=await getAccountStatus(auth.token);
           console.log("USER ACCOUNT Status on Stripe Callback",res);
           

           //it is bug
        //    res.data.charged_enabled=true;


           updateUserInLocalStorage(res.data,()=>{
               //update user in redux
               dispatch({
                   type:"LOGGED_IN_USER",
                   payload:res.data,
               });
               window.location.href= "/dashboard/seller";
           })
        }catch(err){
              console.log("Error in fetching account Status:",err);
        }
    }
    return (
        <div className="d-flex justify-content-center p-5">
            <LoadingOutlined className="display-1 h1 p-5 text-danger" />
        </div>
    )
}
