import React, {useState, useEffect} from 'react'
import { Link } from "react-router-dom"
import {useSelector, useDispatch} from 'react-redux';
import {dodelticker, getlist} from '../redux/actions.js'
const TickerItem = (
  { 
  price = 0, 
  units = 0, 
  ticker = "NA", 
  dayopen = 0, 
  dayclose = 0, 
  dayhigh = 0, 
  daylow = 0, 
  volume = 0, 
  daychange = 0, 
  additional = 0,
  id
},

  ) => {
    const dispatch = useDispatch();  
    return(
  
  <div className="ticker">
        <span className="item">{ticker} ({additional.longName})</span>
        <span className="item">{units}</span>
        <span className="item price-span">{price}</span>
        <span className="item">{dayopen}</span>
        <span className="item">{dayclose}</span>
        <span className="item">{dayhigh}</span>
        <span className="item">{daylow}</span>
        <span className="item">{volume}</span>
        <span className="item">{daychange}%</span>
        <span className="item"><Link to={`/details/${ticker}`}>Details ({ticker})</Link></span>
        <span className="item"><button onClick={()=>{dispatch(dodelticker(id))} }>Delete</button></span>
  </div>
)

    }


const LoadTickers = () => {
  const price = useSelector(state => state.AddTickers.price)
  const tickerlist = useSelector(state => state.AddTickers.tickerlist)
  const uid = useSelector(state => state.AddTickers.uid)
  const dispatch = useDispatch();
  dispatch(getlist())

    return(
      <div className="flex-container">
        <div className="ticker header">
          <span>Name</span>
          <span>Units</span>
          <span>Price</span>
          <span>Day Open</span>
          <span>Day Close</span>
          <span>Day High</span>
          <span>Day Low</span>
          <span>Volume</span>
          <span>Day Change</span>
          <span>Action</span>
        </div>
        {
          tickerlist.map((item) => {
            for(let z in price){
              if(price[z]['ticker'] === item.ticker.toUpperCase()){  
                console.log(item)
                return <TickerItem key={item.id} {...price[z]} id={item.id}/>
              }
            }
          })
        }
      </div>
    )
}


export default LoadTickers