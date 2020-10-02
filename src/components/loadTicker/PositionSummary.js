import React from 'react'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const PositionSummary = () => {
  return(
    <Box component="span" m={1}>
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a list">
        <TableHead>
          <TableRow>
            <TableCell>category</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>a</TableCell>
            <TableCell>1</TableCell>
          </TableRow>
          <TableRow>
          <TableCell>b</TableCell>
          <TableCell>2</TableCell>
        </TableRow>
        <TableRow>
        <TableCell>c</TableCell>
        <TableCell>3</TableCell>
      </TableRow>
        </TableBody>
      </Table>
      </TableContainer>
    </Box>
  )
}

export default PositionSummary
