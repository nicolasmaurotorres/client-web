import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { BeatLoader } from 'react-spinners'
import FileBrowserWidget  from 'paraviewweb/src/React/Widgets/FileBrowserWidget';
import { ContextMenu, Item, ContextMenuProvider,IconFont } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css'; // css del click derecho
import confirm from '../../utils/confirmDialog'
import Table from '../common/Table';
import ConfirmForm from '../forms/ConfirmForm';

class AdminViewUsersForm extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            data : [],
            loading: false,
            errors: null
        }

        /*bindings*/
        this._getAllUsers = this._getAllUsers.bind(this);
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
   
    render(){ 
        const columns = ["Category","Email"];
        const { createUserRequest, addFlashMessage, deleteUserRequest, editUserRequest, viewUsersRequest } = this.props;
        const onClickDelete = ({ event, ref, data, dataFromProvider }) => {
            const email = event.target.parentElement.id;
            if (email !== ''){
                confirm(ConfirmForm,"Warning","Are you sure you want to delete this user?")
                .then((result) => {
                    // `proceed` callback
                    var obj = {}
                    obj["email"] = email;
                    deleteUserRequest(obj)
                    .then((response)=>{
                        // actualizo los usuarios
                        addFlashMessage({
                            type:"success",
                            text:"user "+email+" deleted"
                        });
                        let arr = this.state.data;
                        arr = arr.filter(e => e.email !== email); // will return ['A', 'C']
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

        const onClickEdit = ({event, ref,data,dataFromProvider}) => {
            var action = event.target.dataset.action;
            switch(action){
                case 'directory': {
                    //TODO: edit directory
                    break;
                }
            }
        }

        const MenuFile = () => (
            <ContextMenu  id='rightClickContextMenu'>
                <Item onClick = { onClickDelete  }><IconFont className="fa fa-trash" /> Delete </Item>
                <Item onClick = { onClickEdit  }><IconFont className="fa fa-edit" /> Edit </Item>
            </ContextMenu>
        );

        if (this.state.loading){
            return (
                <div>
                    <BeatLoader color =  { '#2FA4E7' } loading = { this.state.loading }/>
                </div>
            );
         } else {
            return (
                <div className="bs-docs-section">
                    <ContextMenuProvider id = "rightClickContextMenu" >
                        <Table columns = { columns } data = { this.state.data } />
                    </ContextMenuProvider>
                    <MenuFile/>
                </div>
            );
        }
    }
}

AdminViewUsersForm.propTypes = {
    createUserRequest : PropTypes.func.isRequired,
    deleteUserRequest : PropTypes.func.isRequired,
    editUserRequest: PropTypes.func.isRequired,
    addFlashMessage : PropTypes.func.isRequired,
    viewUsersRequest : PropTypes.func.isRequired
}

export default AdminViewUsersForm;