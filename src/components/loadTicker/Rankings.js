import React, {useState} from 'react'
import {useSelector} from 'react-redux';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const createData = (tickerlist, price, time, AddData) => {
    let x = ""
    const valuations = JSON.parse(JSON.stringify(tickerlist));
    for(let ticker in valuations){
        for(let p in price){
            if(price[p]['ticker'] === valuations[ticker]['ticker']){
                valuations[ticker]['curr_price'] = price[p]['price']
                valuations[ticker]['purchase_value'] = valuations[ticker]['purchaseprice'] * valuations[ticker]['amount']
                valuations[ticker]['current_value'] = valuations[ticker]['curr_price'] * valuations[ticker]['amount']
                x += `## ${valuations[ticker]['ticker']} - ${valuations[ticker]['purchase_value']} - ${valuations[ticker]['current_value']} ##`
            }
        }
    }
    AddData(x)
    
}


const Rankings = () => {
    const tickerlist= useSelector(state => state.AddTickers.tickerlist)
    const price = useSelector(state => state.AddTickers.price)
    const [data, AddData] = useState("...")
    return(
        <div>
            <div>
                <ButtonGroup color="primary" aria-label="outlined primary button group">
                    <Button onClick={() => {createData(tickerlist, price, "1DY", AddData)}}>Day</Button>
                    <Button onClick={() => {createData(tickerlist, price, "1WK", AddData)}}>Week</Button>
                    <Button onClick={() => {createData(tickerlist, price, "1M", AddData)}}>Month</Button>
                    <Button onClick={() => {createData(tickerlist, price, "1Y", AddData)}}>Year</Button>
                </ButtonGroup>
            </div> 
            <div>
            {data}
            </div>
        </div>
    )
}

export default Rankings