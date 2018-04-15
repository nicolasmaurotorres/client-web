import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { BeatLoader } from 'react-spinners'
import FileBrowserWidget  from 'paraviewweb/src/React/Widgets/FileBrowserWidget';
import { ContextMenu, Item, ContextMenuProvider,IconFont } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css'; // css del click derecho
import confirm from '../../utils/confirmDialog'

class AdminViewUsersForm extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            rawResponse : {},
            actualPath : [],
            actualFiles : [],
            actualDirectorys : []
        }
    }

    componentWillMount(){
        this.setState({loading:true});
        this.props.viewUsersRequest({ token : localStorage.jwtToken })
        .then((response)=>{
            debugger;
            var subFolders = [];
            var users = response.data.users;
            for(var i = 0; i < users.length; i++){
                subFolders.push(users[i]);
            }
            this.setState({ actualDirectorys : subFolders, loading : false, actualFiles : [], actualPath : ["Users"], rawResponse : response.data });
        })
        .catch((response)=>{
            debugger;
            this.setState({ loading : false});
        });
    }
   
    render(){ 
        const { createUserRequest, addFlashMessage, deleteUserRequest, editUserRequest, viewUsersRequest } = this.props;
         /* habilitar context menues */
        const onClickDelete = ({ event, ref, data, dataFromProvider }) => {
            var action = event.target.dataset.action;
            var name = event.target.dataset.name;
            switch(action){
                case 'directory': {
                    confirm("Warning","Are you sure you want to delete this user?")
                    .then(
                        (result) => {
                          // `proceed` callback
                          
                          
                        },
                        (result) => {
                          // `cancel` callback
                          console.log('cancel called');
                          console.log(result)
                        }
                      )
                    break;
                }
                case 'file': {
                    this.props.admin
                    break;
                }
            }
        };
        const onClickEdit = ({event, ref,data,dataFromProvider}) => {
            var action = event.target.dataset.action;
            switch(action){
                case 'directory': {
                    //TODO: edit directory
                    break;
                }
                case 'file': {
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
                <div className="centerComponent">
                    <BeatLoader color =  {'#2FA4E7'} loading = { this.state.loading }/>
                </div>
            );
        } else {
        return (
            <div className="mainLeft"> 
                <ContextMenuProvider id = "rightClickContextMenu" >
                    <FileBrowserWidget  
                        className="FileBrowserWidget"
                        directories = {this.state.actualDirectorys } 
                        files = { this.state.actualFiles }
                        path = { this.state.actualPath  }
                        groups = { [] }
                        />
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