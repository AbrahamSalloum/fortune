import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const Totals = ({showbox}) => {
  const price = useSelector(state => state.AddTickers.price)
  const tickerlist = useSelector(state => state.AddTickers.tickerlist)
  
  if(!showbox){
    return false
  }
  return(
    <Card style={{ width: '100%' }}>
      <Typography color="textSecondary" gutterBottom>
        Info
      </Typography>
      <CardContent>
      {showbox.data.ticker}
      </CardContent>
    </Card>
  )

}

export default Totals