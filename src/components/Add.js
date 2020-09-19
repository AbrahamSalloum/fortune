import React from 'react'
import { Link } from "react-router-dom"
import { connect } from "react-redux";
import {StartaddTicker, fetchPrice} from '../redux/actions.js'
import { v4 as uuidv4 } from 'uuid';


class Add extends React.Component {

  onSubmit = (e) => {
    e.preventDefault()
    console.log(this.state)
    this.props.StartaddTicker(this.state)
  }

  onIdChange = (e) => {
    this.setState({
      id: uuidv4()
    })
  }

  onTickerChange = (e) => {
    this.setState({
      ticker: e.target.value
    })
  }

  onAmountChange = (e) => {
      this.setState({
        amount: e.target.value
    })
  }

  onDateChange = (e) => {
    this.setState({
      date: e.target.value
    })
  }

  onPurPriceChange = (e) => {
    this.setState({
      purchaseprice: e.target.value
    })
  }

  render(){
    return(
<div>
          <div>
          <h1>Add</h1>
        </div>


        <form onSubmit={this.onSubmit}>
          <div className="flex-container">
            <div>
              Ticker: <input name="ticker" type="text" placeholder="ASX:A2M" onChange={this.onTickerChange} />
            </div>
            <div>
              Amount: <input name="amount" type="number" placeholder="111" onChange={this.onAmountChange} />
            </div>
            <div>
              Purchase Price: <input name="amount" type="number" placeholder="0" onChange={this.onPurPriceChange} />
            </div>
            <div>
              Purchase Date: <input name="amount" type="date" placeholder="14/06/1990" onChange={this.onDateChange} />
            </div>
            <div>
              <button>Add</button>
            </div>
            <div>
              <Link to="/">Home</Link>
            </div>
          </div>
        </form>

      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return{
    StartaddTicker: (tickerinfo) => dispatch(StartaddTicker(tickerinfo)),
    fetchPrice: (ticker) => dispatch(fetchPrice(ticker))
  }
}
export default connect(null, mapDispatchToProps)(Add)