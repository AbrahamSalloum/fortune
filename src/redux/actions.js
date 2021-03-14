import moment from 'moment'
const serverhost = process.env.REACT_APP_SERVER_HOST
const mainurl = process.env.REACT_APP_MAIN_URL

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


export const isloggedin = (status) => {
  // tickerinfo should be object of {id, ticker, quantity}
  return {
      type: "TRIGGER_LOGGED",
      payload: status
  }
}



export const getLineData = (line) => {
  return async (dispatch, getState) =>  {
    dispatch(checkJWT())
    fetch(`${serverhost}/getlinedata/${line}`, {
      withCredentials: true,
      credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getState().AddTickers.jwt.token}`
        }
    })
    .then((plotdatareq) => {
      return plotdatareq.json()
    })
    .then((plotdata) => {
      const data = []
      try {
        for (let i in plotdata[0]["timestamp"]) {
          let t = moment.unix(plotdata[0]["timestamp"][i])
          let o = { timestamp: t.format("DD/MM/YY hh:mm"), close: plotdata[0]["close"][i] }
          data.push(o)
        }
        dispatch(SetLineChartData(data))

      } catch (err) {
        //dispatch(SetLineChartData([]))
        console.log(err)
      }
    }).catch((e) => console.log(e))
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
    })
    .catch((e) => console.log(e));
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
  return async (dispatch, getState, { getFirebase }) => {
    dispatch(checkJWT())
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
    .catch((e) => console.log(e));
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
    dispatch(checkJWT())
    let commaedlist = ""
    tickerlist.forEach((t) => {
      commaedlist = commaedlist + t.ticker + ","
    })
    commaedlist = commaedlist.slice(0,-1)
    fetch(`${serverhost}/gettickerprices/${commaedlist}`,  {
      withCredentials: true,
      credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getState().AddTickers.jwt.token}`
      }
    })
    .then((res) => {
      return res.json()
    })
    .then((r) => {
      r.price.forEach((q) => {
        let price = {
          ticker: q.symbol,
          price: q.regularMarketPrice,
          dayopen: q.regularMarketOpen,
          dayclose:q.regularMarketPreviousClose,
          dayhigh:q.regularMarketDayHigh,
          daylow: q.regularMarketDayLow || 0,
          volume: q.regularMarketVolume,
          daychange: q.regularMarketChangePercent || 0,
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
  return async (dispatch, getState) => {
    dispatch(checkJWT())
      fetch(`${serverhost}/gettickernews/${ticker}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getState().AddTickers.jwt.token}`
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
      dispatch(checkJWT())
      fetch(`${serverhost}/getlinedata/${interval[range]}/${range}/${ticker}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getState().AddTickers.jwt.token}`
        }
      })
      .then((res) => {
        return res.json()
      })
      .then((r) => {
        dispatch(StorChart(r[0]))
      }).catch((e) => console.log(e))
    }
}


export const dodelticker = (id) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase()
    const database = firebase.database()
    const uid = getState().AddTickers.uid
    database.ref(`users/${uid}/tickers/${id}`).remove().then((ref) => {
      dispatch(delticker(id));
    })
    .catch((e) => console.log(e));
  }
}


export const delticker = (r) => ({
  type: 'DEL_TICKER',
  payload: r
})


export const fetchSummary = (ticker) => {
  return async (dispatch, getState) => {
    dispatch(checkJWT())
    fetch(`${serverhost}/gettickersummary/${ticker}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getState().AddTickers.jwt.token}`
      }
    })
    .then((res) => {
      return res.json()
    })
    .then((r) => {
      dispatch(StoreSummary(r[0]))
    })
    .catch((err) => console.log(err))
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


export const SignUpEmail = (emailpass, history) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase()
    firebase.auth().createUserWithEmailAndPassword(emailpass.email, emailpass.password)
    .then((result) => {
      result.user.sendEmailVerification({ url: mainurl}).then((r) => {
      })
      return result
    })
    .then((result) => {
      firebase.reloadAuth()
      return result
    })
    .then(() => {
      dispatch(createJWT())
      //dispatch(isloggedin(true))
    })
    .then(() => {
      history.push('/dashboard')
    })
    .catch((err) => {
      dispatch(loginmsg(err.message))
    })
  }
}


