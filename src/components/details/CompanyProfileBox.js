import React from 'react';
import {useSelector} from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


const CompanyProfileBox = ({ticker}) => {
  
  const summary= useSelector(state => state.AddTickers.summary)

  const GetTickerSummary = ({ticker}) => {
    for(let i in summary){
      if (summary[i]['symbol'] === ticker){
        console.log(summary[i])
        return (
          <div>
          {summary[i]["summaryProfile"]['longBusinessSummary']}
          </div>
        )
      }
    }
    return (<div>loading..</div>)
  }

  
  return (
    <Card style={{ height: '100%' }}>
      <Typography color="textSecondary" gutterBottom>
        Company Profile
      </Typography>
      <CardContent>
          <GetTickerSummary ticker={ticker} />
      </CardContent>
    </Card>
  )
}

  export default CompanyProfileBox