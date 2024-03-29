import React from 'react';
import PropTypes from 'prop-types'
import TextFieldGroup from '../../common/TextFieldGroup'
import validator from 'validator'
import classname from 'classnames'
import PasswordMask from '../../common/PasswordMask';
import { addFlashMessage } from '../../../actions/flashMessagesActions'
import { editUserRequest } from '../../../actions/adminActions'
import { setTableState } from '../../../actions/tableActions';
import { connect } from 'react-redux'

class AdminEditUserForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            errors: {},
            email: "",
            password: "",
            category: 0, //default specialist
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
        this._onConfirmEdit = this._onConfirmEdit.bind(this);
    }

    componentWillMount(){
        const { user } = this.props;
        this.setState({ oldEmail: user.email, oldCategory: user.category, oldPassword : user.password, 
                        email : user.email, password: user.password, category : user.category });
    }

    _onConfirmEdit(newData){
        var users = this.props.table.content;
        var found = false;
        var i = 0;
        while (!found && i < users.length){
            if (users[i].email === newData.oldemail) {
                users[i].email = (newData.newemail !== "") ? newData.newemail : users[i].email;
                users[i].password = (newData.newpassword !== "") ? newData.newpassword : users[i].password;
                users[i].category = (newData.newcategory !== -1) ? newData.newcategory : users[i].category;
                found = true;
            } else {
                i++;
            }
        }
        this.props.dispatch(setTableState({
            content : users
        }));
    }

    _submitForm(){
        if (this._isValid()){
            const data = {
                oldemail : this.state.oldEmail,
                newemail : (this.state.email !== this.state.oldEmail) ? this.state.email : "",
                newpassword : (this.state.password !== this.state.oldPassword) ? this.state.password  :  "",
                newcategory : (this.state.category !== this.state.oldCategory) ? parseInt(this.state.category) : -1
            };
            editUserRequest(data)
            .then((response)=>{
                this.setState({serverMessage : response.data.message, serverStatus:"OK"})
                this.props.dispatch(addFlashMessage({
                    type:"success",
                    text:"user edited successfully"
                }));
                this._onConfirmEdit(data);
                this._cancelForm();
            })
            .catch((response)=>{
                this.props.dispatch(addFlashMessage({
                    type:"error",
                    text:"cannot edit the user"
                }));
                if (typeof response.response === 'undefined'){
                    this.setState({serverMessage : "network error", serverStatus:"BAD_STATUS"})
                } else {
                    this.setState({serverMessage : response.response.data.message, serverStatus:"BAD_STATUS"})
                }
            });
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
        this.setState({ [e.target.name]: e.target.value },()=>{
            this._isValid();
        });
    }

    _cancelForm(){
        if (typeof this.props.callback !== 'undefined'){
            this.props.callback();
        }
    }
   
    _onClickCloseMessage(){
        this.setState({serverMessage:"",serverStatus:""});
    }

    render(){
        return (
            <div className="jumbotron">
                <div className="middle">
                { this.state.serverMessage !== "" && <div  className={classname("alert",(this.state.serverStatus === "OK") ? "alert-success" : "alert-danger")}> 
                                                        { this.state.serverMessage }
                                                        <button onClick={ this._onClickCloseMessage }type="button" className="close" data-dismiss="alert">
                                                            <span>&times;</span>
                                                        </button>
                                                     </div>}
                    <TextFieldGroup name = "email"
                        error = { this.state.errors.email }
                        label="Email"
                        onChange = { this._onChange }
                        value = { this.state.email }
                        field = "email" />
                      
                    <PasswordMask name = "password"
                                  value = { this.state.oldPassword }
                                  showStrongPassword = { true }
                                  showTitle = { true }
                                  onChange = { this._onChange } />
                    <fieldset>
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={this.state.category} onChange = { this._onChange } className="custom-select">
                                <option value="0">Specialist</option>
                                <option value="1">Technician</option>
                            </select>
                        </div>
                    </fieldset>
                    <div className="form-group">
                        <button onClick={ this._submitForm } className="btn btn-primary btn-lg"> Change </button>
                        <button onClick={ this._cancelForm } className="btn btn-danger btn-lg marginButton"> Cancel </button>
                    </div>
                </div>
            </div>
        );
    }
}

AdminEditUserForm.propTypes = {
    callback : PropTypes.func,
    user : PropTypes.object.isRequired, 
}

function mapStateToProps(state) {
    return {
        auth : state.auth,
        table : state.table
    }
}

function mapDispatchToProps(dispatch) {
    return {
      dispatch,
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(AdminEditUserForm);