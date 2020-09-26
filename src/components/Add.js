import React from 'react'
import { Link } from "react-router-dom"
import { connect } from "react-redux";
import {StartaddTicker, fetchPrice, startsetTickers, loadsuggestions, storesearchticker} from '../redux/actions.js'
import { v4 as uuidv4 } from 'uuid';
import Autosuggest from 'react-autosuggest';
import Chip from '@material-ui/core/Chip';

class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestion: [],
      searchticker: ''
    };
  }
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

  onTickerChange = (val) => {
    this.setState({
      ticker: val
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
    fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete?region=US&q=${value}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        "x-rapidapi-key": "acf79a894fmsh38e96e215939adfp1aef8ejsn8f574aa46ecf"
      }
    })
    .then(res => res.json())
    .then((r) => {
      this.setState({ suggestion: r.quotes })
    })
  };

  onSuggestionsClearRequested = () => {
    this.setState({ suggestion: [] })
  };

  getSuggestionValue = (suggestion) => {
    return suggestion.symbol;
  }

  renderSuggestion = (suggestion) => {
    return(
      <div>
          <Chip
          label={`${suggestion.shortname} - ${suggestion.symbol} (${suggestion.exchange})`}
      />
      </div>
    )
  }

  searchtickerChange = (event, { newValue }) => {
    console.log(newValue)
    this.setState({searchticker: newValue})
    this.onTickerChange(newValue)
  }



  render(){
    const inputProps = {
      placeholder: 'Type a company',
      value: this.state.searchticker,
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
              suggestions={this.state.suggestion}
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

const mapDispatchToProps = (dispatch) => {
  return{
    StartaddTicker: (tickerinfo) => dispatch(StartaddTicker(tickerinfo)),
    fetchPrice: (ticker) => dispatch(fetchPrice(ticker)),
    startsetTickers: () => dispatch(startsetTickers()),
  }
}
export default connect(null, mapDispatchToProps)(Add)