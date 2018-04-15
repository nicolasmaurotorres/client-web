import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import AdminViewUsersForm from '../forms/AdminViewUsersForm'
import { createUserRequest, deleteUserRequest, editUserRequest, viewUsersRequest } from '../../actions/adminActions'
import { addFlashMessage } from '../../actions/flashMessages'

class AdminViewUsersPage extends React.Component {
    render(){ 
        const { createUserRequest, addFlashMessage,deleteUserRequest,editUserRequest, viewUsersRequest} = this.props;
        return (
            <AdminViewUsersForm createUserRequest = { createUserRequest } 
                               addFlashMessage = { addFlashMessage } 
                               deleteUserRequest = { deleteUserRequest } 
                               editUserRequest = { editUserRequest } 
                               viewUsersRequest = { viewUsersRequest } />
        );
    }
}

AdminViewUsersPage.propTypes = {
    createUserRequest : PropTypes.func.isRequired,
    deleteUserRequest : PropTypes.func.isRequired,
    editUserRequest: PropTypes.func.isRequired,
    addFlashMessage : PropTypes.func.isRequired,
    viewUsersRequest : PropTypes.func.isRequired
}

export default connect(null,{ createUserRequest,addFlashMessage,deleteUserRequest,editUserRequest,viewUsersRequest })(AdminViewUsersPage);