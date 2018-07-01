import { render } from 'react-dom'
import React from 'react'

export function openModal(props){
    const target = document.createElement('div');
    document.body.appendChild(target);
    const { children, ...rest } = props;
    render(
        <Modal {...rest} reference={target} >
            { children }
        </Modal>,
        target
    );
}

class Modal extends React.Component {
    onClose(){
        this.props.reference.remove()
    }
    
    render() {
    const { text } = this.props;
    return (
            <div className="modal-wrapper">
                <div className="modal">
                     <button className="close" onClick={() => this.onClose()}>&times;</button>
                    <div className="text">{text}</div>
                </div>
            </div>
    );
  }
}