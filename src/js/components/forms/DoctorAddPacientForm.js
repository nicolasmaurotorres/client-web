import React from 'react';
import PropTypes from 'prop-types'
import TextFieldGroup from '../common/TextFieldGroup'
import Dropdown from 'react-dropdown'
import validator from 'validator'
import 'react-dropdown/style.css'
import classname from 'classnames'

class DoctorAddPacientForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            errors: {},
            name: "",
            otherPacients : [],
        }

        /* bindings */
        this._submitForm = this._submitForm.bind(this);
        this._onChange = this._onChange.bind(this);
        this._isValid = this._isValid.bind(this);
        this._onClickCloseMessage = this._onClickCloseMessage.bind(this);
        this._cancelForm = this._cancelForm.bind(this);
    }

    componentWillMount(){
        this.setState({otherPacients : this.props.otherPacients});
    }

    _submitForm(){
        if (this._isValid()){
            var obj = {}
            obj["name"] = this.state.email;
            obj["password"] = this.state.password;
            obj["category"] = parseInt(this.state.category);
            this.props.doctorAddPacient(obj)
            .then((response)=>{
                this.setState({serverMessage : response.data.message, serverStatus:"OK"})
                this.props.callbackCreateOrCancel();
            })
            .catch((response)=>{
                if (typeof response.response === 'undefined'){
                    this.setState({serverMessage : "network error", serverStatus:"BAD_STATUS"})
                } else {
                    this.setState({serverMessage : response.data.message, serverStatus:"BAD_STATUS"})
                }
                this.props.callbackCreateOrCancel();
            });
        }
    }

    _isValid(){
        var toReturn = true;
        var name = this.state.name;
        name = name.trim();
        var _errors = {};
        var res = name.match(/^[a-z0-9]+$/i); // solo letras y numeros 
        if (res === null){
            toReturn = false;
            _errors["name"] = "only can contains numbers and letters the name of the pacient";
        }
        
        if (toReturn && validator.isEmpty(name)){
            toReturn = false;
            _errors["name"] = "the name cannot be empty";
        }   
        debugger;
        if (toReturn && this.state.otherPacients[name] != null){
            toReturn = false;
            _errors["name"] = "you already have a pacient with that name";
        }                                         
        
        this.setState( { errors : _errors });
        return toReturn;
    }


    _onChange(e) {
        this.setState({ [e.target.name]: e.target.value },()=>{
            this._isValid();
        });
        
    }

    _cancelForm(){
        this.props.callbackCreateOrCancel();
    }
    
    _onClickCloseMessage(){
        this.setState({serverMessage:"",serverStatus:""});
    }

    render(){
        return (
            <div className="jumbotron">
                <div className="middle">
                    <TextFieldGroup
                        error = { this.state.errors.name }
                        label="Nombre"
                        onChange = { this._onChange }
                        value = { this.state.name }
                        field = "name" />

                    <div className="form-group">
                        <button onClick={ this._submitForm } className="btn btn-primary btn-lg"> Add </button>
                        <button onClick={ this._cancelForm } className="btn btn-danger btn-lg marginButton"> Cancel </button>
                    </div>
                </div>
            </div>
        );
    }
}

DoctorAddPacientForm.propTypes = {
    callbackCreateOrCancel : PropTypes.func.isRequired,
    doctorAddPacient : PropTypes.func.isRequired,
    addFlashMessage : PropTypes.func.isRequired,
    otherPacients : PropTypes.objectw.isRequired
}

export default DoctorAddPacientForm;