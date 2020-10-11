import {firebase} from '../firebase/firebase'
import database from '../firebase/firebase'
import moment from 'moment'

let authheader = {
  "secretkey": process.env.REACT_APP_SERVER_KEY
  
}


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

export const getLineData = (line) => {
  return async (dispatch, getState) =>  {
    console.log(getState())
    fetch(`http://10.1.1.11.xip.io:5000/getlinedata/${line}`, {
      withCredentials: true,
      credentials: 'include',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getState().AddTickers.jwt.access_token}`
          
        }
      }
    ).then(plotdatareq => plotdatareq.json())
    .then((plotdata) => {
      const data = []
      try {
        for (let i in plotdata[line]["timestamp"]) {
          let t = moment.unix(plotdata[line]["timestamp"][i])
          let o = { timestamp: t.format("DD/MM/YY hh:mm"), close: plotdata[line]["close"][i] }
          data.push(o)
        }
        dispatch(SetLineChartData(data))
  
      } catch (err) {
        console.log(err)
      }      
    })  

  }
}

export const SetLineChartData = (line) => {
  return {
    type: "SET_LINECHART",
    payload: line
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
      dispatch(setTimeStamp())

    })
  }
}

export const setTimeStamp = () => {
  return {
    type: "SET_TIMESTAMP",
    payload: Date.now()
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
      console.log(`Bearer ${getState().AddTickers.jwt.access_token}`)
      let commaedlist = ""
      tickerlist.forEach((t) => {
        commaedlist = commaedlist + t.ticker + ","
      })
      commaedlist = commaedlist.slice(0,-1)
      fetch(`http://10.1.1.11.xip.io:5000/gettickerprices/${commaedlist}`,  {
        withCredentials: true,
        credentials: 'include',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getState().AddTickers.jwt.access_token}`
        }
      }
    )
      .then(res => res.json())
      .then((r) => {
        const prices = []
        r.price.forEach((q) => {
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
        console.log(prices)
        dispatch(StorePrice(prices))
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  export const fetchNews = (ticker) => {
    return(dispatch, getState) => {
      
      fetch(`http://10.1.1.11.xip.io:5000/gettickernews/${ticker}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getState().AddTickers.jwt.access_token}`
        }
      }
    )
      .then(res => res.json())
      .then((r) =>{
        const news = r[0].items.result
        const item = {ticker, news}
        dispatch(StoreNews(item))
      })
    }
  }

  export const fetchChart = (range, ticker) => {
    return(dispatch, getState) => {
      let interval = "15m"
      if(range === "3mo"){
        interval = "1d"
      }
      interval = {"1d": "15m", "5d": "15m", "3mo": "1d", "6mo": "1d", "1y": "1wk", "5y": "1wk", "max": "1wk"}

      fetch(`http://10.1.1.11.xip.io:5000/getfetchchart/${interval[range]}/${range}/${ticker}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getState().AddTickers.jwt.access_token}`
        }
      }
    )
    .then(res => res.json())
    .then((r) => {
      dispatch(StorChart(r))
    })
    }
  }

export const dodelticker = (id) => {
  return(dispatch, getState) => {
    const uid = getState().AddTickers.uid
    database.ref(`users/${uid}/tickers/${id}`).remove().then((ref) => {
      dispatch(delticker(id));
    });
  }
}

export const delticker = (r) => ({
  type: 'DEL_TICKER',
  payload: r
})

export const fetchSummary = (ticker) => {
  return(dispatch, getState) => {
    fetch(`http://10.1.1.11.xip.io:5000/gettickersummary/${ticker}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getState().AddTickers.jwt.access_token}`
      }
    })
    .then(res => res.json())
    .then((r) => {
      dispatch(StoreSummary(r[0]))
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

export const getlist = () => ({
  type: 'GET_LIST'
})

export const login = (response) => ({
  type: 'LOGIN',
  payload: response
})

export const storejwt = (jwt) => ({
  type: 'STORE_JWT',
  payload: jwt
})

export const logout = () => ({
  type: 'LOGOUT',
})



export const startLogin = (response) => {
  return (dispatch, getState) => {
    fetch(`http://10.1.1.11.xip.io:5000/storelogin`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().AddTickers.jwt.access_token}`
      },
      method: 'POST',
      body: response
    }).then(res => res.json())
    .then((s) => {
      dispatch(login(JSON.stringify(s)))
      console.log(s)
      return s
    })
      .then((r) => {
        fetch(`http://10.1.1.11.xip.io:5000/auth`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getState().AddTickers.jwt.access_token}`
          },
          method: 'POST',
          body: JSON.stringify(r)
        }).then(jwt => jwt.json())
        .then((jwt) => {
          dispatch(storejwt(jwt))
        })
    })
  }
}

export const startLogout= () => {
  return () => {
    return firebase.auth().signOut();
  }
}