import React from 'react'
import { useSelector} from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box'

const Totals = ({showbox}) => {
  const prices = useSelector(state => state.AddTickers.price)
  const tickerlist = useSelector(state => state.AddTickers.tickerlist)

  if(!showbox){
    return false
  }

  const getsummaries = (tickerlist, prices) => {
    let purchasevalue = 0
    let units = 0
    let currentprice = 0

    for(let t in tickerlist){
      if(tickerlist[t]['ticker'] === showbox.data.ticker){
        purchasevalue = purchasevalue + (Number(tickerlist[t]['amount']) * Number(tickerlist[t]['purchaseprice']))
        units = units + (Number(tickerlist[t]['amount']))
      }
    }

    for(let i in prices){
      if(prices[i]["ticker"] === showbox.data.ticker){
        currentprice = Number(prices[i]['price'])
        break
      }
    }
    return { "purchasevalue": purchasevalue, "units": units, "currentprice": currentprice}
  }

  const amounts = getsummaries(tickerlist, prices)
  return(
    <Box m={1}>
    {showbox.data.ticker}
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a list">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Total Units</TableCell>
                <TableCell>{amounts["units"]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Avg. Purchase Price</TableCell>
              <TableCell>${(amounts["purchasevalue"] / amounts["units"]).toFixed(3)}</TableCell>
              </TableRow>
            <TableRow>
              <TableCell>Total Value</TableCell>
              <TableCell>${(amounts["currentprice"] * amounts["units"]).toFixed(3)}</TableCell>
            </TableRow>
              <TableRow>
                <TableCell>Total Purchase Value</TableCell>
              <TableCell>${(amounts["purchasevalue"]).toFixed(3)}</TableCell>
              </TableRow>
              <TableRow>
              <TableCell>Gain</TableCell>
              <TableCell>${((amounts["currentprice"] * amounts["units"]) - amounts["purchasevalue"]).toFixed(3)}</TableCell>
            </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
  )
}

export default Totals