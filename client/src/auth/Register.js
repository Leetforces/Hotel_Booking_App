import React, { useState } from 'react'
import RegisterForm from '../component/RegisterForm';
import {register} from '../actions/auth';
import { toast } from 'react-toastify';


const Register = ({history}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await register({
                name,
                email,
                password,
            });
            console.log(res);
            toast.success("Register Success. Please Login.");
            history.push('/login');
        } catch (error) {
            console.log("Error:" + error);
            if(error.response.status===400)  toast.error(error.response.data)
        }
        
    }
    return (
        <>
            <div className="container-fluid bg-secondary  p-5 text-center">
                <h1>Register Page</h1>
            </div>
           
            <div className="container">
                <div className="row">
                    {/* 12(3 6 3)col-grid */}
                    <div className="col-md-6 offset-md-3">
                        <RegisterForm
                            name={name}
                            setName={setName}
                            email={email}
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

export default Register;
