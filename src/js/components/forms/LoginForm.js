import React from 'react'
import classnames from 'classnames'
import { BeatLoader } from 'react-spinners'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import validator from 'validator'
import isEmpty from 'lodash/isEmpty'

import TextFieldGroup from '../common/TextFieldGroup'

class LoginForm extends React.Component {
    constructor(){
        super();

        this.state = {
            email: "",
            password:"",
            loading : false,
            errors : {}
        };0
        // Bindings
        this._submitForm = this._submitForm.bind(this);
        this._isValid = this._isValid.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onClickCloseError = this._onClickCloseError.bind(this);
    }

    _isValid(){
        var toReturn = true;
        var email = this.state.email;
        var password = this.state.password;
        var _errors = {};
        if (validator.isEmpty(email)){
            toReturn = false;
            _errors["email"] = "the email cannot be empty";
        }
        if (validator.isEmpty(password)){
            toReturn = false;
            _errors["password"] = "the password cannot be empty";    
        }
        this.setState({errors:_errors});
        return toReturn;
    }

    _onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        this._isValid();
    }

    _submitForm(e){
        e.preventDefault(); 
        if (this._isValid()){
            this.setState({loading:true});
            var obj = {}
            obj["email"] = this.state.email;
            obj["password"] = this.state.password;
            this.props.userLoginRequest(obj,this);
        }
    }

    _onClickCloseError(){
        this.setState({errors:{}});
    }

    render(){
        if (this.state.loading){
            return (
                <div className="centerComponent">
                    <BeatLoader color =  {'#2FA4E7'} loading = { this.state.loading }/>
                </div>
            );
        } else 
        return (
            <form onSubmit={ this._submitForm }>
                <h1 className="text-center">Login </h1>
                { this.state.errors.submit && <div className="alert alert-danger"> 
                                                    <button onClick={ this._onClickCloseError }type="button" className="close" data-dismiss="alert">
                                                        <span>&times;</span>
                                                    </button>
                                                    {this.state.errors.submit}
                                                </div>}
                <TextFieldGroup
                   error = { this.state.errors.email }
                   label="Email"
                   onChange = { this._onChange }
                   value = { this.state.email }
                   field = "email"
                />
                <TextFieldGroup
                  error = { this.state.errors.password }
                  label = "Password"
                  onChange = { this._onChange }
                  value = { this.state.password }
                  field = "password"
                  type = "password"
                />
                <div className="form-group">
                    <button className="btn btn-primary btn-lg"> Login </button>
                </div>
            </form>
        );
    }
};

LoginForm.PropTypes  = {
    userLoginRequest: PropTypes.func.isRequired,
    addFlashMessage : PropTypes.func.isRequired
}

LoginForm.contextTypes = {
    router : PropTypes.object.isRequired
}

export default LoginForm;