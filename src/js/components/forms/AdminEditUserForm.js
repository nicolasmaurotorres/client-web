import React from 'react';
import PropTypes from 'prop-types'
import TextFieldGroup from '../common/TextFieldGroup'
import Dropdown from 'react-dropdown'
import validator from 'validator'
import 'react-dropdown/style.css'
import classname from 'classnames'
import { PropagateLoader } from 'react-spinners';

import PasswordMask from '../common/PasswordMask';

class AdminEditUserForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            errors: {},
            email: "",
            password: "",
            category: 0, //default doctor
            oldEmail: "",
            oldCategory: "",
            oldPassword: "",
            serverMessage: "",
            serverStatus: "",
        }

        /* bindings */
        this._submitForm = this._submitForm.bind(this);
        this._onChange = this._onChange.bind(this);
        this._isValid = this._isValid.bind(this);
        this._onClickCloseMessage = this._onClickCloseMessage.bind(this);
        this._cancelForm = this._cancelForm.bind(this);
        this.callback = this.callback.bind(this);
    }

    componentWillMount(){
        const { user } = this.props;
        this.setState({ oldEmail: user.email, oldCategory: user.category, oldPassword : user.password, 
                        email : user.email, password: user.password, category : user.category });
    }

    _submitForm(){
        if (this._isValid()){
            var obj = {};
            obj["email"] = this.state.email;
            obj["password"] = this.state.password;
            obj["category"] = parseInt(this.state.category);
            this.props.editUserRequest(obj)
            .then((response)=>{
                debugger;
                this.setState({serverMessage : response.data.message, serverStatus:"OK"})
                this.callback();
            })
            .catch((response)=>{
                debugger;
                if (typeof response.response === 'undefined'){
                    this.setState({serverMessage : "network error", serverStatus:"BAD_STATUS"})
                } else {
                    this.setState({serverMessage : response.data.message, serverStatus:"BAD_STATUS"})
                }
                this.callback();
            })
        }
    }

    _isValid(){
        var toReturn = true;
        var email = this.state.email;
        var password = this.state.password;
        var _errors = {};
        if (!validator.isEmail(email)){
            toReturn = false;
            _errors["email"] = "you have to enter a valid email";
        }
        if (validator.isEmpty(password)){
            toReturn = false;
            _errors["password"] = "the password cannot be empty";
        }
        this.setState( { errors : _errors });
        return toReturn;
    }


    _onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        this._isValid();
    }

    _cancelForm(){
        this.callback();
    }

    callback(){
        debugger;
        const { callbackEditUser } = this.props;
        if (callbackEditUser != null || typeof callbackEditUser !== 'undefined'){
            callbackEditUser();
        }    
    }
    
    _onClickCloseMessage(){
        this.setState({serverMessage:"",serverStatus:""});
    }

    render(){
        const { createUserRequest, addFlashMessage } = this.props;
        return (
            <div className="jumbotron">
                <div className="middle">
                { this.state.serverMessage !== "" && <div  className={classname("alert",(this.state.serverStatus === "OK") ? "alert-success" : "alert-danger")}> 
                                                        { this.state.serverMessage }
                                                        <button onClick={ this._onClickCloseMessage }type="button" className="close" data-dismiss="alert">
                                                            <span>&times;</span>
                                                        </button>
                                                     </div>}
                    <TextFieldGroup
                        error = { this.state.errors.email }
                        label="Email"
                        onChange = { this._onChange }
                        value = { this.state.email }
                        field = "email" />
                      
                    <PasswordMask 
                                              id = "passwordEdit"
                                              name = "password"
                                              placeholder = "Enter password"
                                              value = { this.state.oldPassword }
                                              onChange = { this.handleChange }/>
                    
                    <fieldset>
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={this.state.category} onChange = { this._onChange } className="custom-select">
                                <option value="0">Doctor</option>
                                <option value="1">Pladema</option>
                            </select>
                        </div>
                    </fieldset>
                    <div className="form-group">
                        <button onClick={ this._submitForm } className="btn btn-primary btn-lg"> Create </button>
                        <button onClick={ this._cancelForm } className="btn btn-danger btn-lg marginButton"> Cancel </button>
                    </div>
                </div>
            </div>
        );
    }
}

AdminEditUserForm.propTypes = {
    editUserRequest : PropTypes.func.isRequired,
    addFlashMessage : PropTypes.func.isRequired,
    callbackEditUser : PropTypes.func.isRequired,
    user : PropTypes.object.isRequired,
    
}

export default AdminEditUserForm;