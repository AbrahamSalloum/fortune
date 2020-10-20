import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
//import rootReducer from "./reducers";
import { getFirebase, firebaseReducer } from "react-redux-firebase";
import AddTickers from '../redux/reducers/portfolio'

const middleware = [...getDefaultMiddleware({
    thunk: { extraArgument: {getFirebase}},
    serializableCheck: false
})]

const reducer = {
      AddTickers: AddTickers, firebase: firebaseReducer 
 }


export default configureStore({reducer: reducer, middleware: middleware, devTools:true, serializableCheck: false});
