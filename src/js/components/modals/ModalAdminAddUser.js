import React from 'react';
import PropTypes from 'prop-types'
import { confirmable } from 'react-confirm';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import AdminAddUserForm from '../forms/AdminAddUserForm'
import { createUserRequest } from '../../actions/adminActions'
import { addFlashMessage } from '../../actions/flashMessages'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : '20%',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#app')

class ModalAdminAddUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: true
    };

    this.callbackCreateOrCancel = this.callbackCreateOrCancel.bind(this);
  }

  callbackCreateOrCancel(){
    this.props.callbackCreateUser();
    this.setState({modalIsOpen : false});
  }

  render() {
    const { createUserRequest, addFlashMessage} = this.props;
    return (
      <div>
        <Modal
          isOpen = { this.state.modalIsOpen }
          onRequestClose={ this.closeModal }
          style={ customStyles }
          contentLabel="Example Modal">
            <AdminAddUserForm callbackCreateOrCancel = { this.callbackCreateOrCancel } 
                              createUserRequest = {createUserRequest} 
                              addFlashMessage={addFlashMessage} /> 
        </Modal>
      </div>
    );
  }
}

ModalAdminAddUser.propTypes = {
  callbackCreateUser : PropTypes.func.isRequired,
  createUserRequest : PropTypes.func.isRequired,
  addFlashMessage : PropTypes.func.isRequired,
}


export default connect(null,{createUserRequest,addFlashMessage})(confirmable(ModalAdminAddUser));