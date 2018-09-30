import React from 'react';
import validator from 'validator'
import classname from 'classnames'
import { connect } from 'react-redux'
import lodash from 'lodash'
import TextFieldGroup from '../../common/TextFieldGroup'
import { addFlashMessage } from '../../../actions/flashMessagesActions';
import { viewUsersRequest,createUserRequest } from '../../../actions/adminActions'
import { setTableState } from '../../../actions/tableActions';

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
        this._cancelForm = this._cancelForm.bind(this);
        this._confirmAddUser = this._confirmAddUser.bind(this);
    }

    componentWillMount(){
        viewUsersRequest()
        .then((response)=>{
            var usersServer = response.data.users;
            this.props.dispatch(setTableState({
                content : usersServer,
            }));
        })
        .catch((response)=>{
            this.props.dispatch(addFlashMessage({
                type:"error",
                text:"cannot get the users from server"
            }));
        });
    }


    _confirmAddUser(newUser){
        var _content = this.props.table.content;
        if (lodash.isEmpty(_content)){
            _content[0] = newUser;    
        } else {
            var aux = 0;
            var max = -99999;
            for(var prop in _content) {
                aux = parseInt(prop);
                if (aux > max){
                    max = aux;
                }
            }
            _content[max+1] = {
                category : newUser.category,
                email : newUser.email,
                password : newUser.password
            };
        }
        
        this.props.dispatch(setTableState({
            content: _content,
        }));
   }

    _submitForm(){
        if (this._isValid()){
            var obj = {};
            const email = this.state.email;
            const password = this.state.password;
            const category = parseInt(this.state.category);
            obj["email"] = email;
            obj["password"] = password;
            obj["category"] = category;
            createUserRequest(obj)
            .then((response)=>{
                this.setState({serverMessage : response.data.message, serverStatus:"OK"})
                this._confirmAddUser(obj);
                this._cancelForm();
            })
            .catch((response)=>{
                if (typeof response.response === 'undefined'){
                    this.setState({serverMessage : "network error", serverStatus:"BAD_STATUS"})
                } else {
                    this.setState({serverMessage : response.data.message, serverStatus:"BAD_STATUS"})
                }
                this.props.dispatch(addFlashMessage({
                    type : "error",
                    text : "addUserForm - error server or something"
                }));
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
        if (toReturn && validator.isEmpty(password)){
            toReturn = false;
            _errors["password"] = "the password cannot be empty";
        }
        var _content = this.props.table.content;
        for(var prop in _content) {
            var aux = _content[prop];
            if (aux.email === email){
                toReturn = false;
                _errors["email"] = "this email already exists!";
                break;
            }
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
                    <TextFieldGroup error = { this.state.errors.email }
                                    label="Email"
                                    onChange = { this._onChange }
                                    value = { this.state.email }
                                    field = "email" />
                   <TextFieldGroup  error = { this.state.errors.password }
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

export default connect(mapStateToProps,mapDispatchToProps)(AdminAddUserForm);