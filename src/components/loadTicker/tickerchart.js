import React from 'react'
import  { PieChart, Pie, Sector, Cell, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {useSelector} from 'react-redux';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const createData = (tickerlist) => {
  const data = []
  for(let ticker in tickerlist){
    data.push({name: tickerlist[ticker]['ticker'], value:Number(tickerlist[ticker]['amount'])*Number(tickerlist[ticker]['purchaseprice'])})
  }
  return data
}

const SimplePieChart = () => {
  const tickerlist= useSelector(state => state.AddTickers.tickerlist)
  const data = createData(tickerlist)
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          isAnimationActive={false}
          label={(entry) => entry.name}
          data={data} 
          fill="#536A6D"
          nameKey="name"
          dataKey="value"
          labelLine={true}>
          {
            data.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]}/>)
          }
        </Pie>
          <Tooltip/>
      </PieChart>
    </ResponsiveContainer>
  );
}

export default SimplePieChart