import React from 'react'
import { Link } from "react-router-dom"
import { connect } from "react-redux";
import {StartaddTicker, fetchPrice, startsetTickers, loadsuggestions, storesearchticker} from '../redux/actions.js'
import { v4 as uuidv4 } from 'uuid';
import Autosuggest from 'react-autosuggest';

class Add extends React.Component {

  onSubmit = (e) => {
    e.preventDefault()
    console.log(this.state)
    this.props.StartaddTicker(this.state)
    this.props.startsetTickers()
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

  onSuggestionsFetchRequested = ({ value }) => {
    this.props.loadsuggestions(value)
  };

  onSuggestionsClearRequested = () => {
    this.props.loadsuggestions([])
  };

  getSuggestionValue = (suggestion) => {
    return suggestion.symbol;
  }

  renderSuggestion = (suggestion) => {
    return(
      <div> {suggestion.shortname} - {suggestion.symbol}
    </div>
    )
  }

  searchtickerChange = (event, { newValue }) => {
    console.log(newValue)
    this.props.storesearchticker(newValue)
  }
  
  

  render(){
    const {searchticker} = this.props
    const inputProps = {
      placeholder: 'Type a company',
      value: searchticker,
      onChange: this.searchtickerChange
    };
    return(
<div>
          <div>
          <h1>Add</h1>
        </div>


        <form onSubmit={this.onSubmit}>
          <div className="flex-container">
            <div>
              
            <Autosuggest
            suggestions={this.props.suggestion}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
          />
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

const mapStateToProps = (state) => {
  return {
    suggestion: state.AddTickers.suggestion,
    searchticker: state.AddTickers.searchticker
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return{
    StartaddTicker: (tickerinfo) => dispatch(StartaddTicker(tickerinfo)),
    fetchPrice: (ticker) => dispatch(fetchPrice(ticker)),
    startsetTickers: () => dispatch(startsetTickers()),
    loadsuggestions: (w) => dispatch(loadsuggestions(w)),
    storesearchticker: (s) => dispatch(storesearchticker(s))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Add)