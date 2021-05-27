import {Route, Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';

const PrivateRoute1 = ({...rest}) => {
    const { auth } = useSelector((state)=>({...state}));
    if(auth && auth.token && auth.user && auth.user.stripe_seller && auth.user.stripe_seller.charges_enabled){
        return <Redirect to="/dashboard/seller"/>
    }
    else{
       return auth && auth.token ? <Route {...rest}/> : <Redirect to="/login"/>
    }
};

export default PrivateRoute1;