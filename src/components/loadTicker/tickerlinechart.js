
import React, {useState, useEffect} from 'react'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { getLineData } from '../../redux/actions.js'

const SimpleLineChart = () => {

  const dispatch = useDispatch();
  const chartdata = useSelector(state => state.AddTickers.linedata)
  useEffect(() => {
    dispatch(getLineData(""))
  }, []);

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