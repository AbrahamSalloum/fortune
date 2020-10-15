import React, {useState} from 'react'
import {useDispatch, useSelector } from "react-redux";
import {StartaddTicker, startsetTickers} from '../redux/actions.js'
import Autosuggest from 'react-autosuggest';
import Chip from '@material-ui/core/Chip';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const Add = () => {
  const serverhost = process.env.REACT_APP_SERVER_HOST
  const [suggestion, addsuggestions] = useState([])
  const [searchticker, savesearchticker] = useState('')
  const [ticker, setticker] = useState('')
  const [amount, setamount] = useState('')
  const [purchaseprice, setpurchaseprice] = useState('')
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date('2014-08-18T21:11:54'));
  const jwt =  useSelector(state => state.AddTickers.jwt)
  const onSubmit = (e) => {
    e.preventDefault()
    const dateadded = Date.now()
    const pprce = new Date(selectedDate).getTime() / 1000
    dispatch(StartaddTicker({ticker,amount, pprce, purchaseprice, dateadded}))
    dispatch(startsetTickers())
  }

  const onTickerChange = (val) => {
    setticker(val)
  }

  const onAmountChange = (e) => {
    setamount(e.target.value)
  }

  const onDateChange = (date) => {
    setSelectedDate(date)
  }

  const onPurPriceChange = (e) => {
    setpurchaseprice(e.target.value)
  }

  const onSuggestionsFetchRequested = ({ value }) => {
    if(value.length < 3){
      addsuggestions([])
      return
    }
    fetch(`${serverhost}:5000/getsuggestions/${value}`, {
      withCredentials: true,
      credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt.access_token}`
        }
    })
    .then(res => res.json())
    .then((r) => {
      if(r.quotes){
        addsuggestions(r.quotes)
      }
    })
    .catch(err => {
      console.log(err);
    });
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
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <form onSubmit={onSubmit}>
        <div className="form-box">
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
           <TextField name="amount" id="outlined-basic" type="number" label="Amount" variant="outlined" onChange={onAmountChange} />
          </div>
          <div>
            <TextField name="purchaseprice" id="outlined-basic" label="Purchase Price" variant="outlined" onChange={onPurPriceChange} />
          </div>
          <div>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Select Purchase Date"
              format="MM/dd/yyyy"
              value={selectedDate}
              onChange={onDateChange}
              KeyboardButtonProps={{'aria-label': 'change date',}}
            />
          </div>
          <div>
            <Button variant="contained" color="Primary" type="submit">Save</Button>
          </div>
        </div>
      </form>
      </MuiPickersUtilsProvider>
    </div>
  )
}


export default Add