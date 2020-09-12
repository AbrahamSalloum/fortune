import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';



const arrangedata = (plotdata, ticker) => {
    const data = []
    while(plotdata.length === 0){
      return []
    }
      for(let i in plotdata[0][ticker]["timestamp"]){
        let t = moment.unix(plotdata[0][ticker]["timestamp"][i]) 
        let o = { timestamp: t.format("DD/MM/YY hh:mm"), close: plotdata[0][ticker]["close"][i]}
        data.push(o)
      }
    return data
  }
  
  const CloseChartBox = ({plotdata, ticker, getXaxis, classes}) => (
    <Card className={classes.cardroot} variant="outlined">
      <Typography className={classes.title} color="textSecondary" gutterBottom>
    Chart
    </Typography>
      <CardContent>
    <LineChart  width={550} height={300} data={arrangedata(plotdata, ticker)}>
      <XAxis dataKey="timestamp"  angle={5} interval="preserveStartEnd"/>
      <YAxis domain={['auto', 'auto']}/>
      <Tooltip/>
      <CartesianGrid strokeDasharray="3 3"/>
      <Line type="monotone" dataKey="close" stroke="#8884d8" activeDot={{r: 8}}/>
      
    </LineChart>
    <ButtonGroup color="primary" aria-label="outlined primary Button group">
      <Button onClick={() => {getXaxis("1d", ticker)}}>1 day</Button>
      <Button onClick={() => {getXaxis("5d", ticker)}}>5 day</Button>
      <Button onClick={() => {getXaxis("3mo", ticker)}}>3 Month</Button>
      <Button onClick={() => {getXaxis("6mo", ticker)}}>6 Month</Button>
      <Button onClick={() => {getXaxis("1y", ticker)}}>1 year</Button>
      <Button onClick={() => {getXaxis("5y", ticker)}}>5 year</Button>
      <Button onClick={() => {getXaxis("max", ticker)}}>Max</Button>
     </ButtonGroup> 
     </CardContent>
    </Card>
  )

  export default CloseChartBox