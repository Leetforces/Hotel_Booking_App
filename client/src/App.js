import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import TopNav from "./components/TopNav";
import PrivateRoute from "./components/PrivateRoute";
//components
import Home from "./booking/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./user/Dashboard";
import DashboardSeller from './user/DashboardSeller';
import NewHotel from './hotels/NewHotel';
import ResetPassword from "./components/ResetPassword";
import NewPasswordSetup from "./components/NewPasswordSetup";
import StripeCallback from "./stripe/StripeCallback";
import EditHotel from './hotels/EditHotel'


function App() {
  return (
    <BrowserRouter>
      <TopNav />
      <ToastContainer position="top-center" />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/dashboard/seller" component={DashboardSeller} />
        <PrivateRoute exact path="/hotels/new" component={NewHotel} />
        <PrivateRoute exact path="/stripe/callback" component={StripeCallback} />
        <Route exact path="/resetPassword" component={ResetPassword} />
        <Route exact path="/resetPassword/:token" component={NewPasswordSetup} />
        <PrivateRoute exact path="/hotel/edit/:hotelId" component={EditHotel} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
