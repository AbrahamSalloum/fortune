const express = require('express')
const router = express.Router()
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

const NEXT_UPDATE_DELTA = 1200000 //20 mins in milliseconds

const fetchurl = async (url) => {
    const data = await fetch(url, {
        "headers": {
                "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
                "x-rapidapi-key": process.env.RAPID_API_KEY
        }
    })
    const data_json = await data.json()
    return data_json
}


router.get('/gettickersummary/:ticker', verifyToken, async (req, res) => {
    try {
        const db = req.app.locals.db
        const ticker = req.params.ticker
        const now = Date.now()
        const findstoredsummary = await db.collection('summary').find({"symbol": ticker, "nextupdate":{"$gt": now}})
        const findstoredsummary_count = await findstoredsummary.count()

        if(findstoredsummary_count > 0){
            const rows = await findstoredsummary.toArray()
            res.send(rows)
            return
        }

        const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?region=US&symbol=${ticker}`
        const data = await fetchurl(url)
        data['dateupdated'] = now
        data['nextupdate'] = now + NEXT_UPDATE_DELTA
        const status = await db.collection('summary').findOneAndReplace({"symbol": ticker }, data, {"upsert":true, upsert:true})
        const findstatus = await db.collection('summary').find({"symbol": ticker })
        const rows = await findstatus.toArray()
        res.send(rows)
    } catch(error){
        console.log(error)
        res.status(500).json({msg: error.message})
        return
    }
})


router.get('/getlinedata/:interval?/:range?/:ticker', verifyToken, async (req, res) => {
	try {
        const now = Date.now()
        const ticker = req.params.ticker
        const interval = req.params.interval || "1WK"
        const range = req.params.range || "max"
        const db = req.app.locals.db
        const filterquery = {}
        filterquery["symbol"] = ticker
        filterquery["range"] = range
        filterquery["interval"] = interval
        const findlinedata = await db.collection('chart').find({...filterquery, "nextupdate":{"$gt": now}})
        const findlinedata_count = await findlinedata.count()
        if(findlinedata_count > 0){
            const rows = await findlinedata.toArray()
            res.send(rows)
            return
        }
        const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-spark?interval=${interval}&range=${range}&symbols=${ticker}`
        const data = await fetchurl(url)
        data[ticker]['dateupdated'] = now
        data[ticker]['nextupdate'] = now + NEXT_UPDATE_DELTA
        data[ticker]['interval'] = interval
        data[ticker]['range'] = range

        const status = await db.collection('chart').findOneAndReplace(filterquery, data[ticker], {"upsert":true, upsert:true})
        const findstatus = await db.collection('chart').find(filterquery)
        const finddata = await findstatus.toArray()
        res.send(finddata)
    } catch(error){
        console.log(error)
        res.status(500).json({msg: error.message})
        return
    }
})


router.get('/gettickernews/:ticker', verifyToken, async (req, res) => {
    try {
        const ticker = req.params.ticker
        const db = req.app.locals.db
        const now = Date.now()
        const findstoredsymbol = await db.collection('news').find({"symbol": ticker})
        const findstoredsymbol_count = await findstoredsymbol.count()
        if(findstoredsymbol_count > 0){
            const rows = await findstoredsymbol.toArray()
            res.send(rows)
            return
        }
        const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/get-news?region=US&category=${ticker}`
        const data = await fetchurl(url)
        data['dateupdated'] = now
        data['nextupdate'] = now + NEXT_UPDATE_DELTA
        data['symbol'] = ticker

        const status = await db.collection('news').findOneAndReplace({"symbol": ticker }, data, {"upsert":true, upsert:true})
        const findstatus = await db.collection('news').find({"symbol": ticker })
        rows = await findstatus.toArray()
        res.send(rows)
    } catch(error){
        console.log(error)
        res.status(500).json({msg: error.message})
        return
    }
})


router.get('/getsuggestions/:ticker',  verifyToken, async (req, res) => {
    try {
        const ticker = req.params.ticker
        const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete?region=AU&q=${ticker}`
        const data = await fetchurl(url)
        res.send(data)
    } catch(error){
        console.log(error)
        res.status(500).json({msg: error.message})
        return
    }
})


router.post('/storelogin',  async (req, res) => {
    try {
        const db = req.app.locals.db
        const userdata = req.body
        const checkbanned = await db.collection('banned').findOne({'userid': userdata['userid']})
        if(checkbanned > 0){
            res.status(403).json({msg: "You appear to be in the banned list. Email Admin for info"})
            return
        }
        userdata['lastlogin'] = Date.now()
        const status = await db.collection('users').findOneAndReplace({"userid": userdata['userid'] }, userdata, {"upsert":true, upsert:true})
        res.status(200).json(status)
    } catch(error){
        console.log(error)
        res.status(500).json({msg: error.message})
        return
    }
})


router.post('/auth', async(req,res) => {
    expiry = Math.floor(Date.now() / 1000) + (60 * 20) // 20mins
    const userdata = req.body
    userdata['exp'] =  expiry
    checkusers = 1
    if(checkusers == 0){
        res.status(403).json({msg: "You appear to be not logged in. Email Admin for info"})
    }

    jwt.sign(userdata, "secretkey", (err, token) => {
        res.json({
            token
        })
    })
})


router.get('/gettickerprices/:tickerlist', verifyToken, async (req, res) => {
    try {
        const tickerlist = req.params.tickerlist
        const tickerlist_arr = tickerlist.split(',')
        const now = Date.now()
        const db = req.app.locals.db
        findstatus = await db.collection('prices').find({ 'symbol': { "$in": tickerlist_arr }, "nextupdate": { "$gt": now }})
        rows = await findstatus.toArray()

        const found_cache_tickers = []
        for (let row in rows){
            found_cache_tickers.push(rows[row]['symbol'])
        }
        const found_cache_tickers_set = new Set(found_cache_tickers)
        const tickerlist_arr_set = new Set(tickerlist_arr)
        const  difference = new Set([...tickerlist_arr_set].filter(x => !found_cache_tickers_set.has(x)))
        const tickerlist_new = [...difference].join(',')
        if(tickerlist_new.length > 0){
	    const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-quotes?region=US&lang=en&symbols=${tickerlist_new}`
            const priceslist = await fetchurl(url)
            for (let price in priceslist['quoteResponse']["result"]) {
                oneprice = priceslist['quoteResponse']["result"][price]
                oneprice['dateupdated'] = Date.now()
                oneprice['nextupdate'] = now + NEXT_UPDATE_DELTA
                symbol = oneprice['symbol']
                status = await db.collection('prices').findOneAndReplace({ "symbol": symbol }, oneprice, { "upsert": true, upsert: true })
            }
    	}
        findstatus = await db.collection('prices').find({ 'symbol': { "$in": tickerlist_arr } })
        rows = await findstatus.toArray()
        const s = {}
        s['price'] = rows
        res.status(200).json(s)
    } catch(error){
        console.log(error)
        res.status(500).json({msg: error.message})
        return
    }
})

router.get('/', (req, res) => {
    res.send({"quoth the server": 404})
})

function verifyToken(req, res, next) {
	const bearerHeader = req.headers['authorization']
    if(!bearerHeader){
        res.status(403).json({msg: "no token"})
        return
    }
    const token = bearerHeader.split(' ')[1]
    jwt.verify(token, "secretkey", (err, authData) => {
        if(err){
            console.log(err)
            res.status(403).json({msg: err})
            return
        }
        req.jwtdata = authData
        next()
    })
}



module.exports = router