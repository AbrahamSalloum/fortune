
import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


const Summary = ({item}) => (
    <div>
      <div>
        <span>Day Open: </span>
        <span>{item.dayopen}</span>
      </div>
      <div>
        <span>Day Close: </span>
        <span>{item.dayclose}</span>
      </div>
      <div>
        <span>Day High: </span>
        <span>{item.dayhigh}</span>
      </div>
      <div>
        <span>Day Change: </span>
        <span>{item.daychange}</span>
      </div>
      
    </div>
  )
  
  const FinSummaryBox = ({stats, ticker, classes}) => (
    <Card className={classes.cardroot} variant="outlined">
    <Typography className={classes.title} color="textSecondary" gutterBottom>
    Company Stats
  </Typography>
  <CardContent>
    {
      stats.map((s) => {
        if(s.ticker === ticker){
          return <Summary key={s.ticker} item={s} />
        }
        return false
      })
    }
    </CardContent>
    </Card>
  )

  export default FinSummaryBox;