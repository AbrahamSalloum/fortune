const initialState = {
    tickerlist: [],
    price:[],
    news: [],
    plotdata: [],
    summary: [],
    searchticker: '',
    lastpriceupdate: '',
    linedata: [],
    logindata: [],
    jwt: false,
    uid: false,
    loginmsg: ''
}

export default function(state=initialState, action){
    switch(action.type){
        case "ADD_TICKER": {
            const {id,ticker, amount} = action.payload
            return {
                ...state,
                tickerlist: [...state.tickerlist, {id,ticker, amount}]
            }
        }

        case "LOGIN_MSG": {
            const msg = action.payload
            return {
                ...state,
                loginmsg: msg
            }
        }

        case "ADD_PRICE": {
            const prices = action.payload
            return {
                ...state,
                price: [state.tickerlist, ...prices]
            }
        }
        case "SET_TICKER": {
            const tickers = action.payload
            return {
                ...state,
                tickerlist: [...tickers]
            }
        }

        case "SET_LINECHART": {
            const line = action.payload
            return {
                ...state,
                linedata: [...line]
            }
        }

        case "DEL_TICKER": {
            const idd = action.payload
            return {
                ...state,
                tickerlist: state.tickerlist.filter(({ id }) => id !== idd)
            }
        }

        case "SET_CHART": {
            const chart = action.payload
            return {
                ...state,
                plotdata: [chart]
            }
        }
        case 'LOGIN': {
            const login = action.payload
            return {
                ...state,
                logindata: [login]
            }
        }

        case 'SET_UID': {
            const uid = action.payload
            return {
                ...state,
                uid: uid
            }
        }

        case 'STORE_JWT': {
            const jwt = action.payload
            return {
                ...state,
                jwt: jwt
            }
        }

        case 'SET_NEWS': {
            const newsitem = action.payload
            return {
                ...state,
                news: [...state.news , newsitem],
            }
        }

        case 'SET_SUMMARY': {
            const summary = action.payload
            return {
                ...state,
                summary: [...state.summary, summary]
            }
        }

        case 'SET_TIMESTAMP': {
            return {
                ...state,
                lastpriceupdate: action.payload
            }
        }


        case 'LOGOUT':
            return {}

        case 'GET_LIST': {
            return state
        }

        default: {
            return state
        }
    }
}