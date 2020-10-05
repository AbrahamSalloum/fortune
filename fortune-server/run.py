import pymongo
from flask import Flask
import requests
import json
from flask_cors import CORS
from bson import json_util
import time


client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['fortunedb']
prices = db['prices']
news = db['news']
chart = db['chart']
summary = db['summary']
app = Flask(__name__)
CORS(app)


headers = {
    "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
    "x-rapidapi-key": "acf79a894fmsh38e96e215939adfp1aef8ejsn8f574aa46ecf"
}

x = prices.create_index([("symbol", "text")], unique=True, language_override="en")
y = news.create_index([("symbol", "text")], unique=True, language_override="en")
z = summary.create_index([("symbol", "text")], unique=True, language_override="en")

def fetch(url):
    r = requests.get(url, headers=headers)
    return json.loads(r.text)

def checknewscollection(ticker, url):
    global news
    res = news.find_one({"ticker": ticker})
    if res is None:
        recnews = fetch(url)
        recnews['ticker'] = ticker
        recnews['lastupdate'] = time.time()
        news.insert_one(recnews)
        res = news.find_one({"ticker": ticker})
    return json.loads(json_util.dumps(res))

def checksummarycollection(ticker, url):
    global summary
    res = summary.find_one({'symbol': ticker})
    if res is None:
        recsummary = fetch(url)
        recsummary['lastupdate'] = time.time()
        summary.insert_one(recsummary)
        res = summary.find_one({"symbol": ticker})
    return json.loads(json_util.dumps(res))

def checkchartcollection(interval, rnge, ticker, url):
    global chart
    rticker = ticker.replace('.', '-')
    o = {}
    p = {}
    params = {}
    params[rticker+".symbol"] = ticker
    params[rticker+".range"] = rnge
    params[rticker+".interval"] = interval
    res = chart.find_one(params)
    if res is None:
        chartsummary = fetch(url)
        chartsummary[ticker]['range'] = rnge
        chartsummary[ticker]['interval'] = interval
        chartsummary[ticker]['lastupdate'] = time.time()
        o[rticker] = chartsummary[ticker]
        s = chart.insert_one(o)     
        res = chart.find_one(params)
    p[ticker] = res[rticker]    
    return json.loads(json_util.dumps(p))

def checkpricecollection(tickerlist):
    tickerlist_arr = tickerlist.split(',')
    s = {}
    notfound = []
    global prices
    for ticker in tickerlist_arr:
        res = prices.find_one({'symbol': ticker})
        if res is None:
            notfound.append(ticker)
    if len(notfound) > 0: 
        ftickers = ','.join(notfound)
        url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-quotes?region=US&lang=en&symbols={tickerlist}".format(tickerlist = ftickers)
        d = fetch(url)
        for t in d['quoteResponse']["result"]:
            t["lastupdate"] = time.time()
        prices.insert_many(d['quoteResponse']["result"])
    res = prices.find({'symbol':{"$in":tickerlist_arr}})
    s['price'] = res
    return json.loads(json_util.dumps(s))
#
#
#
@app.route('/gettickerprices/<tickerlist>')
def tickerrequest(tickerlist):
    res = checkpricecollection(tickerlist)
    return res
#
@app.route('/gettickernews/<ticker>')
def tickernews(ticker):
    url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/get-news?region=US&category={ticker}".format(ticker = ticker)
    res = checknewscollection(ticker, url)
    return res 
#
@app.route('/getfetchchart/<interval>/<rnge>/<ticker>')
def fetchchart(interval, rnge, ticker):
    url ="https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-spark?interval={interval}&range={rnge}&symbols={ticker}".format(interval = interval, rnge=rnge,ticker=ticker)
    res = checkchartcollection(interval, rnge, ticker, url)
    return res 
#
@app.route('/gettickersummary/<ticker>')
def tickersummary(ticker):
    url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?region=US&symbol={ticker}".format(ticker = ticker)
    res = checksummarycollection(ticker, url)
    return res 
#
@app.route('/getlinedata/<line>')
def getlinedata(line):
    url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-spark?interval=1wk&range=max&symbols={line}".format(line=line)
    res = checkchartcollection("1WK", "MAX", line, url)
    return res
#
@app.route('/')
def defaultroute():
    return "Quoth the Server 404"    