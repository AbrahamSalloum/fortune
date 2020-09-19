import React, {useState, useEffect} from 'react';
import { Link, useParams } from "react-router-dom"
import {fetchNews, fetchChart, fetchSummary} from '../redux/actions.js'
import { connect, useDispatch, useSelector } from 'react-redux';
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
import { makeStyles } from '@material-ui/core/styles';

const styles = {}

const useStyles = makeStyles({
  root: {

  }
})
const DetailsHeader = ({ticker}) => (

  <div>
      <AppBar position="static">
        <Toolbar>
        <Link to="/">
          <IconButton edge="start" color="inherit" aria-label="menu">
            <KeyboardBackspaceSharpIcon />
          </IconButton>
          </Link>
          <Typography variant="h6">
            Details
          </Typography>
          <Button color="inherit">{ticker}</Button>
        </Toolbar>
      </AppBar>
    </div>
)


const Details = () => {
  
  const classes = useStyles();
  const dispatch = useDispatch();
  const price = useSelector(state => state.AddTickers.price)
  const newslist= useSelector(state => state.AddTickers.news)
  const plotdata= useSelector(state => state.AddTickers.plotdata)
  const summary= useSelector(state => state.AddTickers.summary)
  const {ticker} = useParams(); 
 
  useEffect(() => dispatch(fetchNews(ticker)), []);
  useEffect(() => dispatch(fetchChart("1d",ticker)), []);
  useEffect(() => dispatch(fetchSummary(ticker)), []);  

  const getXaxis = (time,ticker) => {
    dispatch(fetchChart(time,ticker))
  }
  
    
  if (!summary.length) {
      return ("loading...")
  }

    
    
    return(
      
      <Container maxWidth="lg">
        <Grid container spacing={2} justify="space-evenly" className={classes.summaryrow}>
          <Grid item container spacing={2}>
            <Grid item xs={12}>
              <DetailsHeader ticker={ticker} />
            </Grid>
          </Grid>
          <Grid item container spacing={2} >
            <Grid item xs={12} sm={6}>
              <CloseChartBox getXaxis={getXaxis} plotdata={plotdata} ticker={ticker}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CompanyProfileBox summary={summary} />
            </Grid>
          </Grid>
          <Grid item container spacing={2}>
            <Grid item xs={12} sm={3}>
              <ValuationBox summary={summary} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FinSummaryBox  stats={price} ticker={ticker} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <ProfitabilityBox summary={summary} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <LiquidityBox summary={summary} />
            </Grid>
          </Grid>
          <Grid item container spacing={2}>
            <Grid item xs={12}>
              <TickerNewsBox newslist={newslist} ticker={ticker} />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    )
  }

export default Details