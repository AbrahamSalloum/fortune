const initialState = {
    tickerlist: [], isloaded: undefined, price:[], news: [], plotdata: [], summary: []
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

        case 'LOGOUT':
            return {}
        default: {
            return state
        }
    }
}