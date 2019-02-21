import React    from 'react'
import { ContextMenu, Item, ContextMenuProvider,IconFont } from 'react-contexify'
import { connect } from 'react-redux'
import lodash from 'lodash' 
import PropTypes from 'prop-types'
import shortid from 'shortid'
import { setTableState, setCurrentLevel } from '../../actions/tableActions'
import { openModal } from '../../actions/modalActions'
import { specialistGetPacients, specialistRemoveFile, specialistRemoveFolder } from '../../actions/specialistActions'
import { addFlashMessage } from '../../actions/flashMessagesActions'
import { _getPathAsArray, _getPathAsString, _nextNode, _getFoldersAsArray } from '../../utils/tableFunctions';
import { renderConfig } from '../../config/renderConfig';
import TableSpecialist from '../common/TableSpecialist'
import SpecialistRenameFileForm from '../forms/specialist/SpecialistRenameFileForm'
import SpecialistRenameFolderForm from '../forms/specialist/SpecialistRenameFolderForm'
import SpecialistAddFolderForm from '../forms/specialist/SpecialistAddFolderForm';
import SpecialistAddFileForm from '../forms/specialist/SpecialistAddFileForm';

class SpecialistLobby extends React.Component {
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
        this._onClickAddFile = this._onClickAddFile.bind(this);
        this._onClickAddFolder = this._onClickAddFolder.bind(this);
    }
 
    componentWillMount(){
        specialistGetPacients()
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
        if (!(this.props.table.level.position === 0)){
            if (parent.id.includes("folder")){
                this.setState({isFolder: true, idContextText:"rightClickContextMenuFolder"});
            } else {
                this.setState({isFolder: false, idContextText:"rightClickContextMenuFile"});
            }
        } else {
            this.setState({isFolder: true, idContextText:"rightClickContextMenuPacient"});
        }
    }

    _onClickAddFile(){
        this.props.dispatch(openModal({
            id: shortid.generate(),
            type: 'custom',
            content: <SpecialistAddFileForm />,
        }));
    } 
    
    _onClickAddFolder(){
        this.props.dispatch(openModal({
            id: shortid.generate(),
            type: 'custom',
            content: <SpecialistAddFolderForm/>,
        }));
    } 

    _onConfirmDeleteFile(fileName){
        var obj = {
            file : _getPathAsString(this.props.table.level.path,1) + "/" + fileName
        };
        specialistRemoveFile(obj)
        .then((response)=>{        
            var node = _nextNode(_getPathAsString(this.props.table.level.path),this.props.table.content);
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
        const baseLevel = this.props.table.level.position === 0; 
        var obj = {
            folder : (baseLevel) ? folderName : _getPathAsString(this.props.table.level.path,1) + "/" + folderName
        }
        specialistRemoveFolder(obj)
        .then((response)=>{
            var path = _getPathAsString(this.props.table.level.path);
            var currentNode = _nextNode(path,this.props.table.content);
            for (var prop in currentNode.SubFolders){
                if (currentNode.SubFolders[prop].Folder === path+"/"+folderName){
                    delete currentNode.SubFolders[prop];
                    break;
                }
            }            
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
 
    render(){
        // context menu del archivo adentro de un paciente
        const onClickRenderFile = ({event, ref,data,dataFromProvider}) => {
            var parts = event.target.parentElement.id.split("-");
            var fileName = "";
            for (var i = 1; i < parts.length-1 ; i++){ 
                fileName += parts[i];
            }
            var dataDir = "%2F"+this.props.auth.user.username;
            fileName = _getPathAsString(this.props.table.level.path,1)+"/"+fileName+"."+parts[parts.length-1]; // agrego la extencion y el path al archivo a renderizar, sin el nombre del del email
            this.context.router.history.push({
                pathname: '/specialist/render?dataDir='+renderConfig.dataDir+dataDir,
                state: { dataFile  : fileName,
                        dataDir }
              });
        };
        const onClickUpgradeFile = ({event, ref,data,dataFromProvider}) => {
            //TODO: avisar que se subio el archivo
            console.log("on click upgrade file");
        };
        const onClickRenameFile = ({event, ref,data,dataFromProvider}) => {
            var parts = event.target.parentElement.id.split("-");
            var fileToRename = parts[1]; // le agrego el punto al archivo, aunque solo muestre el nombre
            var fileExt = parts[2]; // extencion del archivo, el usuario final no puede cambiar la extencion del archivo, solo el nombre
            this.props.dispatch(openModal({
                id: shortid.generate(),
                type: 'custom',
                content: <SpecialistRenameFileForm fileToRename = { fileToRename } fileExtension = { fileExt } />,
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
                    id: shortid.generate(),
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
                {/*<Item onClick = { onClickUpgradeFile }><IconFont className = "fa fa-arrow-circle-o-up"/> Upgrade </Item>*/}
                <Item onClick = { onClickRenameFile }><IconFont className = "fa fa-edit"/> Rename </Item>
                {/*<Item onClick = { onClickCopyFile }><IconFont className = "fa fa-copy"/> Copy </Item>
                <Item onClick = { onClickPasteFile }><IconFont className = "fa fa-paste"/> Paste </Item>*/}
                <Item onClick = { onClickDeleteFile }><IconFont className = "fa fa-trash"/> Delete </Item>
            </ContextMenu>
        );
        // context menu de la carpeta adentro de un paciente
        const onClickRenameFolder = ({event, ref,data,dataFromProvider}) => {
            var folder = event.target.parentElement.children[1].innerText; // obtengo el nombre de la carpeta a editar
            this.props.dispatch(openModal({
                id: shortid.generate(),
                type: 'custom',
                content: <SpecialistRenameFolderForm folderToRename = { folder } />,
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
                    id: shortid.generate(),
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
                {/*<Item onClick = { onClickCopyFolder }><IconFont className = "fa fa-copy"/> Copy </Item>
                <Item onClick = { onClickPasteFolder }><IconFont className = "fa fa-paste"/> Paste </Item>*/}
                <Item onClick = { onClickDeleteFolder }><IconFont className = "fa fa-trash"/> Delete </Item>
            </ContextMenu>
        );
        const onClickDeletePacient = ({event, ref,data,dataFromProvider}) => {
            const parts = event.target.parentElement.id.split('-');
            var folderName = "";
            for(var i = 1; i < parts.length; i++){
                folderName += parts[i]+"-"
            }
            folderName = folderName.substring(0, folderName.length-1); // elimino el ultimo "-"
            if (folderName !== ''){
                this.props.dispatch(openModal({
                    id: shortid.generate(),
                    type: 'confirmation',
                    text: 'Are you sure to delete this pacient?',
                    onClose: null,
                    onConfirm: () => this._onConfirmDeleteFolder(folderName),
                }));
            }
        };
        const onClickAddPacient = ({event, ref,data,dataFromProvider}) => {
            this.props.dispatch(openModal({
                id: shortid.generate(),
                type: 'custom',
                content: <SpecialistAddFolderForm/>,
            }));
        };
        const MenuPacient = () => (
            <ContextMenu  id='rightClickContextMenuPacient'>
                <Item onClick = { onClickAddPacient }><IconFont className = "fa fa-plus"/> Add </Item>
                <Item onClick = { onClickRenameFolder }><IconFont className = "fa fa-edit"/> Rename </Item>
                <Item onClick = { onClickDeletePacient }><IconFont className = "fa fa-trash"/> Delete </Item>
            </ContextMenu>
        );

        const menu =  (this.props.table.level.position === 0) ? <MenuPacient/> : ( (this.state.isFolder) ? <MenuFolder/> : <MenuFile/> );
        var nameButton = (this.props.table.level.position === 0) ? "Add pacient" : "Add Folder";
        const addPacientButton = <div className="form-group"> <botton className="btn btn-primary btn-lg" onClick = { this._onClickAddFolder  }> { nameButton }  </botton> </div>;
        const addFileButton = (this.props.table.level.position > 0) ? <div className="form-group"> <botton className="btn btn-primary btn-lg" onClick = { this._onClickAddFile }> Add File </botton> </div>  : null;
        const idMenu = this.state.idContextText;
        
        return (
            <div className="jumbotron fullscreen"> 
                { addPacientButton }
                { addFileButton }
                <ContextMenuProvider  id = { idMenu }>
                    <TableSpecialist onMouseEnter = { this._onMouseEnterTableItem }/>
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

SpecialistLobby.contextTypes = {
    router : PropTypes.object.isRequired
}

export default connect(mapStateToProps,mapDispatchToProps)(SpecialistLobby);