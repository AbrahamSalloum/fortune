import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {useSelector} from 'react-redux';


const CompanyProfileBox = () => {
  const summary= useSelector(state => state.AddTickers.summary)
  return (
    <Card style={{ height: '100%' }}>
      <Typography color="textSecondary" gutterBottom>
        Company Profile
      </Typography>
      <CardContent>
        {
          summary[0]["summaryProfile"]['longBusinessSummary']
        }
      </CardContent>
    </Card>
    )
}

  export default CompanyProfileBox