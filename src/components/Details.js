import React, {useEffect} from 'react';
import { Link, useParams } from "react-router-dom"
import {fetchSummary} from '../redux/actions.js'
import { useDispatch, useSelector } from 'react-redux';
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
)


const Details = () => {
  
  const classes = useStyles();
  const dispatch = useDispatch();
  const {ticker} = useParams(); 
  
  useEffect(() => dispatch(fetchSummary(ticker)), []); 
  const summary= useSelector(state => state.AddTickers.summary)
 
  
    
  if (!summary.length) {
      return ("loading...")
  }

    
    
    return(
      <Container maxWidth="lg">
        <Grid container spacing={2} justify="space-evenly" className={classes.summaryrow}>
          <Grid item container spacing={2}>
            <Grid item xs={12}>
              <DetailsHeader ticker={ticker} header="Details" />
            </Grid>
          </Grid>
          <Grid item container spacing={2} >
            <Grid item xs={12} sm={6}>
              <CloseChartBox ticker={ticker}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CompanyProfileBox/>
            </Grid>
          </Grid>
          <Grid item container spacing={2}>
            <Grid item xs={12} sm={3}>
              <ValuationBox/>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FinSummaryBox ticker={ticker}/>
            </Grid>
            <Grid item xs={12} sm={3}>
              <ProfitabilityBox/>
            </Grid>
            <Grid item xs={12} sm={3}>
              <LiquidityBox />
            </Grid>
          </Grid>
          <Grid item container spacing={2}>
            <Grid item xs={12}>
              <TickerNewsBox ticker={ticker} />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    )
  }

export default Details