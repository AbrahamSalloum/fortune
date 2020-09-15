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

const ProfitabilityBox = (summary, classes) => {

    return(
      <Card className={classes.cardroot}>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Profitability
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
            <TableCell>Return on Equity </TableCell>
            <TableCell> {summary["summary"][0]["financialData"]["returnOnEquity"]["fmt"] && summary["summary"][0]["financialData"]["returnOnEquity"]["fmt"]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Return on Assets </TableCell>
            <TableCell>{summary["summary"][0]["financialData"]["returnOnAssets"]["fmt"]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Profit Margins</TableCell>
            <TableCell>{summary["summary"][0]["financialData"]["profitMargins"]["fmt"]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Gross Margins</TableCell>
            <TableCell>{summary["summary"][0]["financialData"]["grossMargins"]["fmt"]}</TableCell>
          </TableRow>
            </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    )
  }

  export default ProfitabilityBox