import React from 'react'
import Tooltip from '@material-ui/core/Tooltip';
import { DataGrid } from '@material-ui/data-grid';
import { Link } from "react-router-dom"
import clsx from 'clsx'


const TickerItem = ({price, tickerlist, toggleshowbox, classes}) => {

    const RenderTicker = ({params}) => {
      return(
        <Tooltip title={params.data.additional.longName} aria-label="delete">
        <div>{params.value}</div>
        </Tooltip>
      )
    }

    let dataA = []
    let ismatch = false
    for(let item in tickerlist){
      ismatch = false
      for(let d in dataA){
        if(dataA[d]['ticker'] == tickerlist[item]['ticker']){
          ismatch = true
          dataA[d]['amounttotal'] = Number(dataA[d]['amounttotal']) + Number(tickerlist[item]['amount'])
        } 
      }
      
      if(!ismatch){
        dataA.push({...tickerlist[item], "amounttotal": Number(tickerlist[item]['amount'])})
      }
    }
  
  let data = []
  for(let item in dataA){
      for(let j in price){
        if (price[j]['ticker'] === dataA[item]['ticker']){
          data.push({...price[j], ...dataA[item]})
        }
      }
    }
    
    console.log(data)
    data = data.filter(i => i !== undefined);

    const columns = [
      { field: 'ticker', headerName: 'Ticker', width: 100, renderCell: (params) => <RenderTicker params={params} />},
      { field: 'amounttotal', headerName: 'Units' , width: 100, },
      { field: 'price', headerName: 'Price' , width: 100},
      { field: 'purchaseprice', headerName: 'Purchase Price' , width: 140},
      { field: 'dayopen', headerName: 'Day Open' ,width: 100},
      { field: 'dayclose', headerName: 'Day Close' ,width: 100},
      { field: 'dayhigh', headerName: 'Day High' , width: 100},
      { field: 'daylow', headerName: 'Day Low' , width: 100},
      { field: 'volume', headerName: 'Volume' , width: 100},
      { field: 'daychange', headerName: 'Day Change',  type: 'number', width: 130, cellClassName: (params) => clsx('daychange', {
        negative: params.value < 0,
        positive: params.value > 0,
      })},
      {field: 'details', headerName: 'Details',  width: 100 ,renderCell: (params) => <Link to={`/details/${params.getValue('ticker')}`}>Details</Link> }
    ]

    return(
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          disableMultipleSelection={true}
          rows={data} columns={columns}
          pageSize={10}
          autoHeight={true}
          autoPageSize={true}
          rowHeight={38}
          className={classes.root}
          onRowClick={(param) => {toggleshowbox(param)}}
        />
      </div>
    )
  }


  export default TickerItem