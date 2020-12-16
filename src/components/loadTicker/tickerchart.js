import React from 'react'
import  { Treemap, ResponsiveContainer} from 'recharts';
import {useSelector} from 'react-redux';

const createData = (tickerlist) => {
  const data = []
  const keys = []
  for(let ticker in tickerlist){
    keys.push(tickerlist[ticker]['ticker'])
  }
  const kk = [...new Set(keys)]
  for( let k in kk){
    let item = {name: kk[k], size: 0}
    for(let ticker in tickerlist){
      if(tickerlist[ticker]['ticker'] == kk[k]){
        item["size"] = item["size"] + Number(tickerlist[ticker]['amount'])*Number(tickerlist[ticker]['purchaseprice'])
      }
    }
    data.push(item)
    console.log(data)
  }
  return data
}

const SimplePieChart = () => {
  const tickerlist= useSelector(state => state.AddTickers.tickerlist)
  const data = createData(tickerlist)
  return (
    <ResponsiveContainer width="100%" height={300}>
      <Treemap
      height={300}
      data={data}
      dataKey="size"
      ratio={16/9}
      stroke="#fff"
      fill="#8884d8"
      isAnimationActive={false}
    />
    </ResponsiveContainer>
  );
}

export default SimplePieChart