
import React from 'react'
import {connect} from 'react-redux'
import {startLogin} from '../redux/actions'

class LoginPage extends React.Component {

    render(){
        return (
            <div>
                    <h1>Login with Google</h1>
                    <button onClick={this.props.startLogin} className="button">Login with Google</button>
            </div>
        )
    }
}

const mapDistpatchToProps = (dispatch) => ({
    startLogin: () => dispatch(startLogin())
})

export default connect(undefined, mapDistpatchToProps)(LoginPage)