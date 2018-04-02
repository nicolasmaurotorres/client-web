import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class FlashMessages extends React.Component {
    render(){
        const { id, type, text } = this.props;
        return (
            <div className = { classnames('alert','alert-dismissible',{'alert-success': type === 'success','alert-danger': type === 'error'})}>
                <button type="button" className="close" data-dismiss="alert">&times;</button>
                { text }
            </div>
        );
    }
}

FlashMessages.PropTypes = {
    message: PropTypes.object.isRequired
}