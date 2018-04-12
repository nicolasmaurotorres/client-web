import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

class TextFieldGroup extends React.Component {
    render() {
        var { field, value, label, error, type, onChange } = this.props;
        return (
            <div className={classnames('form-group', { 'has-error': error })}>
                <label className="control-label">{label}</label>
                <input
                    onChange ={ onChange }
                    value = { value }
                    type = { type }
                    name = { field }
                    className = { classnames("form-control",{"is-invalid":error},{"is-valid":!error}) }
                />
                { error && <span className={classnames('help-block', { 'text-danger': error })}>{error}</span> }
            </div>  
        );
    }
}

TextFieldGroup.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

TextFieldGroup.defaultProps = {
  type: 'text'
}

export default TextFieldGroup;