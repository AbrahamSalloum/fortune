import pymongo
from flask import Flask
import requests
import json
from flask_cors import CORS
from bson import json_util

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

def fetch(url):
    r = requests.get(url, headers=headers)
    return json.loads(r.text)



def checknewscollection(ticker, url):
    global news
    res = news.find_one({"ticker": ticker})
    if res is None:
        recnews = fetch(url)
        recnews['ticker'] = ticker
        news.insert_one(recnews)
        res = news.find_one({"ticker": ticker})
    else:
        print("NO FETCH NEWS")
    return json.loads(json_util.dumps(res))

def checksummarycollection(ticker, url):
    global summary
    res = summary.find_one({'symbol': ticker})
    if res is None:
        recsummary = fetch(url)
        summary.insert_one(recsummary)
        res = summary.find_one({"symbol": ticker})
    else:
        print("NO FETCH SUMMARY")
    return json.loads(json_util.dumps(res))    

def checkchartcollection(interval, rnge, ticker, url):
    print(interval, rnge, ticker)
    rticker = ticker.replace('.', '-')
    o = {}
    global chart
    params = {}
    params[rticker+".symbol"] = ticker
    params[rticker+".range"] = rnge
    params[rticker+".interval"] = interval
    res = chart.find_one(params)
    print(res)
    if res is None:
        print(url)
        chartsummary = fetch(url)
        chartsummary[ticker]['range'] = rnge
        chartsummary[ticker]['interval'] = interval
        o[rticker] = chartsummary[ticker]
        s = chart.insert_one(o)      
        print(s)
        res = chart.find_one(params)
    else:
        print("NO FETCH CHART")
    return json.loads(json_util.dumps(res))

@app.route('/gettickerprices/<tickerlist>')
def tickerrequest(tickerlist):
    url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-quotes?region=US&lang=en&symbols={tickerlist}".format(tickerlist = tickerlist)
    return fetch(url)

@app.route('/gettickernews/<ticker>')
def tickernews(ticker):
    url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/get-news?region=US&category={ticker}".format(ticker = ticker)
    res = checknewscollection(ticker, url)
    return res 

@app.route('/getfetchchart/<interval>/<rnge>/<ticker>')
def fetchchart(interval, rnge, ticker):
    url ="https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-spark?interval={interval}&range={rnge}&symbols={ticker}".format(interval = interval, rnge=rnge,ticker=ticker)
    res = checkchartcollection(interval, rnge, ticker, url)
    return res 


@app.route('/gettickersummary/<ticker>')
def tickersummary(ticker):
    url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?region=US&symbol={ticker}".format(ticker = ticker)
    res = checksummarycollection(ticker, url)
    return res 

@app.route('/getlinedata/<line>')
def getlinedata(line):
    url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-spark?interval=1wk&range=max&symbols={line}".format(line=line)
    return fetch(url) 

@app.route('/')
def defaultroute():
    return "NO!"    