export const SignInEmail = (emailpass, history) => {
  return (dispatch, getState, { getFirebase }) => {

    const firebase = getFirebase()
    firebase.auth().signInWithEmailAndPassword(emailpass.email, emailpass.password)
    .then(result => {
      if (!result.user.emailVerified) {
        throw  new Error("Plese verify your email (Check your inbox)")
      } else {
        firebase.reloadAuth()
      }
      return result
    })
    .then(() => {
      dispatch(createJWT())

    })
    .then(() => {
      history.push('/dashboard')
    })
    .then(() => {
      dispatch(loginmsg("Login OK, Redirecting..."))
    })
    .catch((err) => {
      dispatch(SignOut(err.message))
    })
  }
}


export const googleSignin = (history) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase()
    const googleProvider = new firebase.auth.GoogleAuthProvider()

    firebase.auth().signInWithPopup(googleProvider)
    .then((result) => {
      firebase.reloadAuth()
      return result
    })
    .then(() => {
      // if (!!getState().firebase.auth.uid){
      //   dispatch(createJWT())
      //   dispatch(isloggedin(true))
      // }
      dispatch(createJWT())
      dispatch(isloggedin(true))
    })
    .then(() => {
      history.push('/dashboard')
    })
    .then(() => {
      dispatch(loginmsg("Login OK, Redirecting..."))
    })
    .catch((err) => {
      console.log(err)
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
    try {
    const logindetaails = getState().firebase.auth

    let r = {
      username: logindetaails.email,
      password: logindetaails.uid,
      userid: logindetaails.uid
    }

    let s = await fetch(`${serverhost}/storelogin`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer NONE`
      },
      method: 'POST',
      body: JSON.stringify(r)
    })

    if(s.status === 403){
      throw new Error("Forbidden, Probably banned")
    }

    let jwtf = await fetch(`${serverhost}/auth`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer NONE`
          },
          method: 'POST',
          body: JSON.stringify(r)
        })

    let jwt = await jwtf.json()

    if(!!jwt.token){
        sessionStorage.setItem('jwtstore', JSON.stringify(jwt))
    }

    dispatch(storejwt(jwt))
    dispatch(login(r))
    if(!!r.userid){
      console.log('setting uid..')
      sessionStorage.setItem('uid', r.userid)
      dispatch(setUid(r.userid))
    }
  } catch (err) {
    console.log(err)
  }
    dispatch(isloggedin(true))
  }
}


export const SignOut = (msg="") => {

  return (dispatch, getState, { getFirebase }) => {
    sessionStorage.clear()
    let firebase = getFirebase()
    firebase.auth().signOut().then(() => {
      dispatch(loginmsg(msg))
    })
    .then(() => {
      dispatch(storejwt(false))
      dispatch(isloggedin(false))
    })
    .then(() => {
      dispatch(setUid(false))
    })
    .then(() => {

    })
  }
}


export const checkJWT = () => {
  return async (dispatch, getState) => {
    const jwt = getState().AddTickers.jwt.token
    if(!jwt){
      console.log("jwt not found....")
      await dispatch(createJWT())
      return
    }
    const now = new Date();
    const time = Math.round(now.getTime() / 1000)
    const jwt_part = jwt.split(".")
    const data = JSON.parse(atob(jwt_part[1]))
    if (time > data['exp']) {
      dispatch(SignOut("signing out.."))
    } else
    if (data['exp'] -300 > time){
      console.log("JWT almost expired, making new JWT....")
      dispatch(createJWT())
    }
  }
}