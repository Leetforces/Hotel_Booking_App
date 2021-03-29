import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { login } from '../actions/auth';
import LoginForm from '../component/LoginForm';
import {useDispatch} from 'react-redux';
const Login = ({history}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch =useDispatch();
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await login({
                email,
                password,
            });

            if(res.data)
            {
                console.log("SAVE USER RES IN REDUX AND LOCAL STORAGE THEN REDIRECT.")
                 //save user and token to local storage
                 window.localStorage.setItem('auth',JSON.stringify(res.data));
                 //save user and token to redux
                 dispatch({
                     type: 'LOGGED_IN_USER',
                     payload: res.data,
                 })
                console.log(res);
                toast.success("Login Success.");
                history.push("/dashboard");
            }
          
        } catch (error) {
            console.log("Error:" + error);
            if(error.response.status===400)  toast.error(error.response.data)
        }
        
    }
    return (
        <>
            <div className="container-fluid bg-secondary p-5 text-center">
                <h1>Login Page</h1>
            </div>
            
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <LoginForm email={email}
                                   setEmail={setEmail}
                                   password={password}
                                   setPassword={setPassword}
                                   handleSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>

        </>
    )
}

export default Login;
