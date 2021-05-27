import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import TopNav from "./components/TopNav";
import PrivateRoute from "./components/PrivateRoute";
import PrivateRoute1 from "./components/PrivateRoute1";
//components
import Home from "./booking/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./user/Dashboard";
import DashboardSeller from "./user/DashboardSeller";
import NewHotel from "./hotels/NewHotel";
import ResetPassword from "./components/ResetPassword";
import NewPasswordSetup from "./components/NewPasswordSetup";
import StripeCallback from "./stripe/StripeCallback";
import EditHotel from "./hotels/EditHotel";
import ViewHotel from "./hotels/ViewHotel";
import StripeSuccess from './stripe/StripeSuccess';
import StripeCancel from './stripe/StripeCancel';
import SearchResult from './hotels/SearchResult';
import SubmitDetailsToPostHotels from "./components/forms/SubmitDetailsToPostHotels";
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
        <PrivateRoute
          exact
          path="/dashboard/seller"
          component={DashboardSeller}
        />
        <PrivateRoute exact path="/hotels/new" component={NewHotel} />
        <PrivateRoute
          exact
          path="/stripe/callback"
          component={StripeCallback}
        />
        <Route exact path="/resetPassword" component={ResetPassword} />
        <Route
          exact
          path="/resetPassword/:token"
          component={NewPasswordSetup}
        />
        <PrivateRoute exact path="/hotel/edit/:hotelId" component={EditHotel} />
        <Route exact path="/hotel/:hotelId" component={ViewHotel} />
        <PrivateRoute
          exact
          path="/stripe/success/:hotelId"
          component={StripeSuccess}
        />
        <PrivateRoute
          exact
          path="/stripe/cancel"
          component={StripeCancel}
        />
        <PrivateRoute1
          exact
          path="/Submit_Details_To_Post_Hotels"
          component={SubmitDetailsToPostHotels}
        />
        <Route exact path="/search-result" component={SearchResult} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
