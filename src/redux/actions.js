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
    await Wcheckjwt(dispatch)
    fetch(`${serverhost}:5000/getlinedata/${line}`, {
      withCredentials: true,
      credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getState().AddTickers.jwt.access_token}`
        }
    })
    .then((plotdatareq) => {
      return plotdatareq.json()
    })
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
    })
    .then(() => {
      dispatch(startsetTickers())
    });
  }
}


export const ResetPassword = (email) => {
  return(dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase()
    firebase.auth().sendPasswordResetEmail(email.email).then((r) => {
      dispatch(loginmsg("Please Check Inbox for reset instructions"))
    })
    .catch((err) => {
      dispatch(loginmsg(err.message))
    })
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
  return async (dispatch, getState) => {
    await Wcheckjwt(dispatch)
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
    })
    .then((res) => {
      return res.json()
    })
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


const Wcheckjwt = async (dispatch) => {
  await dispatch(checkJWT())
}

export const fetchNews = (ticker) => {
  return async (dispatch, getState) => {
    await Wcheckjwt(dispatch)
      fetch(`${serverhost}:5000/gettickernews/${ticker}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getState().AddTickers.jwt.access_token}`
        }
      })
      .then(res => res.json())
      .then((r) =>{
        const news = r[0].items.result
        const item = {ticker, news}
        dispatch(StoreNews(item))
      }).catch(err => console.log(err))
  }
}


export const fetchChart = (range, ticker) => {
    return async (dispatch, getState) => {
      let interval = "15m"
      if(range === "3mo"){
        interval = "1d"
      }
      interval = {"1d": "15m", "5d": "15m", "3mo": "1d", "6mo": "1d", "1y": "1wk", "5y": "1wk", "max": "1wk"}
      await Wcheckjwt(dispatch)
      fetch(`${serverhost}:5000/getfetchchart/${interval[range]}/${range}/${ticker}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getState().AddTickers.jwt.access_token}`
        }
      })
      .then((res) => {
        return res.json()
      })
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
  return async (dispatch, getState) => {
    await Wcheckjwt(dispatch)
    fetch(`${serverhost}:5000/gettickersummary/${ticker}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().AddTickers.jwt.access_token}`
      }
    })
    .then((res) => {
      return res.json()
    })
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
  return async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase()
    firebase.auth().createUserWithEmailAndPassword(emailpass.email, emailpass.password)
    .then((result) => {
      result.user.sendEmailVerification({url:"http://10.1.1.11.xip.io:3000/"})
      return result
    })
    .then((result) => {
      firebase.reloadAuth().then(async () => {
        await WcreateJWT(dispatch)
      })
    })
    .catch((err) => {
      dispatch(loginmsg(err.message))
    })
  }
}


export const SignInEmail = (emailpass) => {
  return async (dispatch, getState, { getFirebase }) => {

    const firebase = getFirebase()
    firebase.auth().signInWithEmailAndPassword(emailpass.email, emailpass.password)
    .then(result => {
      if (!result.user.emailVerified) {
        dispatch(SignOut("Plese verify your email (Check your inbox)"))
      } else {
        firebase.reloadAuth().then(async () => {
          await WcreateJWT(dispatch)
        })
      }
      return result
    })
    .catch(err => {
      dispatch(loginmsg(err.message))
    })
  }
}


export const googleSignin = () => {
  return async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase()
    const googleProvider = new firebase.auth.GoogleAuthProvider()

    firebase.auth().signInWithPopup(googleProvider).then((result) => {
      firebase.reloadAuth().then(async () => {
        await WcreateJWT(dispatch)
      })
    })
    .catch((err) => {
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
  return async (dispatch, getState) => {
    const logindetaails =  getState().firebase.auth
    let r = { username: logindetaails.email, password: logindetaails.uid, userid: logindetaails.uid}
    await fetch(`${serverhost}:5000/storelogin`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer NONE`
      },
      method: 'POST',
      body: JSON.stringify(r)
    })
    .then((s) => {
      if(s.status == 403){
        throw new Error("Forbidden, Probably banned")
         
      }
      return s
    })
    .then((z) => {
        fetch(`${serverhost}:5000/auth`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer NONE`
          },
          method: 'POST',
          body: JSON.stringify(r)
        })
        .then((jwt) => {
          return jwt.json()
        })
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
    })
    .catch((err) => {
      console.log(err.toString())
      dispatch(SignOut(err.toString()))
    })
  }
}


export const SignOut = (msg="") => {
  return (dispatch, getState, { getFirebase }) => {
    let firebase = getFirebase()
    firebase.auth().signOut().then(() => {
      dispatch(loginmsg(msg))
    })
    .then(() => {
      dispatch(setUid(false))
    })
    .then(() => {
      dispatch(storejwt(false))
    })
  }
}

const WcreateJWT = async (dispatch) => {
  await dispatch(createJWT())
}

export const checkJWT = () => {
  return async (dispatch, getState) => {
    console.log("CHECK JWT")
    const jwt = getState().AddTickers.jwt.access_token
    if(!jwt){
      console.log('No JWT')
      await WcreateJWT(dispatch)
      return
    }
    const now = new Date();
    const time = Math.round(now.getTime() / 1000)
    const jwt_part = jwt.split(".")
    const data = JSON.parse(atob(jwt_part[1]))
    if (data['exp'] < (time - 300) ){
      console.log("JWT expired, making new JWT....")
     await WcreateJWT(dispatch)
    } else if (time > data['exp']){
      dispatch(SignOut("logged out after 30mins of inactivity"))
    }
  }
}