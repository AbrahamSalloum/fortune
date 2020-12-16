import React, {useEffect, useState} from 'react'
import { Link } from "react-router-dom"
import {useSelector, useDispatch} from 'react-redux';
import { startsetTickers, SignOut} from '../redux/actions.js'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import '../App.css'

import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';

import Add from './Add.js'
import TabbedInfo from './loadTicker/TabbedInfo'
import TickerItem from './loadTicker/TickerItem.js'
import ToggleBox from './loadTicker/ToggleBox.js'
import PositionSummary from './loadTicker/PositionSummary';
import Totals from './loadTicker/Totals'


const DetailsHeader = ({ ticker, header = "", istoggledrawer, toggleDrawer, classes, lastpriceupdate, username, SignOut}) => (
  <AppBar position="static">
    <Toolbar>
    <div className={classes.navbar}>
      <React.Fragment key={'top'}>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={()=>{toggleDrawer()}}><AddBoxIcon /></IconButton>
        <Drawer anchor={'top'} open={istoggledrawer} onClose={()=>{toggleDrawer()}}><Add /></Drawer>
      </React.Fragment>
      <Link to="/add"></Link>
      <Typography variant="h6">{header}</Typography>
      <Button color="inherit">{ticker}</Button>
    </div>
    <div >
      <Typography variant="caption" display="block">{username}</Typography>
    </div>
    <Typography variant="caption" display="block"><Button onClick={() => {SignOut()}}>Sign Out</Button></Typography>
    </Toolbar>
  </AppBar>
)

const useStyles = makeStyles({
  root: {
    '& .daychange.negative': {
      color: '#ef3f5b',
    },
    '& .daychange.positive': {
      color: '#139313',
    },

    '& .MuiDataGrid-columnsContainer': {
      fontWeight: "900",
      "font-weight": "900",
      color: "black"
    }
  },

  navbar: {
    display: "flex",
    flexGrow: 1
  },

});

const LoadTickers = () => {
  const price = useSelector(state => state.AddTickers.price)
  const tickerlist = useSelector(state => state.AddTickers.tickerlist)
  const uid = useSelector(state => state.AddTickers.uid)
  const lastpriceupdate = useSelector(state => state.AddTickers.lastpriceupdate)
  const username = useSelector(state => state.firebase.auth.email)
  const [showbox, toggleshowbox] = useState(false)
  const [showdrawer, toggleDrawerstate] = useState(false)

  const dispatch = useDispatch();

  const toggleDrawer = () => {
    toggleDrawerstate(!showdrawer)
  }

  const Signout = () => {
    dispatch(SignOut())
  }

  useEffect(() => {
    dispatch(startsetTickers())
    const interval = setInterval(() => {
      dispatch(startsetTickers())
    }, 600000);
    return () => clearInterval(interval);
  }, [uid]);

  const classes = useStyles();

  return(
    <Container>
      <Grid container spacing={2}>
        <Grid item container xs={12}>
          <Grid item xs={12}>
            <DetailsHeader ticker="Dashboard" istoggledrawer={showdrawer} toggleDrawer={toggleDrawer} classes={classes} lastpriceupdate={lastpriceupdate} username={username} SignOut={Signout}/>
          </Grid>
        </Grid>
        <Grid item container xs={12} sm={4}>
          <Grid item  xs={12}>
            <PositionSummary price={price} tickerlist={tickerlist}/>
          </Grid>
          <Grid item  xs={12}>
          <Totals showbox={showbox}/>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={8}>
          <TabbedInfo />
        </Grid>
        <Grid item container xs={12}>
          <Grid item xs={12} className={classes.root}>
          <Grid item xs={12} sm={4}>
          <ToggleBox showbox={showbox} toggleshowbox={toggleshowbox}/>
        </Grid>
             <TickerItem price={price} tickerlist={tickerlist} toggleshowbox={toggleshowbox} classes={classes} />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default LoadTickers