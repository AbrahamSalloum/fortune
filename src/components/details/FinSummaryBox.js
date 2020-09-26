
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

const Summary = ({item}) => (
  <TableBody>
      <TableRow>
        <TableCell>Day Open: </TableCell>
        <TableCell>{item.dayopen}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Day Close: </TableCell>
        <TableCell>{item.dayclose}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Day High: </TableCell>
        <TableCell>{item.dayhigh}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Day Change: </TableCell>
        <TableCell>{item.daychange}</TableCell>
      </TableRow>
  </TableBody>
)

const FinSummaryBox = ({ticker}) => {
  const stats= useSelector(state => state.AddTickers.price)
  return (
    <Card style={{ height: '100%' }}>
      <Typography color="textSecondary" gutterBottom>
        CompanyStats
      </Typography>
      <CardContent>
        <TableContainer component={Paper}>
          <Table  size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Item</TableCell>
                <TableCell align="left">Number</TableCell>
              </TableRow>
            </TableHead>
              {
                stats.map((s,i) => {
                  if(s.ticker === ticker){
                    return <Summary key={i} item={s} />
                  }
                  return false
                })
              }
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

  export default FinSummaryBox;