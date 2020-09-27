
import React, {useState, useEffect} from 'react'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import moment from 'moment'

const SimpleLineChart = () => {
  const [chartdata, setchartdata] = useState([])
  const GetChart = () => {
    fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-spark?interval=1wk&range=max&symbols=^AXKO`, {
      "method": "GET",
      "headers": {
      "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
      "x-rapidapi-key": "acf79a894fmsh38e96e215939adfp1aef8ejsn8f574aa46ecf"
      }
    })
    .then(res => res.json())
    .then((plotdata) => {
      const data = []
      try {
        for(let i in plotdata["^AXKO"]["timestamp"]){
          let t = moment.unix(plotdata["^AXKO"]["timestamp"][i])
          let o = { timestamp: t.format("DD/MM/YY hh:mm"), close: plotdata["^AXKO"]["close"][i]}
          data.push(o)
        }
        setchartdata(data)
      } catch(err){
          console.log(err)
      }              
    })
  }
  
  useEffect(() => GetChart(), []);

  	return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartdata} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
          <XAxis dataKey="timestamp"/>
          <YAxis domain={['auto', 'auto']}/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Legend />
          <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false}/>
        </LineChart>
      </ResponsiveContainer>
    );
}

export default SimpleLineChart