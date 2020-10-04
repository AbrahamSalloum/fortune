import React from 'react'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const PositionSummary = ({price, tickerlist}) => {
  
  const CurrentValue = () => {
    let curr = 0
    for(let ticker in tickerlist){
      for(let p in price){
        if(tickerlist[ticker]["ticker"] === price[p]['ticker']){
          curr += price[p]['price'] * tickerlist[ticker]['amount']
        }
      }  
    }
    return curr
  }

  const pchasevalue = tickerlist.reduce((acc, a) => {return acc + a.amount*a.purchaseprice}, 0)

  return(
    <Box m={1}>
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
              <TableCell>Total</TableCell>
              <TableCell>${CurrentValue()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Purchase Value</TableCell>
              <TableCell>${pchasevalue}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gain</TableCell>
              <TableCell>{Math.round((pchasevalue-CurrentValue()/pchasevalue)*100 * 1000)/1000}% (${pchasevalue-CurrentValue()})</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default PositionSummary
