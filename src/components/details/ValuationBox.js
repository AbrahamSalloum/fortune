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

const ValuationBox = () => {
  const summary= useSelector(state => state.AddTickers.summary)

  const getsummary = (summary) => {
    let summary_data = {
    "trailingPE": "NA", 
    "pegRatio": "NA", 
    "priceToBook": "NA", 
    "priceToSalesTrailing12Months": "NA",
    "dividendYield": "NA",
    "payoutRatio": "NA"
  }
    if(!!summary[0]){ 
      summary_data['trailingPE'] = !!summary[0]["summaryDetail"]["trailingPE"] ? summary[0]["summaryDetail"]["trailingPE"]["fmt"] : "NA"
      summary_data['pegRatio'] = !!summary[0]["defaultKeyStatistics"]["pegRatio"] ? summary[0]["defaultKeyStatistics"]["pegRatio"]["fmt"] : "NA"
      summary_data['priceToBook'] = !!summary[0]["defaultKeyStatistics"]["priceToBook"] ? summary[0]["defaultKeyStatistics"]["priceToBook"]["fmt"] : "NA"
      summary_data['priceToSalesTrailing12Months'] = !!summary[0]["defaultKeyStatistics"]["priceToSalesTrailing12Months"] ? summary[0]["defaultKeyStatistics"]["priceToSalesTrailing12Months"]["fmt"] : "NA"
      summary_data['dividendYield'] = !!summary[0]["summaryDetail"]["dividendYield"] ? summary[0]["summaryDetail"]["dividendYield"]["fmt"] : "NA"
      summary_data['payoutRatio'] = !!summary[0]["summaryDetail"]["payoutRatio"] ? summary[0]["summaryDetail"]["payoutRatio"]["fmt"] : "NA"
    } 
  return summary_data
  }

  const summary_data = getsummary(summary)  

  return (
    <Card style={{ height: '100%' }}>
      <Typography color="textSecondary" gutterBottom>
        Valuation
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
                <TableCell>Trailing PE </TableCell>
                <TableCell>{summary_data["trailingPE"]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>PEG Ratio </TableCell>
                <TableCell>{summary_data["pegRatio"]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Price to Book</TableCell>
                <TableCell>{summary_data["priceToBook"]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Price To Sales (12M)</TableCell>
                <TableCell> {summary_data["priceToSalesTrailing12Months"]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Dividend Yield </TableCell>
                <TableCell>{summary_data["dividendYield"]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Payout Ratio</TableCell>
                <TableCell>{summary_data["payoutRatio"]}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default ValuationBox