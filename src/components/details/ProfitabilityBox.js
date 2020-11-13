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

const ProfitabilityBox = () => {
  const summary= useSelector(state => state.AddTickers.summary)

  const getsummary = (summary) => {
    let summary_data = {"returnOnEquity": "NA", "returnOnAssets": "NA", "profitMargins": "NA", "grossMargins": "NA"}
    if(!!summary[0]){ 
      summary_data['returnOnEquity'] = !!summary[0]["financialData"]["returnOnEquity"]["fmt"] ? summary[0]["financialData"]["returnOnEquity"]["fmt"] : "NA"
      summary_data['returnOnAssets'] = !!summary[0]["financialData"]["returnOnAssets"]["fmt"] ? summary[0]["financialData"]["returnOnAssets"]["fmt"] : "NA"
      summary_data['profitMargins'] = !!summary[0]["financialData"]["profitMargins"]["fmt"] ? summary[0]["financialData"]["profitMargins"]["fmt"] : "NA"
      summary_data['grossMargins'] = !!summary[0]["financialData"]["grossMargins"]["fmt"] ? summary[0]["financialData"]["grossMargins"]["fmt"] : "NA"
    } 
  return summary_data
  }

  const summary_data = getsummary(summary)

  return(
    <Card style={{ height: '100%' }}>
      <Typography color="textSecondary" gutterBottom>
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
                <TableCell> {summary_data["returnOnEquity"]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Return on Assets </TableCell>
                <TableCell>{summary_data["returnOnAssets"]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Profit Margins</TableCell>
                <TableCell>{summary_data["profitMargins"]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Gross Margins</TableCell>
                <TableCell>{summary_data["grossMargins"]}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default ProfitabilityBox