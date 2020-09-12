import {firebase, googleAuthProvider} from '../firebase/firebase'
import database from '../firebase/firebase'


export const addTicker = (tickerinfo) => {
    // tickerinfo should be object of {id, ticker, quantity}
    return {
        type: "ADD_TICKER",
        payload: tickerinfo
    }
}

export const setTickers = (tickers) => {
  // tickerinfo should be object of {id, ticker, quantity}
  return {
      type: "SET_TICKER",
      payload: tickers
  }
}

export const StartaddTicker = (tickerinfo) => {
  return(dispatch, getState) => {
    const uid = getState().AddTickers.uid

    database.ref(`users/${uid}/tickers`).push(tickerinfo).then((ref) => {
      dispatch(addTicker({
        id: ref.key,
        ...tickerinfo
      }));
    });
  }
}

export const startsetTickers = () => {
  return (dispatch, getState) => {
    const uid = getState().AddTickers.uid
    database.ref(`users/${uid}/tickers`)
    .once('value')
    .then((snapshot) => {
      const tickers = []
      snapshot.forEach((s) => {
        tickers.push({
          id: s.key,
          ...s.val()
        })
      })
      dispatch(fetchPrice(tickers))
      dispatch(setTickers(tickers))
      
    })
  }
}


export const StorePrice = (ticker) => {
    return {
        type: "ADD_PRICE",
        payload: ticker
    }
  }

  export const fetchPrice = (tickerlist) => {

    return(dispatch, getState) => {
      let commaedlist = ""
      tickerlist.forEach((t) => {
        commaedlist = commaedlist + t.ticker + ","
      })
      fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-quotes?region=US&lang=en&symbols=${commaedlist}`, {
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
          "x-rapidapi-key": "acf79a894fmsh38e96e215939adfp1aef8ejsn8f574aa46ecf"
        }
      })
      .then(res => res.json())
      .then((r) => {
        const prices = []
        r.quoteResponse.result.forEach((q) => {
          let price = {
            ticker: q.symbol,
            price: q.ask,
            dayopen: q.regularMarketOpen,
            dayclose:q.regularMarketPreviousClose,
            dayhigh:q.regularMarketDayHigh,
            daylow:"2",
            volume: q.regularMarketVolume,
            daychange: q.regularMarketChangePercent,
            additional: q
          }
          prices.push(price)
        })
        dispatch(StorePrice(prices))
      })
      .catch(err => {
        console.log(err);
      });

    }
  }

  export const fetchNews = (ticker) => {
    return(dispatch, getState) => {
      fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/get-news?region=US&category=${ticker}`, {
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
          "x-rapidapi-key": "acf79a894fmsh38e96e215939adfp1aef8ejsn8f574aa46ecf"
        }
      })
      .then(res => res.json())
      .then((r) =>{
        const news = r.items.result
        const item = {ticker, news}
        dispatch(StoreNews(item))
      })
    }
    
  }

  export const fetchChart = (range, ticker) => {
    console.log(range)
    return(dispatch, getState) => {
      let interval = "15m"
      if(range === "3mo"){
        interval = "1d"
      }
      interval = {"1d": "15m", "5d": "15m", "3mo": "1d", "6mo": "1d", "1y": "1wk", "5y": "1wk", "max": "1wk"}
      console.log(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-spark?interval=${interval[range]}&range=${range}&symbols=${ticker}`)
      fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-spark?interval=${interval[range]}&range=${range}&symbols=${ticker}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        "x-rapidapi-key": "acf79a894fmsh38e96e215939adfp1aef8ejsn8f574aa46ecf"
      }
    })
    .then(res => res.json())
    .then((r) => {
      console.log(r)
      dispatch(StorChart(r))
    })
    }
  }

  export const fetchSummary = (ticker) => {
    return(dispatch, getState) => {
      fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?region=US&symbol=${ticker}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        "x-rapidapi-key": "acf79a894fmsh38e96e215939adfp1aef8ejsn8f574aa46ecf"
      }
    })
    .then(res => res.json())
    .then((r) => {
      dispatch(StoreSummary(r))
    })
    }
  }

  export const StoreSummary = (r) => ({
    type: 'SET_SUMMARY',
    payload: r
  })

  export const StorChart = (r) => ({
    type: 'SET_CHART',
    payload: r
  })

  export const StoreNews = (news) => ({
      type: "SET_NEWS",
      payload: news
    })
  



export const login = (uid) => ({
    type: 'LOGIN',
    uid
})

export const logout = () => ({
    type: 'LOGOUT',
})

export const startLogin = () => {
    return () => {
        return firebase.auth().signInWithPopup(googleAuthProvider)
    }
}

export const startLogout= () => {
    return () => {
        return firebase.auth().signOut();
    }
}