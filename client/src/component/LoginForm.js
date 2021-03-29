import React from 'react'

const LoginForm = ({email,setEmail,password,setPassword,handleSubmit}) => {
    return (
        <>
            <form onSubmit={handleSubmit} className="mt-3">
             
                <div className="form-group mb-3">
                    <label className="form-level">Email Address</label>
                    <input type="email"
                        className="form-control"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="form-group mb-3">
                    <label className="form-level">Password</label>
                    <input type="password"
                        className="form-control"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <button disabled={!email || !password} className="btn btn-primary">Submit</button>
            </form>
        </>
)
}

export default LoginForm;
