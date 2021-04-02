import React, {useState} from 'react'
import StockHistory from '../details/StockHistory'
import AggTotals from './AggTotals'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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
      {value === index && <div>{children}</div>}
    </div>
  );
}

const a11yProps = (index) => {
  
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Totals = ({showbox}) => {
  const [tabValue, settabValue] = useState(0);
  const handleChange = (event, tabValue) => {
    settabValue(tabValue);
  };
  if(!showbox){
    return false
  }
  return(
  <div>
    <Tabs value={tabValue} onChange={handleChange} aria-label="simple tabs example">
      <Tab label="Summary" {...a11yProps(0)} />
      <Tab label="History" {...a11yProps(1)} />
    </Tabs>
  <TabPanel value={tabValue} index={0}>
    <AggTotals showbox={showbox} />
  </TabPanel>
  <TabPanel value={tabValue} index={1}>
    <StockHistory ticker={showbox.data.ticker} />
  </TabPanel>
  </div>
    )
}

export default Totals