import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import AdminViewUsersForm from '../forms/AdminViewUsersForm'
import { createUserRequest, deleteUserRequest, editUserRequest } from '../../actions/adminActions'
import { addFlashMessage } from '../../actions/flashMessages'

class AdminViewUsersPage extends React.Component {
    render(){ 
        const { createUserRequest, addFlashMessage,deleteUserRequest,editUserRequest } = this.props;
        return (
            <AdminViewUsersForm createUserRequest = { createUserRequest } 
                               addFlashMessage = { addFlashMessage } 
                               deleteUserRequest = { deleteUserRequest } 
                               editUserRequest = { editUserRequest } />
        );
    }
}

AdminViewUsersPage.propTypes = {
    createUserRequest : PropTypes.func.isRequired,
    deleteUserRequest : PropTypes.func.isRequired,
    editUserRequest: PropTypes.func.isRequired,
    addFlashMessage : PropTypes.func.isRequired
}

export default connect(null,{ createUserRequest,addFlashMessage })(AdminViewUsersPage);