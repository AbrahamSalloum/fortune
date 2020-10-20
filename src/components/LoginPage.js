
import React from 'react'
import {connect} from 'react-redux'
import {startLogin} from '../redux/actions'
import {SignUp} from './LoginPage/Signup'
import { Link } from "react-router-dom"

class LoginPage extends React.Component {

    render(){
        return (
            <div>
                <h1>Login with Google</h1>
                <button onClick={this.props.startLogin} className="button">Login with Google</button>
                <Link to={SignUp}>Sign Up with Email</Link>
            </div>
        )
    }
}

const mapDistpatchToProps = (dispatch) => ({
    startLogin: () => dispatch(startLogin())
})

export default connect(undefined, mapDistpatchToProps)(LoginPage)