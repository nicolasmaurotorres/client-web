import React from 'react';
import PropTypes from 'prop-types'
import TextFieldGroup from '../common/TextFieldGroup'
import Dropdown from 'react-dropdown'
import validator from 'validator'
import 'react-dropdown/style.css'
import classname from 'classnames'


class AdminAddUserForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            errors: {},
            email: "",
            password: "",
            serverMessage: "",
            serverStatus:"",
            category: 0 //default doctor
        }

        /* bindings */
        this._submitForm = this._submitForm.bind(this);
        this._onChange = this._onChange.bind(this);
        this._isValid = this._isValid.bind(this);
        this._onClickCloseMessage = this._onClickCloseMessage.bind(this);
    }

    _submitForm(){
        if (this._isValid()){
            var obj = {}
            debugger;
            obj["email"] = this.state.email;
            obj["password"] = this.state.password;
            obj["category"] = parseInt(this.state.category);
            this.props.createUserRequest(obj)
            .then((response)=>{
                debugger;
                this.setState({serverMessage : response.response.data.message, serverStatus:"OK"})
            })
            .catch((response)=>{
                debugger;
                this.setState({serverMessage : response.response.data.message, serverStatus:"BAD_STATUS"})
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
                   <TextFieldGroup
                        error = { this.state.errors.password }
                        label = "Password"
                        onChange = { this._onChange }
                        value = { this.state.password }
                        field = "password"
                        type = "password" />
                    
                    <fieldset>
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" onChange={this._onChange } className="custom-select">
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

AdminAddUserForm.propTypes = {
    createUserRequest : PropTypes.func.isRequired,
    addFlashMessage : PropTypes.func.isRequired
}

export default AdminAddUserForm;