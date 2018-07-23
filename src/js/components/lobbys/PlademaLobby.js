import React from 'react'
import { connect } from 'react-redux';
import uuid from 'uuid'
import { ContextMenu, Item, ContextMenuProvider,IconFont } from 'react-contexify'

import TablePladema from '../common/TablePladema'
import { openModal } from '../../actions/modalActions'
import { plademaGetAllFolders } from '../../actions/plademaActions'
import { setTableState, setCurrentLevel } from '../../actions/tableActions'
import { addFlashMessage } from '../../actions/flashMessages'
import { ModalContainer }  from '../common/Modal';
import ModalPlademaAddFolder from '../modals/pladema/ModalPlademaAddFolder';

class PlademaLobby extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFolder : false,
            idContextText : 'rightClickContextMenuInitialMenuFolder',
        };

        /* bindings */
        this._getFolders = this._getFolders.bind(this);
        this._getFiles = this._getFiles.bind(this);
        this._getPath = this._getPath.bind(this);
        this._hoverTableItem = this._hoverTableItem.bind(this);
        /*callbacks*/
        this._callbackAddFolder = this._callbackAddFolder.bind(this);
    }

    componentWillMount() {
        var params = {
            emails:[]
        };
        plademaGetAllFolders(params)
        .then((response)=>{
            var rawResponse = response.data.folders;
            var auxFolders = [];
            rawResponse.forEach(function(elem){
                auxFolders.push(elem.Folder);
            });
            this.props.dispatch(setTableState({
                content : rawResponse,
            }));
            this.props.dispatch(setCurrentLevel({
                path : [],
                files : [],
                folders : auxFolders,
                position : 0
            }));
        }).catch((response) =>{
            console.log(response);
            this.props.dispatch(addFlashMessage({
                text : "cannot get the folders, please relog "+response.message,
                type : "error"
            }))
        });
    }
    
    _hoverTableItem(e){
        //cada vez que paso el mouse por encima de algo, cambio los menues que se muestran
        var parent = e.target.parentElement;
        if (this.state.initialLevel){
            this.setState({isFolder: true, idContextText:"rightClickContextMenuInitialMenuFolder"});
        } else {
            if (parent.id.includes("folder")){
                this.setState({isFolder: true, idContextText:"rightClickContextMenuNotInitialMenuFolder"});
            } else {
                this.setState({isFolder: false, idContextText:"rightClickContextMenuNotInitialMenuFile"});
                }
        }
    }
   
    _getPath(){
        var toReturn = "";
        for(var i = 0; i < this.props.table.level.path.length; i++){
            toReturn = toReturn + this.props.table.level.path[i] + "/";
        }
        toReturn = toReturn.substring(0,toReturn.length-1); // quito el ultimo /
        return toReturn;
    }

    _getFiles(){
        var toReturn = {};
        for (var i = 0; i < this.props.table.level.files.length; i++){
            toReturn[this.props.table.level.files[i]] = i;
        }
        return toReturn;
    }

    _getFolders(){
        var toReturn = {};
        for (var i = 0; i < this.state.folders.length; i++){
            toReturn[this.state.folders[i]] = i;
        }
        return toReturn;
    }

    _callbackAddFolder(update,newName){
        if (update === true){
            var found = false;
            var currentPath = this._getPath();
            var currentRawResponse = this.state.rawResponse;
            var aux = null;
            for (var i = 0; i < currentRawResponse.length && !found; i++){
                aux = this._nextNode(currentPath,currentRawResponse[i]);
                if (aux !== null){
                    found = true;
                }
            }
            var newFolder = {
                Files:[],
                Folder:currentPath+"/"+newName,
                SubFolders:[]
            }
            aux.SubFolders.push(newFolder);
            this._updateTable(aux);
        }
    }

    render() {
        const onClickAddFolder = ({event, ref,data,dataFromProvider}) => {
            this.props.dispatch(openModal({
                id: uuid.v4(),
                type: 'custom',
                content: <ModalPlademaAddFolder path = { this._getPath() } folders = { this._getFolders() } files = { this._getFiles() }/>,
                callback : this._callbackAddFolder 
            }));
        }; 

        const onClickUploadFile = ({event, ref,data,dataFromProvider}) => {
            console.log('click on upload file');
        }; 
        
        const onClickDownloadFile = ({event, ref,data,dataFromProvider}) => {
            console.log('click on download file');
        }; 

        const NotInitialMenuFolder = () => (
            <ContextMenu  id='rightClickContextMenuNotInitialMenuFolder'>
                <Item onClick = { onClickUploadFile }><IconFont className = "fa fa-upload"/> Upload File </Item>
                <Item onClick = { onClickAddFolder }><IconFont className = "fa fa-plus"/> Create Folder </Item>
            </ContextMenu>
        );

        const NotInitialMenuFile = () => (
            <ContextMenu  id='rightClickContextMenuNotInitialMenuFile'>
                <Item onClick = { onClickDownloadFile }><IconFont className = "fa fa-download"/> Download </Item>
                <Item onClick = { onClickAddFolder }><IconFont className = "fa fa-plus"/> Create Folder </Item>
            </ContextMenu>
        );
        const idMenu = this.state.idContextText;
        const menu = (this.props.table.level.position < 2) ? null : ((this.state.isFolder) ? <NotInitialMenuFolder />: <NotInitialMenuFile />)
        return (
            <div>
                <ContextMenuProvider  id = { idMenu }>
                    <TablePladema onMouseEnter = { this._hoverTableItem }/>
                </ContextMenuProvider>
                { menu }
                <ModalContainer />
            </div> 
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
      dispatch,
    }
};

function mapStateToProps(state){
    return {
        table : state.table,
        level : state.table.level,
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(PlademaLobby);