import React from 'react';
import PropTypes from 'prop-types'
import { confirmable } from 'react-confirm';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import DoctorRenamePacientForm from '../forms/DoctorRenamePacientForm'
import { doctorRenamePacient } from '../../actions/doctorActions'

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

class ModalDoctorRenamePacient extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: true
    };

    this.callbackRenamePacientOrCancel = this.callbackRenamePacientOrCancel.bind(this);
  }

  callbackRenamePacientOrCancel(updatePacients){
    this.props.callbackRenamePacient(updatePacients);
    this.setState({modalIsOpen : false});
  }

  render() {
    const { doctorRenamePacient, otherPacients, pacientToRename } = this.props;
    return (
      <div>
        <Modal
          isOpen = { this.state.modalIsOpen }
          onRequestClose={ this.closeModal }
          style={ customStyles }
          contentLabel="Example Modal">
            <DoctorRenamePacientForm  callbackRenameOrCancel = { this.callbackRenamePacientOrCancel } 
                                      doctorRenamePacient = { doctorRenamePacient } 
                                      pacientToRename = { pacientToRename }
                                      otherPacients = { otherPacients } /> 
        </Modal>
      </div>
    );
  }
}

ModalDoctorRenamePacient.propTypes = {
  callbackRenamePacient : PropTypes.func.isRequired,
  doctorRenamePacient : PropTypes.func.isRequired,
  pacientToRename : PropTypes.string.isRequired,
  otherPacients : PropTypes.object.isRequired
}


export default connect(null,{doctorRenamePacient})(confirmable(ModalDoctorRenamePacient));