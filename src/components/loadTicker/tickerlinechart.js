
import React, {useEffect} from 'react'
import {LineChart, Line, Brush, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { getLineData } from '../../redux/actions.js'

const SimpleLineChart = () => {

  const dispatch = useDispatch();
  const chartdata = useSelector(state => state.AddTickers.linedata)
  useEffect(() => {
    dispatch(getLineData("^AXKO"))
  }, []);

  	return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartdata} margin={{top: 0, right: 0, left: 0, bottom: 0}}>
          <YAxis domain={['auto', 'auto']}/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Legend />
          <Tooltip/>
          <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
          <Brush dataKey="timestamp" travellerWidth={15} />
          </LineChart>
      </ResponsiveContainer>
    );
}

export default SimpleLineChart