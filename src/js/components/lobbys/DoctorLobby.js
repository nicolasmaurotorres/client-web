import React    from 'react'
import { ContextMenu, Item, ContextMenuProvider,IconFont } from 'react-contexify'
import { connect } from 'react-redux'
import uuid from 'uuid'
import lodash from 'lodash' 

import { setTableState, setCurrentLevel } from '../../actions/tableActions'
import { doctorGetPacients, doctorRemovePacient, doctorRemoveFile, doctorRemoveFolder } from '../../actions/doctorActions'
import { addFlashMessage } from '../../actions/flashMessages'
import { _getPathAsArray, _getPathAsString, _nextNode, _getFoldersAsArray } from '../../utils/tableFunctions';
import TableDoctor from '../common/TableDoctor'
import DoctorRenameFileForm from '../forms/DoctorRenameFileForm'
import DoctorRenameFolderForm from '../forms/DoctorRenameFolderForm'
import DoctorRenamePacientForm from '../forms/DoctorRenamePacientForm';
import DoctorAddPacientForm from '../forms/DoctorAddPacientForm';

class DoctorLobby extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            isFolder : false,
            idContextText : "rightClickContextMenuPacient", // right click context to show
        }
        // bindings
        this._onMouseEnterTableItem = this._onMouseEnterTableItem.bind(this);
        this._onConfirmDeleteFolder = this._onConfirmDeleteFolder.bind(this);
        this._onConfirmDeleteFile = this._onConfirmDeleteFile.bind(this);
        this._onConfirmDeletePacient = this._onConfirmDeletePacient.bind(this);
    }
 
    componentWillMount(){
        doctorGetPacients()
        .then((response)=>{
            var rawResponse = response.data.folders;
            this.props.dispatch(setTableState({
                content : rawResponse,
            }));
            var auxFolders = [];
            rawResponse.SubFolders.forEach((item)=>{
                var parts = item.Folder.split("/");
                auxFolders.push(parts[parts.length-1]);
            });
            this.props.dispatch(setCurrentLevel({
                path : [this.props.auth.user.username],
                files : [],
                folders : auxFolders,
                position : 0
            }));
        })
        .catch((response)=>{
            console.log(response.message);
            this.props.dispatch(addFlashMessage({
                type:"error",
                text:"error "+response.message
            }));
        });
    }
  
    _onMouseEnterTableItem(e){
        //cada vez que paso el mouse por encima de algo, cambio los menues que se muestran
        var parent = e.target.parentElement;
        if (!this.state.initialLevel){
            if (parent.id.includes("folder")){
                this.setState({isFolder: true, idContextText:"rightClickContextMenuFolder"});
            } else {
                this.setState({isFolder: false, idContextText:"rightClickContextMenuFile"});
            }
        }
    }

    /* callbacks */
    _callbackAddFolder(updateFolder,newFolder){
        this.setState({showingModalAddFolder:false});
        if (updateFolder){
            var path = "";
            var originalPath = "";
            for (var i = 0 ;  i < this.state.path.length; i++){
                path += this.state.path[i] + "/"
            }
            originalPath = path;
            path = path.substring(0,path.length-1); // quito el ultimo "/"
            var nextNode = this._nextNode(path,this.state.rawResponse);
            var auxNode = {
                Folder : originalPath + newFolder,
                Files : [],
                SubFolders : []
            }
            nextNode.SubFolders.push(auxNode);
            this._updateTable(nextNode);
        }
    }

    _callbackAddFile(updateFolder,newFileName){
        this.setState({showingModalAddFile:false});
        if (updateFolder){
            var path = "";
            for (var i = 0 ;  i < this.state.path.length; i++){
                path += this.state.path[i] + "/"
            }
            path = path.substring(0,path.length-1); // quito el ultimo "/"
            var nextNode = this._nextNode(path,this.state.rawResponse);
            nextNode.Files.push(newFileName);
            this._updateTable(nextNode);
        }
    }
    /*callbacks*/   

    _onConfirmDeleteFile(fileName){
        var obj = {}
        var path = _getPathAsString(this.props.table.level.path);
        obj["file"] = path+"/"+fileName;
        doctorRemoveFile(obj)
        .then((response)=>{                         
            var content = this.props.table.content;
            var node = _nextNode(currentPath,content);
            node.Files = lodash.pull(node.Files,fileName); // quito el fileName
            this.props.dispatch(setCurrentLevel({
                path : this.props.table.level.path,
                files :  node.Files,
                folders : this.props.table.level.folders,
                position :  this.props.table.level.position
            }));
            this.props.dispatch(addFlashMessage({
                type:"success",
                text:"file "+fileName+" removed"
            }));
        })
        .catch((response)=>{
            this.props.dispatch(addFlashMessage({
                type:"error",
                text:"can't delete the file "+fileName
            }));
        });
    }

    _onConfirmDeleteFolder(folderName){
        var obj = {}
        var path = this._getCurrentPath();
        obj["folder"] = path+folderName;
        doctorRemoveFolder(obj)
        .then((response)=>{ 
            var pathAsArray = _getPathAsArray(this.props.table.level.path);
            pathAsArray = pathAsArray.slice(0,pathAsArray.length-1); // me paro una carpeta antes
            var path = _getPathAsString(pathAsArray);
            var currentNode = _nextNode(path,this.props.table.content);
            var i = 0;
            currentNode.SubFolders = lodash.pull(currentNode.SubFolders,folderName);
            this.props.dispatch(setCurrentLevel({
                path : this.props.table.level.path,
                files :  this.props.table.level.files,
                folders : _getFoldersAsArray(currentNode),
                position :  this.props.table.level.position
            }));
            this.props.dispatch(addFlashMessage({
                type:"success",
                text:"file "+folderName+" removed"
            }));
        })
        .catch((response)=>{
            this.props.dispatch(addFlashMessage({
                type:"error",
                text:"network error or server error _onConfirmDeleteFolder"
            }));
        });
    }

    _onConfirmDeletePacient(folderName){
        var obj = {}
        obj["folder"] = folderName;
        doctorRemovePacient(obj)
        .then((response)=>{// actualizo los usuarios
            var pathAsArray = _getPathAsArray(this.props.table.level.path);
            pathAsArray = pathAsArray.slice(0,pathAsArray.length-1); // me paro una carpeta antes
            var path = _getPathAsString(pathAsArray);
            var currentNode = _nextNode(path,this.props.table.content);
            var i = 0;
            currentNode.SubFolders = lodash.pull(currentNode.SubFolders,folderName);
            this.props.dispatch(openModal({
                path : this.props.table.level.path,
                files : this.props.table.level.files,
                folders : _getFoldersAsArray(currentNode),
                position :  this.props.table.level.position
            }));
            this.props.dispatch(addFlashMessage({
                type:"success",
                text:"pacient "+folderName+" removed"
            }));
        })
        .catch((response)=>{

        });
    }
 
    render(){
        // context menu del archivo adentro de un paciente
        const onClickRenderFile = ({event, ref,data,dataFromProvider}) => {
            //TODO: hacer renderizarlo
            console.log("on click render file");
        };
        const onClickUpgradeFile = ({event, ref,data,dataFromProvider}) => {
            //TODO: avisar que se subio el archivo
            console.log("on click upgrade file");
        };
        const onClickRenameFile = ({event, ref,data,dataFromProvider}) => {
            var fileToRename = event.target.parentElement.id.split("-");
            var fileToRename = fileToRename[1]+"."+fileToRename[2]; // le agrego el punto al archivo, aunque solo muestre el nombre
            var fileSplited = this.state.fileToRename.split(".");
            var fileToRename = fileSplited[0]; // solo el nombre del archivo
            var fileExt = fileSplited[1]; // extencion del archivo, el usuario final no puede cambiar la extencion del archivo, solo el nombre
            this.props.dispatch(openModal({
                id: uuid.v4(),
                type: 'custom',
                content: <DoctorRenameFileForm fileToRename = { fileToRename } fileExtension = { fileExt } />,
            }));
        };
        const onClickCopyFile = ({event, ref,data,dataFromProvider}) => {
            // TODO: falta hacer copy file
            console.log("on click copy file");
        };
        const onClickPasteFile = ({event, ref,data,dataFromProvider}) => {
            // TODO: falta hacer paste file
            console.log("on click paste file");
        };
        const onClickDeleteFile = ({event, ref,data,dataFromProvider}) => {
            const parts = event.target.parentElement.id.split('-');
            var fileName = "";
            for(var i = 1; i < parts.length-1; i++){//arranco de 1 por que 0 es el file/folder
                fileName += parts[i]+"-";
            }
            fileName = fileName.substring(0, fileName.length-1); // elimino el ultimo "-"
            fileName = fileName+"."+parts[parts.length-1]; // agrego la extencion
            if (fileName !== ''){
                this.props.dispatch(openModal({
                    id: uuid.v4(),
                    type: 'confirmation',
                    text: 'Are you sure to delete this file?',
                    onClose: null,
                    onConfirm: () => this._onConfirmDeleteFile(fileName),
                  }));
            };

        };
        const MenuFile = () => (
            <ContextMenu  id='rightClickContextMenuFile'>
                <Item onClick = { onClickRenderFile }><IconFont className = "fa fa-play"/> Render </Item>
                <Item onClick = { onClickUpgradeFile }><IconFont className = "fa fa-arrow-circle-o-up"/> Upgrade </Item>
                <Item onClick = { onClickRenameFile }><IconFont className = "fa fa-edit"/> Rename </Item>
                <Item onClick = { onClickCopyFile }><IconFont className = "fa fa-copy"/> Copy </Item>
                <Item onClick = { onClickPasteFile }><IconFont className = "fa fa-paste"/> Paste </Item>
                <Item onClick = { onClickDeleteFile }><IconFont className = "fa fa-trash"/> Delete </Item>
            </ContextMenu>
        );
        // context menu de la carpeta adentro de un paciente
        const onClickRenameFolder = ({event, ref,data,dataFromProvider}) => {
            var folder = event.target.parentElement.children[1].innerText; // obtengo el nombre de la carpeta a editar
            this.props.dispatch(openModal({
                id: uuid.v4(),
                type: 'custom',
                content: <DoctorRenameFolderForm folderToRename = { folder } />,
            }));
        };
        const onClickCopyFolder = ({event, ref,data,dataFromProvider}) => {
            //TODO: hacer el copy folder
            console.log("on click copy folder");
        };
        const onClickPasteFolder = ({event, ref,data,dataFromProvider}) => {
            //TODO: hacer el paste folder
            console.log("on click paste folder");
        };
        const onClickDeleteFolder = ({event, ref,data,dataFromProvider}) => {
            const parts = event.target.parentElement.id.split('-');
            var folderName = "";
            for(var i = 1; i < parts.length; i++){//arranco de 1 por que 0 es el file/folder
                folderName += parts[i]+"-";
            }
            folderName = folderName.substring(0, folderName.length-1); // elimino el ultimo "-"
            if (folderName !== ''){
                this.props.dispatch(openModal({
                    id: uuid.v4(),
                    type: 'confirmation',
                    text: 'Are you sure to delete this folder?',
                    onClose: null,
                    onConfirm: () => this._onConfirmDeleteFolder(folderName),
                }));
            }
        };
        const MenuFolder = () => (
            <ContextMenu  id='rightClickContextMenuFolder'>
                <Item onClick = { onClickRenameFolder }><IconFont className = "fa fa-edit"/> Rename </Item>
                <Item onClick = { onClickCopyFolder }><IconFont className = "fa fa-copy"/> Copy </Item>
                <Item onClick = { onClickPasteFolder }><IconFont className = "fa fa-paste"/> Paste </Item>
                <Item onClick = { onClickDeleteFolder }><IconFont className = "fa fa-trash"/> Delete </Item>
            </ContextMenu>
        );
        // context menu del paciente
        const onClickEditPacient = ({event, ref,data,dataFromProvider}) => {
            var target = event.target.parentElement.children[1].innerText; // obtengo el nombre del paciente a editar
            this.props.dispatch(openModal({
                id: uuid.v4(),
                type: 'custom',
                content: <DoctorRenamePacientForm pacientToRename = { target } />,
            }));
        };
        const onClickDeletePacient = ({event, ref,data,dataFromProvider}) => {
            const parts = event.target.parentElement.id.split('-');
            var folderName = "";
            for(var i = 1; i < parts.length; i++){
                folderName += parts[i]+"-"
            }
            folderName = folderName.substring(0, folderName.length-1); // elimino el ultimo "-"
            if (folderName !== ''){
                this.props.dispatch(openModal({
                    id: uuid.v4(),
                    type: 'confirmation',
                    text: 'Are you sure to delete this pacient?',
                    onClose: null,
                    onConfirm: () => this._onConfirmDeletePacient(folderName),
                }));
            }
        };
        const onClickAddPacient = ({event, ref,data,dataFromProvider}) => {
            this.props.dispatch(openModal({
                id: uuid.v4(),
                type: 'custom',
                content: <DoctorAddPacientForm/>,
            }));
        };
        const MenuPacient = () => (
            <ContextMenu  id='rightClickContextMenuPacient'>
                <Item onClick = { onClickAddPacient }><IconFont className = "fa fa-plus"/> Add </Item>
                <Item onClick = { onClickEditPacient }><IconFont className = "fa fa-edit"/> Rename </Item>
                <Item onClick = { onClickDeletePacient }><IconFont className = "fa fa-trash"/> Delete </Item>
            </ContextMenu>
        );

        const menu =  (this.state.initialLevel) ? <MenuPacient/> : ( (this.state.isFolder) ? <MenuFolder/> : <MenuFile/> );
        const addPacientButton = (this.state.initialLevel) ? <div className="form-group"> <botton className="btn btn-primary btn-lg" onClick = { this._onClickAddPacient  }> Add pacient </botton> </div> : null;
        const addFolderButton = (!this.state.initialLevel) ? <div className="form-group"> <botton className="btn btn-primary btn-lg" onClick = { this._onClickAddFolder }> Add Folder </botton>  </div> : null;
        const addFileButton = (!this.state.initialLevel) ? <div className="form-group"> <botton className="btn btn-primary btn-lg" onClick = { this._onClickAddFile }> Add File </botton> </div>  : null;
        const idMenu = this.state.idContextText;
        
        return (
            <div className="jumbotron"> 
                { addPacientButton }
                { addFolderButton }
                { addFileButton }
                <ContextMenuProvider  id = { idMenu }>
                    <TableDoctor onMouseEnter = { this._onMouseEnterTableItem }/>
                </ContextMenuProvider>
                { menu }
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

export default connect(mapStateToProps,mapDispatchToProps)(DoctorLobby);