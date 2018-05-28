import React from 'react';
import PropTypes from 'prop-types'
import { confirmable } from 'react-confirm';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import DoctorAddFileForm from '../forms/DoctorAddFileForm'
import { doctorAddFile } from '../../actions/doctorActions'

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

class ModalDoctorAddFile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: true
    };

    this.callbackAddPacientOrCancel = this.callbackAddPacientOrCancel.bind(this);
  }

  callbackAddPacientOrCancel(updatePacients){
    this.props.callbackAddPacient(updatePacients);
    this.setState({modalIsOpen : false});
  }

  render() {
    const { doctorAddFile,  otherPacients} = this.props;
    return (
      <div>
        <Modal
          isOpen = { this.state.modalIsOpen }
          onRequestClose={ this.closeModal }
          style={ customStyles }
          contentLabel="Example Modal">
            <DoctorAddPacientForm callbackCreateOrCancel = { this.callbackAddPacientOrCancel } 
                                  doctorAddFile = { doctorAddFile } 
                                  otherPacients = { otherPacients } /> 
        </Modal>
      </div>
    );
  }
}

ModalDoctorAddFile.propTypes = {
  callbackAddPacient : PropTypes.func.isRequired,
  doctorAddFile : PropTypes.func.isRequired,
  otherPacients : PropTypes.object.isRequired
}


export default connect(null,{doctorAddFile})(confirmable(ModalDoctorAddFile));