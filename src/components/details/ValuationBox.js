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
                <TableCell>{summary[0]["summaryDetail"]["trailingPE"] ? summary[0]["summaryDetail"]["trailingPE"]["fmt"] : "NA"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>PEG Ratio </TableCell>
                <TableCell>{summary[0]["defaultKeyStatistics"]["pegRatio"] ? summary[0]["defaultKeyStatistics"]["pegRatio"]["fmt"] : "NA"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Price to Book</TableCell>
                <TableCell>{summary[0]["defaultKeyStatistics"]["priceToBook"] ? summary[0]["defaultKeyStatistics"]["priceToBook"]["fmt"] : "NA"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Price To Sales (12M)</TableCell>
                <TableCell> {summary[0]["defaultKeyStatistics"]["priceToSalesTrailing12Months"] ? summary[0]["defaultKeyStatistics"]["priceToSalesTrailing12Months"]["fmt"] : "NA"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Dividend Yield </TableCell>
                <TableCell>{summary[0]["summaryDetail"]["dividendYield"] ? summary[0]["summaryDetail"]["dividendYield"]['fmt'] : "NA"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Payout Ratio</TableCell>
                <TableCell>{summary[0]["summaryDetail"]["payoutRatio"] ? summary[0]["summaryDetail"]["payoutRatio"]["fmt"] : "NA"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default ValuationBox