import React from 'react'
import {useDispatch} from 'react-redux';
import {dodelticker} from '../../redux/actions.js'
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';

const ToggleBox = ({showbox, toggleshowbox}) => {

    const dispatch = useDispatch();
    if(!showbox){
      return false
    }
    return(
      <div style={{display: "flex", padding: "5px", "whiteSpace": "nowrap"}}>
        <div style={{"marginLeft": "5px", "marginRight": "5px"}} >
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={() => {dispatch(dodelticker(showbox.data.id)) ; toggleshowbox(false)}}
          >Delete ({showbox.data.ticker})</Button>
        </div>
        <div style={{"marginLeft": "5px", "marginRight": "5px"}}>
         <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
          >Edit</Button>
        </div>
        <div style={{"marginLeft": "5px", "marginRight": "5px"}}>
          <Button
            variant="contained"
            onClick={() => {toggleshowbox(false)}}
            startIcon={<CloseIcon />}
          >Close</Button>
        </div>
      </div>
    )
  }

export default ToggleBox