import React from 'react';


import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';



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
        <div className="val-box">
        <span>trailing PE:{summary["summary"][0]["summaryDetail"]["trailingPE"]["fmt"]}</span>
        <span>pegRatio:{summary["summary"][0]["defaultKeyStatistics"]["pegRatio"]["fmt"]}</span>
        <span>priceToBook:{summary["summary"][0]["defaultKeyStatistics"]["priceToBook"]["fmt"]}</span> 
        <span>priceToSalesTrailing12Months:{summary["summary"][0]["defaultKeyStatistics"]["priceToSalesTrailing12Months"]["fmt"]}</span>
        <span>dividendYield:{summary["summary"][0]["summaryDetail"]["dividendYield"]["fmt"]}</span>
        <span>payoutRatio:{summary["summary"][0]["summaryDetail"]["payoutRatio"]["fmt"]}</span>
        </div>
        </CardContent>
        </Card>
    )
  
  }

  export default ValuationBox