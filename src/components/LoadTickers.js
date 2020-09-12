import React from 'react'
import { Link } from "react-router-dom"
import { connect } from 'react-redux';

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
  additional = 0
}
  ) => (
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
  </div>
)




class LoadTickers extends React.Component {

  render() {

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
        </div>
        {
          this.props.tickerlist.map((item) => {
            for(let z in this.props.price){
              if(this.props.price[z]['ticker'] === item.ticker.toUpperCase()){  
                console.log(item)
                return <TickerItem key={item.id} {...this.props.price[z]}/>
              }
            }
          })
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    tickerlist: state.AddTickers.tickerlist,
    price: state.AddTickers.price,
    uid: state.AddTickers.uid
  };
};


export default connect(mapStateToProps)(LoadTickers)