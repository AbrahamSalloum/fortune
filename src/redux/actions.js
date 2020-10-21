// import {firebase} from '../firebase/firebase'
// import database from '../firebase/firebase'
import moment from 'moment'
const serverhost = process.env.REACT_APP_SERVER_HOST

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
    dispatch(checkJWT())
    fetch(`${serverhost}:5000/getlinedata/${line}`, {
      withCredentials: true,
      credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getState().AddTickers.jwt.access_token}`

        }
      }
    ).then(plotdatareq => plotdatareq.json())
    .then((m) => {
      return m
    })
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
  return(dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase()
    const database = firebase.database()
    const uid = getState().AddTickers.uid
    database.ref(`users/${uid}/tickers`).push(tickerinfo).then((ref) => {
      dispatch(addTicker({
        id: ref.key,
        ...tickerinfo
      }));
    }).then(() => {
      dispatch(startsetTickers())
    });
  }
}

export const startsetTickers = () => {
  const tickers = []
  return (dispatch, getState, { getFirebase }) => {
    const uid = getState().AddTickers.uid
    const firebase = getFirebase()
    const database = firebase.database()
    database.ref(`users/${uid}/tickers`)
    .once('value')
    .then((snapshot) => {

      snapshot.forEach((s) => {
        tickers.push({
          id: s.key,
          ...s.val()
        })
      })

  })
      .then(() => {
        dispatch(fetchPrice(tickers))
      })
      .then(() => {
        dispatch(setTickers(tickers))
      })
      .then(() => {
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
    const prices = []
    return(dispatch, getState) => {
      dispatch(checkJWT())
      let commaedlist = ""
      tickerlist.forEach((t) => {
        commaedlist = commaedlist + t.ticker + ","
      })
      commaedlist = commaedlist.slice(0,-1)
      fetch(`${serverhost}:5000/gettickerprices/${commaedlist}`,  {
        withCredentials: true,
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getState().AddTickers.jwt.access_token}`
        }
      }
    )
      .then(res => res.json())
      .then((r) => {

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


      })
        .then(() => {
          dispatch(StorePrice(prices))
        })
      .catch(err => {
        console.log(err);
      });
    }
  }

  export const fetchNews = (ticker) => {
    return(dispatch, getState) => {
      dispatch(checkJWT())
      fetch(`${serverhost}:5000/gettickernews/${ticker}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getState().AddTickers.jwt.access_token}`
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
      dispatch(checkJWT())
      fetch(`${serverhost}:5000/getfetchchart/${interval[range]}/${range}/${ticker}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getState().AddTickers.jwt.access_token}`
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
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase()
    const database = firebase.database()
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
    dispatch(checkJWT())
    fetch(`${serverhost}:5000/gettickersummary/${ticker}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().AddTickers.jwt.access_token}`
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

export const loginmsg = (msg) => ({
  type: 'LOGIN_MSG',
  payload: msg
})

export const SignUpEmail = (emailpass) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase()
    const database = firebase.database()
    firebase.auth().createUserWithEmailAndPassword(emailpass.email, emailpass.password)
    .then((result) => {
      result.user.sendEmailVerification({url:"http://10.1.1.11.xip.io:3000/"})
      dispatch(createJWT())
    }).catch((err) => {
     dispatch(loginmsg(err.message))
    })
  }
}

export const SignInEmail = (emailpass) => {

  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase()
    const database = firebase.database()
    firebase.auth().signInWithEmailAndPassword(emailpass.email, emailpass.password)
    .then(result => {
      if (!result.user.uid) {
        firebase.auth().signOut();
      }
      if (!result.user.emailVerified) {
        dispatch(SignOut())
        dispatch(loginmsg("Plese verify your email (Check your inbox)"))
      }
      return result
    }).then(() => {
      dispatch(createJWT())
    })
      .catch(err => {
      dispatch(loginmsg(err.message))
    })
  }
}


export const googleSignin = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase()
    const googleProvider = new firebase.auth.GoogleAuthProvider()

    firebase.auth().signInWithPopup(googleProvider).then((result) => {
      if (!result.user.emailVerified) {
        dispatch(SignOut())
        dispatch(loginmsg("Plese verify your email (Check your inbox)"))
      }

    }).catch((err) => {
      dispatch(loginmsg(err.message))
    })
  }
}

export const setUid = (response) => ({
  type: 'SET_UID',
  payload: response
})

export const storejwt = (jwt) => ({
  type: 'STORE_JWT',
  payload: jwt
})

export const logout = () => ({
  type: 'LOGOUT',
})


export const createJWT = () => {
  return(dispatch, getState) => {
    const logindetaails =  getState().firebase.auth
    let r = { username: logindetaails.email, password: logindetaails.uid, userid: logindetaails.uid}
    fetch(`${serverhost}:5000/auth`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer NONE`
      },
      method: 'POST',
      body: JSON.stringify(r)
    })
    .then(jwt => jwt.json())
    .then((jwt) => {
      dispatch(storejwt(jwt))
    })
    .then(() => {
      dispatch(login(r))
    })
      .then(() => {
        dispatch(setUid(r.userid))
      })
    .catch((err) => {
        console.log("ERROR CREATING JWT", err)
      })
  }
}


export const SignOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    let firebase = getFirebase()
    dispatch(loginmsg(''))
    return firebase.auth().signOut();
  }
}



export const checkJWT = () => {
  return (dispatch, getState) => {
    const jwt = getState().AddTickers.jwt.access_token
    if(!jwt){
      dispatch(createJWT())
      return
    }
    const now = new Date();
    const time = Math.round(now.getTime() / 1000)
    const jwt_part = jwt.split(".")
    const data = atob(jwt_part[1])
    if (data['exp'] > (time - 300) ){
      dispatch(createJWT())
    }
  }
}