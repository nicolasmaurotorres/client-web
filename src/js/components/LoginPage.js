import React    from 'react'
import LoginForm from './LoginForm'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { userLoginRequest } from '../actions/userLoginRequest'
import { addFlashMessage } from '../actions/flashMessages'

class LoginPage extends React.Component {
    render(){ 
        const  { addFlashMessage, userLoginRequest } = this.props;
        return (
                <div className="container"> 
                    <LoginForm userLoginRequest = { userLoginRequest } addFlashMessage = { addFlashMessage } />
                </div>
        );
    }
}

LoginPage.propTypes = {
    userLoginRequest : PropTypes.func.isRequired,
    addFlashMessage : PropTypes.func.isRequired
}

export default connect(null, { userLoginRequest, addFlashMessage })(LoginPage);