import React from 'react';
import {useSelector} from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

const CompanyProfileBox = ({ticker}) => {
  
  const summary= useSelector(state => state.AddTickers.summary)

  const GetTickerSummary = ({ticker}) => {
    try{
      for(let i in summary){
        if (summary[i]['symbol'] === ticker){
          console.log(summary[i])
          return (
            <div className="summdata">
              <div className="profiledata">
                {summary[i]["summaryProfile"]['longBusinessSummary']}
              </div>
              <div className="profiledata">
                <a href={summary[i]["summaryProfile"]['website']} target="_blank"><Chip label={summary[i]["summaryProfile"]['website']}/></a>
                <Chip label={summary[i]["summaryProfile"]['industry']} />
              </div>
            </div>
          )
        }
        return (<div>loading..</div>)
      }
    } catch {
      return (<div>loading..</div>)
    }

    
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