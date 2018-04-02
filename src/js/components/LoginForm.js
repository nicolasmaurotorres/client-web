import React from 'react'
import classnames from 'classnames'
import { BeatLoader } from 'react-spinners'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axiosInstance from '../utils/axiosInstance'
import TextFieldGroup from './TextFieldGroup'
import validator from 'validator'
import isEmpty from 'lodash/isEmpty'

class LoginForm extends React.Component {
    constructor(){
        super();

        this.state = {
            email: "",
            password:"",
            loading : false,
            errors : {}
        };
        // Bindings
        this._submitForm = this._submitForm.bind(this);
        this._isValid = this._isValid.bind(this);
        this._onChange = this._onChange.bind(this);
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
            this.props.userLoginRequest(obj)
            .then(response => { 
                this.setState({loading:false});
                this.props.addFlashMessage({
                    type:"success",
                    text:"login success"
                });
                switch (response.data.category) {
                    case 0: // doctor
                        this.context.router.history.push("/doctor");
                        break;
                    case 1: // pladema
                        this.context.router.history.push("/pladema");
                        break;
                    case 2: // admin
                        this.context.router.history.push("/admin");
                        break; 
                };
            })
            .catch(error => {
                this.setState({loading:false});
            });
        }
    }

    render(){
        /*  error 
        var notification = <div className="alert alert-dismissible alert-danger">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Oh snap!</strong> <a href="#" class="alert-link">Change a few things up</a> and try submitting again.
        </div>;
            success
        <div class="alert alert-dismissible alert-success">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Well done!</strong> You successfully read <a href="#" class="alert-link">this important alert message</a>.
        </div> 
        var validEmail = (this.state.validemail)? "has-success" : "has-error";
        var validFeedback = (this.state.validemail)? "text-success" : "text-danger";
        var spanMessage = (this.state.validemail)? "Success! You've done it." : "Sorry, that username's taken or is invalid. Try another one.";
        */
        if (this.state.loading){
            return (
                <div className="centerComponent">
                    <BeatLoader color =  {'#2FA4E7'} loading = { this.state.loading }/>
                </div>
            );
        } else 
        return (
            <form onSubmit={ this._submitForm }  className="container">
                <h1 className="text-center">Login </h1>

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