import React from 'react';
import { combineReducers } from 'redux';
import authReducer from './authReducer';
//combine multiple reducers
const rootReducer = combineReducers({
    auth: authReducer,

});

export default rootReducer;