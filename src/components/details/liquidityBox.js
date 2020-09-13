import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';



const LiquidityBox = (summary, classes) => {

    while(!summary["summary"].length){
      return "loading..." 
    }
  
    return(
      <Card className={classes.cardroot} variant="outlined">
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Liquidity
        </Typography>
        <CardContent>  
          <div className="val-box">
            <span>currentRatio: {summary["summary"][0]["financialData"]["currentRatio"]["fmt"]}</span>
            <span>quickRatio: {summary["summary"][0]["financialData"]["quickRatio"]["fmt"]}</span>
            <span>debtToEquity: {summary["summary"][0]["financialData"]["debtToEquity"]["fmt"]}</span>
          </div>
        </CardContent>
      </Card>      
    ) 
  }

  export default LiquidityBox