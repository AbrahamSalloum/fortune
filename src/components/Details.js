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
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceSharpIcon from '@material-ui/icons/KeyboardBackspaceSharp';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const styles = {
  root: {

  },

  root1: {

  },

  cardroot: {

    display: 'flex',
    height: "100%"
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


const DetailsHeader = ({ticker, classes}) => (

  <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
        <Link to="/">
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <KeyboardBackspaceSharpIcon />
          </IconButton>
          </Link>
          <Typography variant="h6" className={classes.title}>
            Details
          </Typography>
          <Button color="inherit">{ticker}</Button>
        </Toolbar>
      </AppBar>
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
    while (!this.props.summary.length) {
      return "loading..."
    }

    return(
      <Container maxWidth="lg" className={classes.Container}>
        <DetailsHeader classes={classes} ticker={this.props.match.params.ticker} />
        <Grid container spacing={2} alignItems="stretch">
          <Grid container item item xs={12} spacing={2} alignItems="stretch">
            <Grid item xs={12} sm={6}>
              <CloseChartBox classes={classes} getXaxis = {this.getXaxis} plotdata={this.props.plotdata} ticker={this.props.match.params.ticker}/>
            </Grid>
            <Grid xs={12} sm={6}>
              <CompanyProfileBox summary={this.props.summary} classes={classes}/>
            </Grid>
          </Grid>
          <Grid xs={12} container spacing={2} direction="row" justify="space-evenly" alignItems="stretch">
            <Grid xs={12} sm={3}>
              <FinSummaryBox classes={classes} stats={this.props.price} ticker={this.props.match.params.ticker} />
            </Grid>
            <Grid xs={12} sm={3}>
              <ValuationBox summary={this.props.summary} classes={classes} />
            </Grid>
            <Grid xs={12} sm={3}>
              <ProfitabilityBox summary={this.props.summary} classes={classes}/>
            </Grid>
            <Grid xs={12} sm={3}>
              <LiquidityBox summary={this.props.summary} classes={classes}/>
            </Grid>
          </Grid>
          <Grid xs={12} container spacing={2} alignItems="stretch">
            <TickerNewsBox classes={classes} newslist={this.props.newslist} ticker={this.props.match.params.ticker} />
        </Grid>

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