import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
//import rootReducer from "./reducers";

import AddTickers from '../redux/reducers/portfolio'

const middleware = [...getDefaultMiddleware()]

const reducer = {
    AddTickers: AddTickers
}


export default configureStore({reducer, middleware, devTools:true, serializableCheck: false,});
