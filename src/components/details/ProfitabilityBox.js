import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';



const ProfitabilityBox = (summary, classes) => {
    while(!summary["summary"].length){
      return "loading..." 
    }
  
    return(
    <Card className={classes.cardroot} variant="outlined">
      <Typography className={classes.title} color="textSecondary" gutterBottom>
      Profitability
      </Typography>
    <CardContent>  
      <div className="val-box">
        <span>returnOnEquity: {summary["summary"][0]["financialData"]["returnOnEquity"]["fmt"]}</span>
        <span>returnOnAssets: {summary["summary"][0]["financialData"]["returnOnAssets"]["fmt"]}</span>
        <span>profitMargins: {summary["summary"][0]["financialData"]["profitMargins"]["fmt"]}</span>
        <span>grossMargins: {summary["summary"][0]["financialData"]["grossMargins"]["fmt"]}</span>
      </div>
      </CardContent>
      </Card>    
    ) 
  }

  export default ProfitabilityBox