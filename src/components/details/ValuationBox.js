import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const ValuationBox = (summary, classes) => {

    while(!summary["summary"].length){
      return "loading..."
    }

    return (
      <Card className={classes.cardroot} variant="outlined">
        <Typography className={classes.title} color="textSecondary" gutterBottom>
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
                  <TableCell>trailing PE </TableCell>
                  <TableCell>{summary["summary"][0]["summaryDetail"]["trailingPE"] ? summary["summary"][0]["summaryDetail"]["trailingPE"]["fmt"] : "NA"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>PEG Ratio </TableCell>
                  <TableCell>{summary["summary"][0]["defaultKeyStatistics"]["pegRatio"] ? summary["summary"][0]["defaultKeyStatistics"]["pegRatio"]["fmt"] : "NA"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>priceToBook</TableCell>
                  <TableCell>{summary["summary"][0]["defaultKeyStatistics"]["priceToBook"] ? summary["summary"][0]["defaultKeyStatistics"]["priceToBook"]["fmt"] : "NA"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Price To Sales Trailing 12Months</TableCell>
                  <TableCell> {summary["summary"][0]["defaultKeyStatistics"]["priceToSalesTrailing12Months"] ? summary["summary"][0]["defaultKeyStatistics"]["priceToSalesTrailing12Months"]["fmt"] : "NA"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Dividend Yield </TableCell>
                  <TableCell>{summary["summary"][0]["summaryDetail"]["dividendYield"] ? summary["summary"][0]["summaryDetail"]["dividendYield"]['fmt'] : "NA"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Payout Ratio</TableCell>
                  <TableCell>{summary["summary"][0]["summaryDetail"]["payoutRatio"] ? summary["summary"][0]["summaryDetail"]["payoutRatio"]["fmt"] : "NA"}</TableCell>
                </TableRow>
                </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
  )
}

export default ValuationBox