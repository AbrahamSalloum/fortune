import { combineReducers } from "redux";
import AddTickers from './portfolio'
import {firebaseReducer } from "react-redux-firebase";

export default combineReducers({ AddTickers: AddTickers, firebase: firebaseReducer });