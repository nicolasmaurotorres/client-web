import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

class FlashMessages extends React.Component {
    constructor(props){
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(){
        this.props.deleteFlashMessage(this.props.message.id);
    }

    render(){
        const { id, type, text } = this.props.message;
        return (
            <div className = { classnames('alert','alert-dismissible',{'alert-success': type === 'success','alert-danger': type === 'error', 'alert-warning': type === 'warning'})}>
                <button type="button" onClick = { this.onClick } className="close" data-dismiss="alert"><span>&times;</span></button>
                { text }
            </div>
        );
    }
}

FlashMessages.PropTypes = {
    message: PropTypes.object.isRequired,
    deleteFlashMessage: PropTypes.func.isRequired
}

export default FlashMessages;