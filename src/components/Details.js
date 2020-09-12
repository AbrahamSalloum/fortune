import React from 'react';
import { Link } from "react-router-dom"
import pRetry from 'p-retry'
import {fetchNews, fetchChart, fetchSummary} from '../redux/actions.js'
import { connect } from 'react-redux';
import { render } from '@testing-library/react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import moment from 'moment';

import { withStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = {
  root: {
    flexGrow: 1,
    width: "90%"
   
  },

  box:{
    boxShadow: '0 1px 1px 1px',
    height: "400px",
    overflow: "auto"
  },

  boxnews: {
    boxShadow: '0 1px 1px 1px',
    height: "400px",
    overflow: "auto"
  }

}



const NewsItems = ({title, link, summary, publisher, key}) => (
  <TableRow key={key}>
  <TableCell>{publisher}</TableCell>
  <TableCell><a href={link}>{title}</a></TableCell>
  <TableCell>{summary.slice(0, 150)}...</TableCell>
  </TableRow>
)

const TickerNews = ({newslist, ticker}) => (
  <div className="wrapper-article-content">
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell>publisher</TableCell>  
          <TableCell>title</TableCell>
          <TableCell>Summary</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        
    {
    newslist.map((i) => {
      if(i.ticker === ticker){
        const newsl = i.news
        return newsl.map(n => <NewsItems {...n}/>) 
      }
    })
  }
  </TableBody>
  </Table>
  </TableContainer>
</div>
)

const arrangedata = (plotdata, ticker) => {
  const data = []
  while(plotdata.length === 0){
    return []
  }
    for(let i in plotdata[0][ticker]["timestamp"]){
      let t = moment.unix(plotdata[0][ticker]["timestamp"][i]) 
      let o = { timestamp: t.format("DD/MM/YY hh:mm"), close: plotdata[0][ticker]["close"][i]}
      data.push(o)
    }
  return data
}

const CloseChart = ({plotdata, ticker, getXaxis}) => (
  <div>
  <LineChart  width={600} height={300} data={arrangedata(plotdata, ticker)}>
    <XAxis dataKey="timestamp"  angle={5} interval="preserveStartEnd"/>
    <YAxis domain={['auto', 'auto']}/>
    <Tooltip/>
    <CartesianGrid strokeDasharray="3 3"/>
    <Line type="monotone" dataKey="close" stroke="#8884d8" activeDot={{r: 8}}/>
    
  </LineChart>
  <ButtonGroup color="primary" aria-label="outlined primary Button group">
    <Button onClick={() => {getXaxis("1d", ticker)}}>1 day</Button>
    <Button onClick={() => {getXaxis("5d", ticker)}}>5 day</Button>
    <Button onClick={() => {getXaxis("3mo", ticker)}}>3 Month</Button>
    <Button onClick={() => {getXaxis("6mo", ticker)}}>6 Month</Button>
    <Button onClick={() => {getXaxis("1y", ticker)}}>1 year</Button>
    <Button onClick={() => {getXaxis("5y", ticker)}}>5 year</Button>
    <Button onClick={() => {getXaxis("max", ticker)}}>Max</Button>
   </ButtonGroup> 
  </div>
)

const DetailsHeader = ({ticker}) => (
  <div>
    {ticker}
    <Link to="/">Go Back</Link>
  </div>
)

const Summary = ({item}) => (
  <div>
    <div>
      <span>Day Open: </span>
      <span>{item.dayopen}</span>
    </div>
    <div>
      <span>Day Close: </span>
      <span>{item.dayclose}</span>
    </div>
    <div>
      <span>Day High: </span>
      <span>{item.dayhigh}</span>
    </div>
    <div>
      <span>Day Change: </span>
      <span>{item.daychange}</span>
    </div>
    
  </div>
)

const FinSummary = ({stats, ticker}) => (
  <div>
  Stats
  {
    stats.map((s) => {
      if(s.ticker === ticker){
        return <Summary key={s.ticker} item={s} />
      }
      return false
    })
  }
  </div>
)

const Profile = (summary) => {

  while(!summary["summary"].length){
    return "loading..." 
  }

  return (

    <div>
        {
          summary["summary"][0]["summaryProfile"]['longBusinessSummary'] 
        }
      </div>
  )

}

const ValuationBox = (summary) => {

  while(!summary["summary"].length){
    return "loading..." 
  }

  return (
    <div className="val-box">
      <span>trailing PE:{summary["summary"][0]["summaryDetail"]["trailingPE"]["fmt"]}</span>
      <span>pegRatio:{summary["summary"][0]["defaultKeyStatistics"]["pegRatio"]["fmt"]}</span>
      <span>priceToBook:{summary["summary"][0]["defaultKeyStatistics"]["priceToBook"]["fmt"]}</span> 
      <span>priceToSalesTrailing12Months:{summary["summary"][0]["defaultKeyStatistics"]["priceToSalesTrailing12Months"]["fmt"]}</span>
      <span>dividendYield:{summary["summary"][0]["summaryDetail"]["dividendYield"]["fmt"]}</span>
      <span>payoutRatio:{summary["summary"][0]["summaryDetail"]["payoutRatio"]["fmt"]}</span>
    </div>
  )

}

const Profitability = (summary) => {
  while(!summary["summary"].length){
    return "loading..." 
  }

  return(
    <div className="val-box">
      <span>returnOnEquity: {summary["summary"][0]["financialData"]["returnOnEquity"]["fmt"]}</span>
      <span>returnOnAssets: {summary["summary"][0]["financialData"]["returnOnAssets"]["fmt"]}</span>
      <span>profitMargins: {summary["summary"][0]["financialData"]["profitMargins"]["fmt"]}</span>
      <span>grossMargins: {summary["summary"][0]["financialData"]["grossMargins"]["fmt"]}</span>
    </div>
  ) 
}

const Liquidity = (summary) => {

  while(!summary["summary"].length){
    return "loading..." 
  }

  return(
    <div className="val-box Liquidity">
      <span>currentRatio: {summary["summary"][0]["financialData"]["currentRatio"]["fmt"]}</span>
      <span>quickRatio: {summary["summary"][0]["financialData"]["quickRatio"]["fmt"]}</span>
      <span>debtToEquity: {summary["summary"][0]["financialData"]["debtToEquity"]["fmt"]}</span>
    </div>
  ) 
}


class Details extends React.Component {
 
  componentDidMount(){
    this.props.getnews(this.props.match.params.ticker)
    this.props.getchart("1d", this.props.match.params.ticker)
    this.props.getsummary(this.props.match.params.ticker)
  }
  c
  getXaxis = (time, ticker) => {
    this.props.getchart(time, ticker)
  }
  
  render(){
    const { classes } = this.props;
    return(
    <div className={classes.root}>
    <DetailsHeader ticker={this.props.match.params.ticker} />
      <Grid container spacing={3}>
        <Grid item xs={6} className={classes.box}>
          <CloseChart getXaxis = {this.getXaxis} plotdata={this.props.plotdata} ticker={this.props.match.params.ticker}/>
        </Grid>
        <Grid item xs={3} className={classes.box}>
        <Profile summary={this.props.summary} />
        </Grid> 
        <Grid item xs={3} className={classes.box}>
          <FinSummary stats={this.props.price} ticker={this.props.match.params.ticker} />
        </Grid> 
        <Grid item xs={6} className={classes.boxnews}>
          <TickerNews newslist={this.props.newslist} ticker={this.props.match.params.ticker} />
        </Grid>
        <Grid item xs={3} className={classes.boxnews}>
          <ValuationBox summary={this.props.summary} />
        </Grid>  
        <Grid item xs={3} className={classes.boxnews}>
          <Profitability summary={this.props.summary} />
          <Grid>
            <Liquidity summary={this.props.summary} />
          </Grid>
          </Grid>
      </Grid>  
    </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    tickerlist: state.AddTickers.tickerlist,
    price: state.AddTickers.price,
    uid: state.AddTickers.uid,
    newslist: state.AddTickers.news,
    plotdata: state.AddTickers.plotdata,
    summary: state.AddTickers.summary
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    getnews: (ticker) => dispatch(fetchNews(ticker)),
    getchart: (range, ticker) => dispatch(fetchChart(range,ticker)),
    getsummary: (ticker) => dispatch(fetchSummary(ticker))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Details))