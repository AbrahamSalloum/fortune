import React from 'react'
import { Link } from "react-router-dom"
import {useSelector, useDispatch} from 'react-redux';
import {dodelticker, startsetTickers} from '../redux/actions.js'

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


const TickerItem = 
  (
  {price = 0,units = 0,ticker = "NA",dayopen = 0,dayclose = 0,dayhigh = 0,daylow = 0,volume = 0,daychange = 0,additional = 0,id}
  ) => {
  const dispatch = useDispatch();  
  return(
    <TableRow>
      <TableCell>{ticker} ({additional.longName})</TableCell>
      <TableCell>{units}</TableCell>
      <TableCell>{price}</TableCell>
      <TableCell>{dayopen}</TableCell>
      <TableCell>{dayclose}</TableCell>
      <TableCell>{dayhigh}</TableCell>
      <TableCell>{daylow}</TableCell>
      <TableCell>{volume}</TableCell>
      <TableCell>{daychange}%</TableCell>
      <TableCell><Link to={`/details/${ticker}`}>Details ({ticker})</Link></TableCell>
      <TableCell><button onClick={()=>{dispatch(dodelticker(id))} }>Delete</button></TableCell>
    </TableRow>
  )
}

const DetailsHeader = ({ticker, header = ""}) => (
    <AppBar position="static">
      <Toolbar>
        <Link to="/add">
          <IconButton edge="start" color="inherit" aria-label="menu">
            <AddBoxIcon />
          </IconButton>
        </Link>
        <Typography variant="h6">
          {header}
        </Typography>
        <Button color="inherit">{ticker}</Button>
      </Toolbar>
    </AppBar>
)    


const LoadTickers = () => {
  const price = useSelector(state => state.AddTickers.price)
  const tickerlist = useSelector(state => state.AddTickers.tickerlist)
  const uid = useSelector(state => state.AddTickers.uid)
  const dispatch = useDispatch();
  
  return(
    <Container>
      <Grid container spacing={2}>
        <Grid item container xs={12}>
          <Grid item xs={12}>
            <DetailsHeader ticker="Dashboard" />
          </Grid>          
        </Grid>
        <Grid item container xs={12}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Units</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Day Open</TableCell>
                    <TableCell>Day Close</TableCell>
                    <TableCell>Day High</TableCell>
                    <TableCell>Day Low</TableCell>
                    <TableCell>Volume</TableCell>
                    <TableCell>Day Change</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    tickerlist.map((item) => {
                      for(let z in price){
                        if(price[z]['ticker'] === item.ticker.toUpperCase()){  
                          return <TickerItem key={item.id} {...price[z]} id={item.id}/>
                        }
                      }
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Grid> 
       </Grid> 
    </Grid> 
  </Container>
  )
}

export default LoadTickers