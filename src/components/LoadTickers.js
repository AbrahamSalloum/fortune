import React, {useEffect, useState} from 'react'
import { Link } from "react-router-dom"
import {useSelector, useDispatch} from 'react-redux';
import {startsetTickers, dodelticker} from '../redux/actions.js'
import '../App.css'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
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
import Tooltip from '@material-ui/core/Tooltip';
import SimplePieChart from './loadTicker/tickerchart.js'
import SimpleLineChartfrom from './loadTicker/tickerlinechart.js'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PositionSummary from './loadTicker/PositionSummary';

const TickerItem = ({price, tickerlist, toggleshowbox, classes}) => {

  const RenderTicker = ({params}) => {
    return(
      <Tooltip title={params.data.additional.longName} aria-label="delete">
      <div>{params.value}</div>
      </Tooltip>
    )
  }


   let data = tickerlist.map((item) => {
      for(let j in price){
        if (price[j]['ticker'] === item['ticker']){
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
      <DataGrid
        disableMultipleSelection={true}
        rows={data} columns={columns}
        pageSize={10}
        autoHeight={true}
        autoPageSize={true}
        rowHeight={38}
        className={classes.root}
        onRowClick={(param) => {console.log(param); toggleshowbox(param)}}
      />
    </div>
  )
}

const ToggleBox = ({showbox, toggleshowbox}) => {

  const dispatch = useDispatch();
  if(!showbox){
    return false
  }
  return(
    <div style={{display: "flex"}}>
      <div style={{"marginLeft": "5px", "marginRight": "5px"}} >

        <Button
          variant="contained"
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={() => {dispatch(dodelticker(showbox.data.id)) ; toggleshowbox(false)}}
        >Delete ({showbox.data.ticker})</Button>
      </div>
      <div style={{"marginLeft": "5px", "marginRight": "5px"}}>
       <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
        >Edit</Button>
      </div>
      <div style={{"marginLeft": "5px", "marginRight": "5px"}}>
        <Button
          variant="contained"
          onClick={() => {toggleshowbox(false)}}
          startIcon={<CloseIcon />}
        >Close</Button>
      </div>
    </div>
  )
}

const DetailsHeader = ({ticker, header = "", istoggledrawer, toggleDrawer, classes, lastpriceupdate}) => (
    <AppBar position="static">
      <Toolbar>
      <div className={classes.navbar}>
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
      </div>
          <div >
          <Typography variant="caption" display="block">Last Updated: {Intl.DateTimeFormat('en', { hour: "numeric", minute: "numeric", hour12: true }).format(lastpriceupdate)}</Typography>
          <div><Typography variant="caption" display="block">Updates every 10 mins</Typography></div>
          </div>

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
  }
});

const LoadTickers = () => {
  const price = useSelector(state => state.AddTickers.price)
  const tickerlist = useSelector(state => state.AddTickers.tickerlist)
  const lastpriceupdate = useSelector(state => state.AddTickers.lastpriceupdate)
  const [showbox, toggleshowbox] = useState(false)
  const [showdrawer, toggleDrawerstate] = useState(false)
  const [tabValue, settabValue] = useState(0);
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    toggleDrawerstate(!showdrawer)
  }

  const handleChange = (event, tabValue) => {
    settabValue(tabValue);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(startsetTickers())
    }, 600000);
    return () => clearInterval(interval);
  }, []);


  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        style={{"minHeight":"300"}}
      >
        {value === index && (<Box p={3}><Typography component={'span'}>{children}</Typography></Box>)}
      </div>
    );
  }


  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const classes = useStyles();
  return(
    <Container>
      <Grid container spacing={2}>
        <Grid item container xs={12}>
          <Grid item xs={12}>
            <DetailsHeader ticker="Dashboard" istoggledrawer={showdrawer} toggleDrawer={toggleDrawer} classes={classes} lastpriceupdate={lastpriceupdate}/>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <SimplePieChart/>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Tabs value={tabValue} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="Item One" {...a11yProps(0)} />
            <Tab label="Item Two" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <SimpleLineChartfrom />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <PositionSummary />
          </TabPanel>
        </Grid>

        <Grid item container xs={12}>
          <Grid item xs={12} className={classes.root}>
          <Grid item xs={12} sm={4}>
          <ToggleBox showbox={showbox} toggleshowbox={toggleshowbox}/>
        </Grid>
             <TickerItem price={price} tickerlist={tickerlist} toggleshowbox={toggleshowbox} classes={classes}/>
          </Grid>
        </Grid>
        </Grid>
    </Container>
  )
}

export default LoadTickers


