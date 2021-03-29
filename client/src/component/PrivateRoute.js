import {Route,Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';

import React from 'react'

const PrivateRoute = ({...rest}) => {
    const {auth} =useSelector((state)=> ({...state}));
    return  (auth && auth.token)? <Route {...rest}/> : <Redirect to="/login" />
}

export default PrivateRoute;
