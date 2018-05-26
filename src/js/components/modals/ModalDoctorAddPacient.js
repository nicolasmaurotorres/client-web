import React from 'react';
import PropTypes from 'prop-types'
import { confirmable } from 'react-confirm';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import DoctorAddPacientForm from '../forms/DoctorAddPacientForm'
import { doctorAddPacient } from '../../actions/doctorActions'

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

class ModalDoctorAddPacient extends React.Component {
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
    const { doctorAddPacient,  otherPacients} = this.props;
    return (
      <div>
        <Modal
          isOpen = { this.state.modalIsOpen }
          onRequestClose={ this.closeModal }
          style={ customStyles }
          contentLabel="Example Modal">
            <DoctorAddPacientForm callbackCreateOrCancel = { this.callbackAddPacientOrCancel } 
                                  doctorAddPacient = { doctorAddPacient } 
                                  otherPacients = { otherPacients } /> 
        </Modal>
      </div>
    );
  }
}

ModalDoctorAddPacient.propTypes = {
  callbackAddPacient : PropTypes.func.isRequired,
  doctorAddPacient : PropTypes.func.isRequired,
  otherPacients : PropTypes.object.isRequired
}


export default connect(null,{doctorAddPacient})(confirmable(ModalDoctorAddPacient));