import React, {useState } from 'react'

import SimpleLineChartfrom from './tickerlinechart.js'

import SimplePieChart from './tickerchart.js'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ "minHeight": "300" }}
    >
      {value === index && <Box p={1}>{children}</Box>}
    </div>
  );
}

const a11yProps = (index) => {

  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TabbedInfo = () => {
  const [tabValue, settabValue] = useState(0);

  const handleChange = (event, tabValue) => {
    settabValue(tabValue);
  };

  return(
    <div>
      <Tabs value={tabValue} onChange={handleChange} aria-label="simple tabs example">
        <Tab label="Item One" {...a11yProps(0)} />
        <Tab label="Item Two" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <SimpleLineChartfrom />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
      <SimplePieChart/>
      </TabPanel>
    </div>
  )
}

export default TabbedInfo;


