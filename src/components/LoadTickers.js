import React, {useEffect} from 'react'
import { Link } from "react-router-dom"
import {useSelector, useDispatch} from 'react-redux';
import {dodelticker, toggledraw, startsetTickers} from '../redux/actions.js'
import '../App.css'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import clsx from 'clsx'

import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Add from './Add.js'
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import { googleAuthProvider } from '../firebase/firebase.js';
import Tooltip from '@material-ui/core/Tooltip';



const TickerItem = ({price, tickerlist}) => {

  const RenderTicker = ({params}) => {
    return(
      <Tooltip title={params.data.additional.longName} aria-label="delete">
      <div>{params.value}</div>
      </Tooltip>
    )
  }
  
  
   let data = tickerlist.map((item) => {
      for(let j in price){
        if (price[j]['ticker'] == item['ticker']){
          return {...price[j], ...item}
        }
      }
  })
  data = data.filter(i => i !== undefined);


  const columns = [
    { field: 'ticker', headerName: 'Ticker', width: 150, renderCell: (params) => <RenderTicker params={params} />},
    { field: 'amount', headerName: 'Units' , width: 100, },
    { field: 'price', headerName: 'Price' , width: 100},
    { field: 'dayopen', headerName: 'Day Open' ,width: 100},
    { field: 'dayclose', headerName: 'Day Close' ,width: 100},
    { field: 'dayhigh', headerName: 'Day High' , width: 100},
    { field: 'daylow', headerName: 'Day Low' , width: 100},
    { field: 'volume', headerName: 'Volume' , width: 100},
    { field: 'daychange', headerName: 'Day Change',  type: 'number', width: 130, cellClassName: (params) => clsx('daychange', {
      negative: params.value < 0,
      positive: params.value > 0,
    })},
    {field: 'details', headerName: 'Details',  width: 100 ,renderCell: (params) => <Link to={`/details/${params.getValue('ticker')}`}>Details</Link> }
  ]
  
  return(
    <div style={{ height: 400, width: '100%' }}>
    <DataGrid rows={data} columns={columns} pageSize={10} autoHeight={true} autoPageSize={true} rowHeight={38} />
    </div>
    )
}

const DetailsHeader = ({ticker, header = "", istoggledrawer, toggleDrawer}) => (
    <AppBar position="static">
      <Toolbar>
      <React.Fragment key={'top'}>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={()=>{toggleDrawer()}}>
      <AddBoxIcon />
    </IconButton>
      <Drawer anchor={'top'} open={istoggledrawer} onClose={()=>{toggleDrawer()}}>
        <Add />
      </Drawer>
    </React.Fragment>
        <Link to="/add">
          
        </Link>
        <Typography variant="h6">
          {header}
        </Typography>
        <Button color="inherit">{ticker}</Button>
      </Toolbar>
    </AppBar>
)    

const useStyles = makeStyles({
  root: {
    '& .daychange.negative': {
      backgroundColor: '#d47483',
    },
    '& .daychange.positive': {
      backgroundColor: 'rgba(157, 255, 118, 0.49)',
      

    },
  },
});

const LoadTickers = () => {
  const price = useSelector(state => state.AddTickers.price)
  const tickerlist = useSelector(state => state.AddTickers.tickerlist)
  const uid = useSelector(state => state.AddTickers.uid)

  const istoggledrawer = useSelector(state => state.AddTickers.toggledrawer)
  
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    dispatch(toggledraw())
  }

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(startsetTickers())
      console.log('dd')
    }, 600000);

    return () => clearInterval(interval);
  });

  const classes = useStyles();
  return(
    <Container>
      <Grid container spacing={2}>
        <Grid item container xs={12}>
          <Grid item xs={12}>
            <DetailsHeader ticker="Dashboard" istoggledrawer={istoggledrawer} toggleDrawer={toggleDrawer}/>
          </Grid>          
        </Grid>
        <Grid item container xs={12}>
          <Grid item xs={12} className={classes.root}>
          
             <TickerItem price={price} tickerlist={tickerlist} />
          </Grid> 
       </Grid> 
    </Grid> 
  </Container>
  )
}

export default LoadTickers