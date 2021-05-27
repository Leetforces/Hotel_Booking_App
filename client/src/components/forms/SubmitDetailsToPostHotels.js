import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import {activateAccount} from '../../actions/stripe'
import {toast} from 'react-toastify'
import {useDispatch} from 'react-redux';
const SubmitDetailsToPostHotels = ({history}) => {
    const { auth } = useSelector((state) => ({ ...state }));
    
    const [details, setDetails] = useState({
        accountNo: "",
        confirmAccountNo: "",
        ifsc: "",
        password: "",
        confirmPassword: "",
        holderName: "",
    })
   
    const dispatch = useDispatch();
    const logout = () => {
      dispatch({
        type: "LOGOUT",
        payload: null,
      });
      window.localStorage.removeItem("auth");
      history.push("/login");
    };
    const handleSubmit = async(e) => {
        e.preventDefault();        
        try{
           const res = await activateAccount(auth.token,details.holderName,details.accountNo,details.ifsc,details.password);
           console.log("REsult of account Activated",res);
           toast.success(res.data);
           toast.success("Login Again to post the hotels")
           logout();
        }catch(err){
            console.log(err);
        }
        
    }
    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setDetails((preValue) => {
            return {
                ...preValue,
                [name]: value,
            }
        })
    }
    return (
        <div>
            <div className="container-fluid bg-secondary p-5 text-center">
                <h1>Submit Details to Activate Account</h1>
            </div>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="from-group">


                        <input
                            type="text"
                            name="holderName"
                            onChange={handleChange}
                            placeholder="Enter the Account Holder Name"
                            className="form-control m-2"
                            value={details.holderName}
                        />
                        <input
                            type="number"
                            name="accountNo"
                            onChange={handleChange}
                            placeholder="Enter Account Number"
                            className="form-control m-2"
                            value={details.accountNo}
                        />
                        <input
                            type="number"
                            name="confirmAccountNo"
                            onChange={handleChange}
                            placeholder="Confirm Account Number"
                            className="form-control m-2"
                            value={details.confirmAccountNo}
                        />
                        <input
                            type="text"
                            name="ifsc"
                            onChange={handleChange}
                            placeholder="Enter IFSC Code"
                            className="form-control m-2"
                            value={details.ifsc}
                        />
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            placeholder="Enter Your Password"
                            className="form-control m-2"
                            value={details.password}
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            className="form-control m-2"
                            value={details.confirmPassword}
                        />

                    </div>

                    <button
                        className="btn btn-outline-primary m-2"
                        disabled={!details.holderName || !details.accountNo || !details.confirmAccountNo || !details.ifsc || !details.password || !details.confirmPassword || details.accountNo != details.confirmAccountNo || details.password != details.confirmPassword}
                    >
                        Save
                </button>
                </form>
            </div>

        </div>
    )
}

export default SubmitDetailsToPostHotels;
