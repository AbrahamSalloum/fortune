import pymongo
from flask import Flask
import requests
import json
from flask_cors import CORS
from bson import json_util
import time
from flask import request, jsonify
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)

UPDATE_INTERVAL= 1200
key = "1234567890"


client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['fortunedb']

prices = db['prices']
news = db['news']
chart = db['chart']
summary = db['summary']
users = db['users']

app = Flask(__name__)

app.config['CORS_ORIGINS'] = ["http://10.1.1.11.xip.io:3000", "http://10.1.1.11:3000", "http://localhost:3000"]
app.config['CORS_SUPPORTS_CREDENTIALS'] = True
app.config['JWT_SECRET_KEY'] = 'super-secret'
app.config['CORS_EXPOSE_HEADERS'] = ['Authorization']
CORS(app)
jwt = JWTManager(app)

print(app.config)
headers = {
    "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
    "x-rapidapi-key": "acf79a894fmsh38e96e215939adfp1aef8ejsn8f574aa46ecf"
}

x = prices.create_index([("symbol", "text")], unique=True, language_override="en")
y = news.create_index([("symbol", "text")], unique=True, language_override="en")
z = summary.create_index([("symbol", "text")], unique=True, language_override="en")


@app.route('/storelogin', methods=['POST'])
def addlogin():
    global users
    content = request.get_json()
    isuser = users.find_one({"userid": content["userid"]})
    if isuser:
        pass
    else:
        content = users.insert(content)
    isuser = users.find_one({"userid": content["userid"]})
    return json_util.dumps(isuser)

@app.route('/auth', methods=['POST'])
def authtoken():
    content = request.get_json()
    print(content)
    isuser = users.find_one({"userid": content["userid"]})
    if isuser:
        access_token = create_access_token(identity=isuser["userid"])
        print(access_token)
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Bad username or password"}), 401


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
    global prices
    now = int(time.time())
    tickerlist_arr = tickerlist.split(',')
    s = {}
    notfound = []
    for ticker in tickerlist_arr:
        res = prices.find({'symbol': ticker, "nextupdate":{"$gt": now}})
        res = json.loads(json_util.dumps(res))
        if len(res) <= 0:
            notfound.append(ticker)
    if len(notfound) > 0:
        ftickers = ','.join(notfound)
        url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-quotes?region=US&lang=en&symbols={tickerlist}".format(tickerlist = ftickers)
        d = fetch(url)
        for t in d['quoteResponse']["result"]:
            t['nextupdate'] = now + UPDATE_INTERVAL
            up = prices.update({"symbol":t["symbol"]}, t, upsert=True)
    else:
        print("I GIVE YOU GOOD PRICE")
    res = prices.find({'symbol':{"$in":tickerlist_arr}})
    s['price'] = res
    return json.loads(json_util.dumps(s))



@app.route('/gettickerprices/<tickerlist>')
@jwt_required
def tickerrequest(tickerlist):
    print(request.headers)
    res = checkpricecollection(tickerlist)
    return res
#
@app.route('/gettickernews/<ticker>')
@jwt_required
def tickernews(ticker):
    url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/get-news?region=US&category={ticker}".format(ticker = ticker)
    res = checknewscollection(ticker, url)
    return res
#
@app.route('/getfetchchart/<interval>/<rnge>/<ticker>')
@jwt_required
def fetchchart(interval, rnge, ticker):
    url ="https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-spark?interval={interval}&range={rnge}&symbols={ticker}".format(interval = interval, rnge=rnge,ticker=ticker)
    res = checkchartcollection(interval, rnge, ticker, url)
    return res
#
@app.route('/gettickersummary/<ticker>')
@jwt_required
def tickersummary(ticker):
    url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?region=US&symbol={ticker}".format(ticker = ticker)
    res = checksummarycollection(ticker, url)
    return res
#
@app.route('/getlinedata/<line>')
@jwt_required
def getlinedata(line):
    url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-spark?interval=1wk&range=max&symbols={line}".format(line=line)
    res = checkchartcollection("1WK", "MAX", line, url)
    return res
#
@app.route('/')
def defaultroute():
    return "Quoth the Server 404"

