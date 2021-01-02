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

const LiquidityBox = () => {
  const summary= useSelector(state => state.AddTickers.summary)
  const getsummary = (summary) => {
    let summary_data = {"currentRatio": "NA", "quickRatio": "NA", "debtToEquity": "NA"}
    if(summary[0]){ 
      summary_data['currentRatio'] = !!summary[0]["financialData"]["currentRatio"]["fmt"] ? summary[0]["financialData"]["currentRatio"]["fmt"] : "OK"
      summary_data['quickRatio'] = !!summary[0]["financialData"]["quickRatio"]["fmt"] ? summary[0]["financialData"]["quickRatio"]["fmt"] : "NA"
      summary_data['debtToEquity'] = !!summary[0]["financialData"]["debtToEquity"]["fmt"] ? summary[0]["financialData"]["debtToEquity"]["fmt"] : "NA"
    } 
  return summary_data
  }

  const summary_data = getsummary(summary)


  return(
    <Card style={{ height: '100%' }}>
      <Typography color="textSecondary" gutterBottom>
        Liquidity
      </Typography>
      <CardContent>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Item</TableCell>
              <TableCell align="left">Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Current Ratio </TableCell>
              <TableCell>{summary_data["currentRatio"]}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Quick Ratio</TableCell>
              <TableCell>{summary_data["quickRatio"]}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Debt To Equity</TableCell>
              <TableCell>{summary_data["debtToEquity"]}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
  )
}

export default LiquidityBox