import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {useSelector} from 'react-redux';


const NewsItems = ({ticker, amount, purchaseprice, pprce}) => {
  return (
    <TableRow>
      <TableCell>{ticker}</TableCell>
      <TableCell>{amount}</TableCell>
      <TableCell>{purchaseprice}</TableCell>
      <TableCell>{new Date(pprce * 1000).toLocaleDateString('en-GB')} {new Date(pprce * 1000).toLocaleTimeString('en-GB')}</TableCell>
    </TableRow>
  )
}


const GetPurchases = ({ticker}) => {
  const t = []
  const tickerlist = useSelector(state => state.AddTickers.tickerlist)
    for(let item in tickerlist){ 
      if(tickerlist[item].ticker === ticker){
        t.push(tickerlist[item])
      }
    }
    return t.map(n => <NewsItems key={n.id} {...n}/>)
}


const StockHistory = ({ticker}) => {
  return (
    <Card>
      <Typography color="textSecondary" gutterBottom>
        Purchase History
      </Typography>
      <CardContent>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Purchase Price</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <GetPurchases ticker={ticker} />
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default StockHistory;