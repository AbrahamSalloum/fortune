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

UPDATE_INTERVAL= 1200


headers = {
    "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
    "x-rapidapi-key": "acf79a894fmsh38e96e215939adfp1aef8ejsn8f574aa46ecf"
}

x = prices.create_index([("symbol", "text")], unique=True, language_override="en")
y = news.create_index([("symbol", "text")], unique=True, language_override="en")
z = summary.create_index([("symbol", "text")], unique=True, language_override="en")

def fetch(url):
    print('fetch...', url)
    r = requests.get(url, headers=headers)
    return json.loads(r.text)



def checknewscollection(ticker, url):
    global news
    now = int(time.time())
    res = news.find({"ticker":ticker, "nextupdate":{"$gt": now}})
    res = json.loads(json_util.dumps(res))
    if len(res) <= 0:
        recnews = fetch(url)
        recnews['ticker'] = ticker
        recnews['nextupdate'] = now + int(UPDATE_INTERVAL)
        update = news.update({"ticker": ticker}, recnews,  upsert=True)
        res = news.find({"ticker": ticker})
    else:
        print("NO NEWS IS GOOD NEWS")
    return json_util.dumps(res)


def checksummarycollection(ticker, url):
    global summary
    now = int(time.time())
    res = summary.find({"symbol":ticker, "nextupdate":{"$gt": now}})
    res = json.loads(json_util.dumps(res))
    if len(res) <= 0:
        recsummary = fetch(url)
        recsummary['nextupdate'] = time.time() + UPDATE_INTERVAL
        update = summary.update({"symbol": ticker}, recsummary,  upsert=True)
        res = summary.find({"symbol": ticker})
    else:
        print("NO NEW SUMMARY")
    return json_util.dumps(res)


def checkchartcollection(interval, rnge, ticker, url):
    global chart
    rticker = ticker.replace('.', '-')
    now = int(time.time())
    o = {}
    p = {}
    params = {}
    params[rticker+".symbol"] = ticker
    params[rticker+".range"] = rnge
    params[rticker+".interval"] = interval
    params[rticker+".nextupdate"] = {"$gt": now}
    res = chart.find(params)
    res = json.loads(json_util.dumps(res))
    if len(res) <= 0:
        chartsummary = fetch(url)
        chartsummary[ticker]['range'] = rnge
        chartsummary[ticker]['interval'] = interval
        chartsummary[ticker]['nextupdate'] = now + UPDATE_INTERVAL
        o[rticker] = chartsummary[ticker]
        update = chart.update({rticker+".symbol": ticker}, o, upsert=True)
        res = chart.find({rticker+".symbol": ticker})
        res = json.loads(json_util.dumps(res))
    else:
        print("MMMM pie...")
    p[ticker] = res[0][rticker]
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
            t['nextupdate'] = time.time() + UPDATE_INTERVAL
        prices.insert_many(d['quoteResponse']["result"])
    res = prices.find({'symbol':{"$in":tickerlist_arr}})
    s['price'] = res
    return json.loads(json_util.dumps(s))

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