import React from 'react';
import PropTypes from 'prop-types'
import { confirmable } from 'react-confirm';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import AdminAddUserPage from '../pages/AdminAddUserPage'
import { createUserRequest } from '../../actions/adminActions'
import { addFlashMessage } from '../../actions/flashMessages'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
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

    //this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModalOk = this.closeModalOk.bind(this);
    this.closeModalCancel = this.closeModalCancel.bind(this);
    this.callbackCreateOrCancel = this.callbackCreateOrCancel.bind(this);
  }

  afterOpenModal() {
    this.subtitle.style.color = '#f00';// references are now sync'd and can be accessed.
  }

  closeModalOk() {
    this.setState({modalIsOpen: false});
    this.props.proceed();
  }

  closeModalCancel(){
    this.setState({modalIsOpen: false});
    this.props.cancel();
  }

  callbackCreateOrCancel(){
    this.props.callbackCreateUser();
    this.setState({modalIsOpen : false});
  }

  render() {
    const { show, proceed, dismiss, cancel, confirmation, options, title, message } = this.props;
    return (
      <div>
        <Modal
          isOpen = { this.state.modalIsOpen }
          onAfterOpen = { this.afterOpenModal }
          onRequestClose={ this.closeModal }
          style={ customStyles }
          contentLabel="Example Modal">
            <AdminAddUserPage callbackCreateOrCancel = { this.callbackCreateOrCancel }/> 
        </Modal>
      </div>
    );
  }
}

ModalAdminAddUser.propTypes = {
  callbackCreateUser : PropTypes.func.isRequired,
}


export default confirmable(ModalAdminAddUser);