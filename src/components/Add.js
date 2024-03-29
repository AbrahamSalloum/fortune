import React, {useState} from 'react'
import {useDispatch, useSelector } from "react-redux";
import {StartaddTicker} from '../redux/actions.js'
import Autosuggest from 'react-autosuggest';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link } from "react-router-dom"
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

const Add = () => {
  const serverhost = process.env.REACT_APP_SERVER_HOST
  const [suggestion, addsuggestions] = useState([])
  const [searchticker, savesearchticker] = useState('')
  const [ticker, setticker] = useState('')
  const [amount, setamount] = useState(0)
  const [purchaseprice, setpurchaseprice] = useState('')
  const [asxonly, setasxonly] = useState(true)
  const [error, seterror] = useState(false)
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const jwt =  useSelector(state => state.AddTickers.jwt)

  const onSubmit = (e) => {
    e.preventDefault()
    const dateadded = Date.now()
    const pprce = new Date(selectedDate).getTime() / 1000
    if(error){
      return
    } else {
      dispatch(StartaddTicker({ticker,amount, pprce, purchaseprice, dateadded}))
    }
    
  }

  const onTickerChange = (val) => {
    setticker(val)
  }

  const onAmountChange = (e) => {
    seterror(false)
    if(isNaN(e.target.value)){
      seterror("Not a Valid Number")
    } else {
      setamount(e.target.value)
    }
    
  }

  const onDateChange = (date) => {
    setSelectedDate(date)
  }

  const setASXcheckbox = (v) => {
    setasxonly(!asxonly)
  }

  const onPurPriceChange = (e) => {
    setpurchaseprice(e.target.value)
  }

  const onSuggestionsFetchRequested = ({value}) => {
    if(value.length < 3){
      addsuggestions([])
      return
    }
    fetch(`${serverhost}/getsuggestions/${value}`, {
      withCredentials: true,
      credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt.token}`
        }
    })
    .then(res => res.json())
    .then((r) => {
      if(r.quotes){
        if(asxonly){
          const rasx = r.quotes.filter(t => t.exchange === "ASX")
          addsuggestions(rasx)
        }
        else {
          const rasx  = r.quotes
          addsuggestions(rasx)
        }
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
    const detailsurl = `/details/${suggestion.symbol}`
    return(
      <div className="SearchSuggestion">
        <div>
          <div>
          {`${suggestion.symbol} (${suggestion.exchange})`} {<Link to={detailsurl}>Details...</Link>} 
          </div>
        </div>
        <div>
        {`${suggestion.longname}`}
        </div>
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
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <form onSubmit={onSubmit}>
        <div className="form-box">
        <h1>Add</h1>
          <div className="form-item">
          <Autosuggest
              suggestions={suggestion}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
            />
          </div>
          <div className="form-item">
        <FormControlLabel
          control={<Checkbox checked={asxonly} onChange={setASXcheckbox} name="checkedB" color="primary"/>}
          label="ASX Only"
        />
        </div>
          <div className="form-item">
           <TextField name="amount" id="outlined-basic" currencySymbol="" label="Amount"  variant="outlined" step={0.5}  onChange={onAmountChange} error={!!error} helperText={error} />
          </div>
          <div className="form-item">
            <CurrencyTextField  name="purchaseprice" id="outlined-basic" label="Purchase Price" variant="outlined" decimalCharacter="." digitGroupSeparator="," outputFormat="string" onChange={onPurPriceChange} />
          </div>
          <div className="form-item">
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Select Purchase Date"
              format="dd/MM/yyyy"
              value={selectedDate}
              onChange={onDateChange}
              KeyboardButtonProps={{'aria-label': 'change date',}}
            />
          </div>
          <div className="form-item">
            <Button variant="contained" color="Primary" type="submit">Save</Button>
          </div>
        </div>
      </form>
      </MuiPickersUtilsProvider>
    </div>
  )
}


export default Add