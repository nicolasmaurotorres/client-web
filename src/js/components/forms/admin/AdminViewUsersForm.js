import React from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid'
import { BeatLoader } from 'react-spinners'
import { connect } from 'react-redux'
import { ContextMenu, Item, ContextMenuProvider,IconFont } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css' // css del click derecho
import TableAdmin from '../../common/TableAdmin'
import { deleteUserRequest } from '../../../actions/adminActions'
import AdminAddUserForm from './AdminAddUserForm'
import AdminEditUserForm from './AdminEditUserForm'
import { openModal } from '../../../actions/modalActions'
import { addFlashMessage } from '../../../actions/flashMessagesActions'
import { viewUsersRequest } from '../../../actions/adminActions'
import { setTableState } from '../../../actions/tableActions'
import { setSpinnerState } from '../../../actions/spinnerActions';

class AdminViewUsersForm extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            errors: null,
            editedUser : {}
        }

        /*bindings*/
        this._confirmDeleteUser = this._confirmDeleteUser.bind(this);
    }

    componentWillMount(){
        this.props.dispatch(setSpinnerState({
            state:true
        }));
        viewUsersRequest()
        .then((response)=>{
            var usersServer = response.data.users;
            this.props.dispatch(setTableState({
                content : usersServer,
            }));
            this.props.dispatch(setSpinnerState({
                state:false
            }));
        })
        .catch((response)=>{
            this.props.dispatch(addFlashMessage({
                type:"error",
                text:"cannot get the users from server"
            }));
            this.props.dispatch(setSpinnerState({
                state:false
            }));
        });
    }
    
    _confirmDeleteUser(email){
        var obj = {}
        obj["email"] = email;
        this.props.dispatch(setSpinnerState({
            state:true
        }));
        deleteUserRequest(obj)
        .then((response)=>{                         // actualizo los usuarios
            this.props.dispatch(addFlashMessage({
                type:"success",
                text:"user "+email+" deleted"
            }));
            let arr = this.props.table.content;
            arr = arr.filter(e => e.email !== email);
            this.props.dispatch(setTableState({
                content: arr
            }));
            this.props.dispatch(setSpinnerState({
                state:false
            }));
        })
        .catch((response)=>{
            this.props.dispatch(addFlashMessage({
                type:"error",
                text:"pacient "+folderName+" removed"
            }));
            this.props.dispatch(setSpinnerState({
                state:false
            }));
        });
    }

    render(){ 
        const onClickDelete = ({ event, ref, data, dataFromProvider }) => {
            const email = event.target.parentElement.id;
            if (email !== ''){
                this.props.dispatch(openModal({
                    id: uuid.v4(),
                    type: 'confirmation',
                    text: 'Are you sure to delete this user?',
                    onClose: null,
                    onConfirm: () => this._confirmDeleteUser(email),
                }));   
            }
        };

        const onClickAdd = ({event, ref,data,dataFromProvider}) => {
            this.props.dispatch(openModal({
                id: uuid.v4(),
                type: 'custom',
                content: <AdminAddUserForm />,
            }));
        };

        const onClickEdit = ({event, ref,data,dataFromProvider}) => {
            const email = event.target.parentElement.id;
            var aux = event.target.parentElement.children[0].attributes.name
            if (typeof aux !== 'undefined'){
                const password = event.target.parentElement.children[2].children[0].children[0].children[0].value; //obtengo la pass
                const category = parseInt(aux.value); // obtengo el numero de la categoria
                if (email !== ''){ // si el email es distinto de vacio
                    var obj = {};
                    obj["email"] = email;
                    obj["password"] = password;
                    obj["category"] = category;
                    this.props.dispatch(openModal({
                        id: uuid.v4(),
                        type: 'custom',
                        content: <AdminEditUserForm user = { obj } />,
                    }));
                }
            } 
        }

        const MenuFile = () => (
            <ContextMenu  id='rightClickContextMenu'>
                <Item onClick = { onClickAdd }><IconFont className = "fa fa-plus"/> Add </Item>
                <Item onClick = { onClickEdit }><IconFont className = "fa fa-edit"/> Edit </Item>
                <Item onClick = { onClickDelete }><IconFont className = "fa fa-trash"/> Delete </Item>
            </ContextMenu>
        );
        return (
            <div className="bs-docs-section">
                <ContextMenuProvider id = "rightClickContextMenu" >
                    <TableAdmin />
                </ContextMenuProvider>
                <MenuFile/>
            </div>
        );
    }
}

AdminViewUsersForm.contextTypes = {
    router : PropTypes.object.isRequired
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

export default connect(mapStateToProps,mapDispatchToProps)(AdminViewUsersForm);