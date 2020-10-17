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
    let a = 0
    let d = 0
    let p = 0

    for(let t in tickerlist){
      if(tickerlist[t]['ticker'] === showbox.data.ticker){
        a = a + (Number(tickerlist[t]['amount']) * Number(tickerlist[t]['purchaseprice']))
        d = d + (Number(tickerlist[t]['amount']))
      }
    }

    for(let i in prices){
      if(prices[i]["ticker"] === showbox.data.ticker){
        p = Number(prices[i]['price'])
        break
      }
    }
    return [a,d,p]
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
                <TableCell>{amounts[1]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Avg. Purchase Price</TableCell>
                <TableCell>${amounts[0]/amounts[1]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Value</TableCell>
                <TableCell>${amounts[0]}</TableCell>
              </TableRow>
              <TableRow>
              <TableCell>Gain</TableCell>
              <TableCell>${amounts[2]*amounts[1] - amounts[0]}</TableCell>
            </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
  )
}

export default Totals