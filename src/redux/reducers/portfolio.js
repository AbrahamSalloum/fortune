const initialState = {
    tickerlist: [], isloaded: undefined, price:[], news: [], plotdata: [], summary: [], toggledrawer: false, suggestion: [], searchticker: ''
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
            return { 
                ...state,
                uid: action.uid, 
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

        case 'TOGGLE_DRAW': {
            return {
                ...state, 
                toggledrawer: !state.toggledrawer
            }
        }

        case 'GET_SUGGESTION': {
            return {
                ...state, 
                suggestion: action.payload
            }
        }

        case 'GET_SEARCHTICKER': {
            return {
                ...state, 
                searchticker: action.payload
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