import React from 'react';
import PropTypes from 'prop-types'
import TextFieldGroup from '../common/TextFieldGroup'
import Dropdown from 'react-dropdown'
import validator from 'validator'
import 'react-dropdown/style.css'
import classname from 'classnames'

class DoctorRenamePacientForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            errors: {},
            actualName : "",
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
        this.setState({otherPacients : this.props.otherPacients, actualName : this.props.pacientToRename, name : this.props.pacientToRename});
    }

    _submitForm(){
        if (this._isValid()){
            var obj = {}
            const { doctorRenamePacient , callbackRenameOrCancel } = this.props;
            obj["newfolder"] = this.state.name;
            obj["oldfolder"] = this.state.actualName;
            doctorRenamePacient(obj)
            .then((response)=>{
                callbackRenameOrCancel(true);
            })
            .catch((response)=>{
                callbackRenameOrCancel(false);
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
        
        if (toReturn && this.state.actualName === name){
            toReturn = false;
            _errors["name"] = "the name cannot be the same as the old one"
        }

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
        this.props.callbackRenameOrCancel(false);
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

DoctorRenamePacientForm.propTypes = {
    callbackRenameOrCancel : PropTypes.func.isRequired,
    doctorRenamePacient : PropTypes.func.isRequired,
    otherPacients : PropTypes.object.isRequired,
    pacientToRename : PropTypes.string.isRequired
}

export default DoctorRenamePacientForm;