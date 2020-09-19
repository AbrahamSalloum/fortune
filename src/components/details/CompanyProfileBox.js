import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';



const CompanyProfileBox = (summary) => {
  return (
    <Card style={{ height: '100%' }}>
      <Typography color="textSecondary" gutterBottom>
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