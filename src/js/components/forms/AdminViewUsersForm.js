import React from 'react'
import PropTypes from 'prop-types'
import { BeatLoader } from 'react-spinners'
import FileBrowserWidget  from 'paraviewweb/src/React/Widgets/FileBrowserWidget';
import { ContextMenu, Item, ContextMenuProvider,IconFont } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css'; // css del click derecho
import confirm from '../../utils/confirmDialog'
import TableAdmin from '../common/TableAdmin';
import ConfirmForm from '../forms/ConfirmForm';
import ModalAddUser from '../modals/ModalAdminAddUser';
import ModalEditUser from '../modals/ModalAdminEditUser'
import { createGzip } from 'zlib';

class AdminViewUsersForm extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            data : [],
            loading: false,
            errors: null,
            showingAddUserModal : false,
            showingEditUserModal: false,
            editedUser : {}
        }

        /*bindings*/
        this._getAllUsers = this._getAllUsers.bind(this);
        this.callbackCreateUser = this.callbackCreateUser.bind(this);
        this.callbackEditUser = this.callbackEditUser.bind(this);
    }

    _getAllUsers(){
        this.setState({ loading : true });
        this.props.viewUsersRequest({ token : localStorage.jwtToken })
        .then((response)=>{
            var usersServer = response.data.users;
            this.setState({data: usersServer, loading: false})
        })
        .catch((response)=>{
            this.props.addFlashMessage({
                type:"error",
                text:"cannot get the users from server"
            });
            this.setState({ loading : false });
        });
    }

    componentWillMount(){
        this._getAllUsers();
    }

    callbackCreateUser(){
        this.setState({showingAddUserModal : false});
        this._getAllUsers();
    }
   
    callbackEditUser(){
        this.setState({showingEditUserModal : false, editedUser : []});
        this._getAllUsers();
    }

    render(){ 
        const columns = ["Category","Email","Password"];
        const { addFlashMessage, deleteUserRequest } = this.props;
        const onClickDelete = ({ event, ref, data, dataFromProvider }) => {
            const email = event.target.parentElement.id;
            if (email !== ''){
                confirm(ConfirmForm,"Warning","Are you sure you want to delete this user?")
                .then((result) => { // `proceed` callback
                    var obj = {}
                    obj["email"] = email;
                    deleteUserRequest(obj)
                    .then((response)=>{                         // actualizo los usuarios
                        addFlashMessage({
                            type:"success",
                            text:"user "+email+" deleted"
                        });
                        let arr = this.state.data;
                        arr = arr.filter(e => e.email !== email);
                        this.setState({ data : arr });
                    })
                    .catch((response)=>{
                        //TODO: fijar si si esta logueado sino mostrar el error
                    });
                },
                (result) => {
                    // `cancel` callback
                    //TODO: fijar si si esta logueado sino mostrar el error
                    }  
                );
            };
        };

        const onClickAdd = ({event, ref,data,dataFromProvider}) => {
            this.setState({ showingAddUserModal : true });
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
                    this.setState({ showingEditUserModal : true, editedUser : obj })
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

         if (this.state.loading){
            return (
                <BeatLoader color =  { '#2FA4E7' } loading = { this.state.loading }/>
            );
         } else 
         if (this.state.showingAddUserModal){
             return (
                <ModalAddUser callbackCreateUser = { this.callbackCreateUser } />
             );
         } else 
         if (this.state.showingEditUserModal){
            return (
                <ModalEditUser callbackEditUser = { this.callbackEditUser } user = { this.state.editedUser }/>
            );
         }
         else {
            return (
                    <div className="bs-docs-section">
                        <ContextMenuProvider id = "rightClickContextMenu" >
                            <TableAdmin columns = { columns } data = { this.state.data } />
                        </ContextMenuProvider>
                        <MenuFile/>
                    </div>
            );
        }
    }
}

AdminViewUsersForm.propTypes = {
    deleteUserRequest : PropTypes.func.isRequired,
    addFlashMessage : PropTypes.func.isRequired,
    viewUsersRequest : PropTypes.func.isRequired
}

AdminViewUsersForm.contextTypes = {
    router : PropTypes.object.isRequired
}

export default AdminViewUsersForm;