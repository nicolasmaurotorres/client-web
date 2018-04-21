import React from 'react';
import PropTypes from 'prop-types'
import { confirmable } from 'react-confirm';
import Modal from 'react-modal';

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

class ConfirmForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: true
    };

    //this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModalOk = this.closeModalOk.bind(this);
    this.closeModalCancel = this.closeModalCancel.bind(this);
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

          <h2 ref={subtitle => this.subtitle = subtitle}> { title }</h2>
          <br/>
          <div>{ message }</div>
          <br/>
          <button className="btn btn-primary btn-lg marginButton" onClick={ this.closeModalOk }> Ok </button> 
          <button className="btn btn-primary btn-lg marginButton" onClick={ this.closeModalCancel }> Close </button>
        </Modal>
      </div>
    );
  }
}

ConfirmForm.propTypes = {
  title : PropTypes.string.isRequired,
  message : PropTypes.string.isRequired,
}


export default confirmable(ConfirmForm);