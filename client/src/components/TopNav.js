import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const TopNav = () => {
  const { auth } = useSelector((state) => ({ ...state }));
  const history = useHistory();
  
  const dispatch = useDispatch();
  const logout = () => {
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    window.localStorage.removeItem("auth");
    history.push("/login");
  };

  return (
    <div className="nav bg-light d-flex justify-content-between">
      <Link className="nav-link" to="/">
        Home
      </Link>

      {auth !== null && (
        <Link className="nav-link" to="/dashboard">
          Dashboard
        </Link>
      )}

      {auth !== null && (
        <Link className="nav-link pointer" onClick={logout} >
          Logout
        </Link>
      )}

      {auth === null && (
        <>
          {" "}
          <Link className="nav-link" to="/login">
            Login
          </Link>
          <Link className="nav-link" to="/register">
            Register
          </Link>
          <Link className="nav-link" to="/resetPassword">
            Reset Password
          </Link>
        </>
      )}
    </div>
  );
};

export default TopNav;
