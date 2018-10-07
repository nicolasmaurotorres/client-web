import React from 'react'
import PropTypes from 'prop-types'
import validator from 'validator'
import jwt from 'jsonwebtoken';
import {setSpinnerState} from '../../actions/spinnerActions'
import TextFieldGroup from '../common/TextFieldGroup'
import { userLoginRequest,setCurrentUser } from '../../actions/authActions'
import { addFlashMessage } from '../../actions/flashMessagesActions'
import setAuthorizationInfo from '../../utils/setAuthorizationInfo';
import { connect } from 'react-redux';

class LoginForm extends React.Component {
    constructor(){
        super();

        this.state = {
            email: "",
            password:"",
            errors : {}
        };
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
            this.props.dispatch(setSpinnerState({
                state:true
            }));
            var obj = {}
            obj["email"] = this.state.email;
            obj["password"] = this.state.password;
            userLoginRequest(obj)
                .then((response) => { 
                    this.props.dispatch(setSpinnerState({
                        state:false
                    }));
                    this.props.dispatch(addFlashMessage({
                        type:"success",
                        text:"login success"
                    }));
                    const token = response.data.message;
                    const category = response.data.category;
                    setAuthorizationInfo(token);
                    this.props.dispatch(setCurrentUser(jwt.decode(token)));
                    switch (category) {
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
                .catch((error) => {
                    var e = error.message;
                    var _errors = this.state.errors;
                    _errors['submit'] = e;
                    this.setState({errors:_errors});
                    this.props.dispatch(setSpinnerState({
                        state:false
                    }));
                });
        };
    }

    _onClickCloseError(){
        this.setState({errors:{}});
    }

    render(){
        return (
            <div >
                <h1 className="text-center">Login </h1>
                { this.state.errors.submit && <div className="alert alert-danger"> 
                                                    { this.state.errors.submit }
                                                    <button onClick={ this._onClickCloseError }type="button" className="close" data-dismiss="alert">
                                                        <span>&times;</span>
                                                    </button>
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
                    <button onClick = { this._submitForm } className="btn btn-primary btn-lg"> Login </button>
                </div>
            </div>
        );
    }
};

LoginForm.contextTypes = {
    router : PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        loading : state.loading
    }
}

function mapDispatchToProps(dispatch) {
    return {
      dispatch,
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(LoginForm);