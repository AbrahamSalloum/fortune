import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';



const CompanyProfileBox = (summary, classes) => {

    while(!summary["summary"].length){
      return "loading..." 
    }
  
    return (
      <Card className={classes.profilebox} variant="outlined">
        <Typography className={classes.title} color="textSecondary" gutterBottom>
        Company Profile
        </Typography>
        <CardContent>
          {
            summary["summary"][0]["summaryProfile"]['longBusinessSummary'] 
          }
        </CardContent>
      </Card>
    )
  
  }

  export default CompanyProfileBox