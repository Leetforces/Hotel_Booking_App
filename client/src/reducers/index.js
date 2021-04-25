import { combineReducers } from "redux";
import { authReducer } from "./auth";
// combine reducer
const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
