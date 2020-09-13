import React from 'react';
import { Link } from "react-router-dom"
import {fetchNews, fetchChart, fetchSummary} from '../redux/actions.js'
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import LiquidityBox from './details/liquidityBox';
import ProfitabilityBox from './details/ProfitabilityBox'
import TickerNewsBox from './details/TickerNewsBox'
import ValuationBox from './details/ValuationBox'
import FinSummaryBox from './details/FinSummaryBox'
import CompanyProfileBox from './details/CompanyProfileBox'
import CloseChartBox from './details/CloseChartBox'

const styles = {
  root: {
   
  },

  root1: {
   
  },

  cardroot: {
    
  },

  profilebox: {
    
  },

  statsbox: {
    minHieght: 250,
    color: "red"
  },

  box:{
    
  },

  boxnews: {  

  },

  title: {
    fontSize: 14,
  },

  Container: {
    
  }


}


const DetailsHeader = ({ticker}) => (
  <div>
    {ticker}
    <Link to="/">Go Back</Link>
  </div>
)


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
      <Container maxWidth="lg" className={classes.Container}>
        <DetailsHeader ticker={this.props.match.params.ticker} />
        <Grid container spacing={1} >
          <Grid container item xs={12} spacing={1}>
            <Grid item xs={6}>  
              <CloseChartBox classes={classes} getXaxis = {this.getXaxis} plotdata={this.props.plotdata} ticker={this.props.match.params.ticker}/>
            </Grid>
            <Grid item xs={6}>
              <CompanyProfileBox summary={this.props.summary} classes={classes}/>
            </Grid>  
          </Grid>
        <Grid container spacing={1} direction="row" justify="space-evenly" alignItems="center">  
          <FinSummaryBox classes={classes} stats={this.props.price} ticker={this.props.match.params.ticker} />
          <ValuationBox summary={this.props.summary} classes={classes} />
          <ProfitabilityBox summary={this.props.summary} classes={classes}/>
          <LiquidityBox summary={this.props.summary} classes={classes}/>
        </Grid>  
          <TickerNewsBox classes={classes} newslist={this.props.newslist} ticker={this.props.match.params.ticker} />
        </Grid>
      </Container>
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