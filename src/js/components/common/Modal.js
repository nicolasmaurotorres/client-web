import React from 'react'
import { connect } from 'react-redux';
import { closeModal } from '../../actions/modalActions'

class Modal extends React.Component {
  constructor(props){
    super(props);
    /* bindings */
    this.onClose = this.onClose.bind(this);
  }

  onClose(update,newName,oldName){
    debugger;
    if(this.props.item.onClose){
      this.props.item.onClose();
    } 
    if(this.props.item.callback){
      this.props.item.callback(update,newName,oldName);
    } 
    this.props.onClose(this.props.item);
  }

  onConfirm(update,newName,oldName){
    debugger;
    if(this.props.item.onConfirm){
      this.props.item.onConfirm();
    }
    if(this.props.item.callback){
      this.props.item.callback(update,newName,oldName);
    } 
    this.props.onClose(this.props.item);
  }

  render() {
    const { zIndex } = this.props;
    const { type } = this.props.item;
    switch(type){
        case 'confirmation': {
          const { text } = this.props.item;
          return (
          <div className="modal-wrapper" style={{zIndex: (zIndex+1)*10}}>
              <div className="modal">
              <div className="text">{ text }</div>
              <div className="buttons">
                  <button className="modal-button" onClick={() => this.onConfirm()}>Confirm</button>
                  <button className="modal-button" onClick={() => this.onClose()}>Close</button>
              </div>
              </div>
          </div>
          );
        }
        case 'custom':{
          debugger;
          var content = this.props.item.content;
         
          return (
            <div className="modal-wrapper" style={{zIndex: (zIndex+1)*10}}>
              <div className="modal">
              { React.cloneElement(content,{ callback : this.onClose }) }
                <button className="close" onClick={() => this.onClose()}>&times;</button>
              </div>
            </div>
          );
        }
        default: 
          return null;
    }
  }
}

class Modals extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            isOpened : false
        }
    }

    componentWillMount(){
        this.setState({isOpened : (this.props.modals.length > 0)});
    }

    componentWillReceiveProps(nextProps){
        this.setState({isOpened : (nextProps.modals.length > 0)});
    }
    
    render() {
      debugger;
      const modals = this.props.modals.map((item,i) => 
        <Modal  item={item} 
                key={i} 
                zIndex={i} 
                onClose={(item) => this.props.dispatch(closeModal(item))}/>
      );
      return (
        <div className="modals" style = {(this.state.isOpened > 0 ) ? {height:'100%'} :{height:'30%'} }> {/*para que no toquen los botones de atras*/}
          { modals }
        </div>
      );
    }
  }

  export const ModalContainer = connect(
      function mapStateToProps(state) {
          return {
              modals: state.modals.modals
          };
      },
      function mapDispatchToProps(dispatch) {
          return {
              dispatch
          }
      }
  )(Modals);