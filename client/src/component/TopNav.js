import React from 'react';
import { useSelector ,useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import {useHistory} from 'react-router-dom';
const TopNav = () => {

  const state = useSelector((state_) => ({ ...state_ })
  );
  const { auth } = state;
  const dispatch=useDispatch();
  const history =useHistory();
  const logout =()=>{
    dispatch({
      type:'LOGOUT',
      payload:null,
    });
    window.localStorage.removeItem("auth");
    history.push("/login");
  }
  return (
    <>
      <div className="nav bg-light d-flex justify-content-between">
        {/* link doesn't refresh the page like a href=""></a> */}
        <Link className="nav-link" to="/">Home </Link>
        {auth !== null && (
          <>
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
          </>
        )
        }
        {auth!==null && (
          <>
            <a className="nav-link pointer" onClick={logout}>Logout</a>    
          </>
        )}
        {auth === null && (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/register">Register</Link>
          </>
        )
        }
      </div>
    </>
  )
}

export default TopNav;
