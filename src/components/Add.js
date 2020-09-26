import React, {useState} from 'react'
import { Link } from "react-router-dom"
import {useDispatch } from "react-redux";
import {StartaddTicker, startsetTickers} from '../redux/actions.js'
import { v4 as uuidv4 } from 'uuid';
import Autosuggest from 'react-autosuggest';
import Chip from '@material-ui/core/Chip';

const Add = () => {

  const [suggestion, addsuggestions] = useState([])
  const [searchticker, savesearchticker] = useState('')
  const [ticker, setticker] = useState('')
  const [amount, setamount] = useState('')
  const [date, setdate] = useState('')
  const [purchaseprice, setpurchaseprice] = useState('')
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault()
    const id = uuidv4()
    dispatch(StartaddTicker({id, ticker,amount, date, purchaseprice}))
    dispatch(startsetTickers())
  }

  const onTickerChange = (val) => {
    setticker(val)
  }

  const onAmountChange = (e) => {
    setamount(e.target.value)
  }

  const onDateChange = (e) => {
    setdate(e.target.value)
  }

  const onPurPriceChange = (e) => {
    setpurchaseprice(e.target.value)
  }

  const onSuggestionsFetchRequested = ({ value }) => {
    fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete?region=US&q=${value}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        "x-rapidapi-key": "acf79a894fmsh38e96e215939adfp1aef8ejsn8f574aa46ecf"
      }
    })
    .then(res => res.json())
    .then((r) => {
      addsuggestions(r.quotes)
    })
  };

  const onSuggestionsClearRequested = () => {
    addsuggestions([])
  };

  const getSuggestionValue = (suggestion) => {
    return suggestion.symbol;
  }

  const renderSuggestion = (suggestion) => {
    return(
      <div>
        <Chip
          label={`${suggestion.shortname} - ${suggestion.symbol} (${suggestion.exchange})`}
        />
      </div>
    )
  }

  const searchtickerChange = (event, { newValue }) => {
    console.log(newValue)
    savesearchticker(newValue)
    onTickerChange(newValue)
  }

  const inputProps = {
    placeholder: 'Type a company',
    value: searchticker,
    onChange: searchtickerChange
  };

    return(
    <div>
      <div>
        <h1>Add</h1>
      </div>
      <form onSubmit={onSubmit}>
        <div className="flex-container">
          <div>
            <Autosuggest
              suggestions={suggestion}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
            />
          </div>
          <div>
            Amount: <input name="amount" type="number" placeholder="111" onChange={onAmountChange} />
          </div>
          <div>
            Purchase Price: <input name="amount" type="number" placeholder="0" onChange={onPurPriceChange} />
          </div>
          <div>
            Purchase Date: <input name="amount" type="date" placeholder="14/06/1990" onChange={onDateChange} />
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


export default Add