import React    from 'react'
import PropTypes from 'prop-types'
import { ContextMenu, Item, ContextMenuProvider,IconFont } from 'react-contexify'
import { connect } from 'react-redux'

import { doctorGetPacients, doctorRemovePacient,doctorRemoveFile, doctorRemoveFolder } from '../../actions/doctorActions'
import { addFlashMessage } from '../../actions/flashMessages'
import confirm from '../../utils/confirmDialog'
import TableDoctor from '../common/TableDoctor'
import ConfirmForm from '../forms/ConfirmForm';
import ModalDoctorAddPacient from '../modals/ModalDoctorAddPacient'
import ModalDoctorRenamePacient from '../modals/ModalDoctorRenamePacient'
import ModalDoctorAddFolder from '../modals/ModalDoctorAddFolder'
import ModalDoctorAddFile from '../modals/ModalDoctorAddFile'
import ModalDoctorRenameFolder from '../modals/ModalDoctorRenameFolder'
import ModalDoctorRenameFile from '../modals/ModalDoctorRenameFile'

class DoctorLobby extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            initialLevel : true, // si esta en true, significa que es el nivel inicial y solo son pacientes lo que muestra, es para el click derecho
            isFolder : false,
            idContextText : "rightClickContextMenuPacient", // right click context to show
            showingModalAddPacient : false,
            showingModalRenamePacient: false, // modal rename pacient
            pacientToRename: "",
            showingModalAddFolder : false,
            showingModalAddFile : false,
            showingmodalRenameFolder : false, // modal rename folder
            folderToRename : "",
            showingModalRenameFile: false,
            fileToRename: "",
            // state of the table
            rawResponse : {},
            path : [],
            files : [],
            folders: [],
            title : ""
        }
        // bindings
        this._setPath = this._setPath.bind(this);
        this._setFiles = this._setFiles.bind(this);
        this._setFolders = this._setFolders.bind(this);
        this._updateTable = this._updateTable.bind(this);
        this._handleOnClickTableItem = this._handleOnClickTableItem.bind(this);
        this._onMouseEnterTableItem = this._onMouseEnterTableItem.bind(this);
        this._handleClickPath = this._handleClickPath.bind(this);
        this._getPacients = this._getPacients.bind(this);
        this._onClickAddPacient = this._onClickAddPacient.bind(this);
        this._onClickAddFolder = this._onClickAddFolder.bind(this);
        this._onClickAddFile = this._onClickAddFile.bind(this);
        this._callbackAddPacient = this._callbackAddPacient.bind(this);
        this._callbackRenamePacient = this._callbackRenamePacient.bind(this);
        this._callbackAddFolder = this._callbackAddFolder.bind(this);
        this._callbackAddFile = this._callbackAddFile.bind(this);
        this._callbackRenameFolder = this._callbackRenameFolder.bind(this);
        this._callbackRenameFile = this._callbackRenameFile.bind(this);
        this._getCurrentPath = this._getCurrentPath.bind(this);
        this._getCurrentFolders = this._getCurrentFolders.bind(this);
        this._getCurrentFiles = this._getCurrentFiles.bind(this);
    }
 
    _getPacients(){
        const { doctorGetPacients, addFlashMessage } = this.props;
        doctorGetPacients()
            .then((response)=>{
                this.setState({ rawResponse : response.data.folders});
                this._updateTable(response.data.folders);
            })
            .catch((response)=>{
                addFlashMessage({
                    type:"error",
                    text:"error "+response.response.data.message
                });
            });
    }

    componentWillMount(){
        this._getPacients();
    }
    /**
    * Dado un nodo , actualizo los datos de la tabla
    * 
    * @param {number} first Path de la carpeta
    * @param {number} second arbol a buscar
    * @returns {number} nodo donde esta la carpeta
    */
    _updateTable(node){
        this._setPath(node);
        this._setFiles(node);
        this._setFolders(node);
    }
    
    _setPath(resp){
        this.setState({ path : resp.Folder.split('/') });
    }

    _getCurrentPath(){
        var toReturn = "";
        for(var i = 1; i < this.state.path.length; i++){ // quito el email
            toReturn = toReturn + this.state.path[i] + "/";
        }
        return toReturn;
    }
    
    _setFiles(resp){
        this.setState({ files: resp.Files });        
    }

    _getCurrentFiles(){ // devuelve un hash con los nombres de los archivos
        var toReturn = {};
        for (var i = 0; i < this.state.files.length; i++){
            toReturn[this.state.files[i]] = i;
        }
        return toReturn;
    }

    _setFolders(resp){
        var subFolders = [];
        resp.SubFolders.forEach(function(elem){
            var split = elem.Folder.split('/');
            subFolders.push(split[split.length - 1]); // el 0 es el email del doctor --> doctor@doctor.com/paciente2
        });
        this.setState({ folders : subFolders });
    }

    _getCurrentFolders(){ // devuelve un hash con los nombres de los archivos
        var toReturn = {};
        for (var i = 0; i < this.state.folders.length; i++){
            toReturn[this.state.folders[i]] = i;
        }
        return toReturn;
    }
  
    _handleClickPath(e){
        var target = e.target.innerText; // un item del path clickeado, vuelvo a esa carpeta
        var index = this.state.path.indexOf(target);
        var nextTarget = "";
        for(var i = 0; i < index; i++){
            nextTarget = nextTarget + this.state.path[i] + "/";
        }
        nextTarget = nextTarget + target;
        var nextNode = this._nextNode(nextTarget,this.state.rawResponse); // busco la carpeta para abrirla
        this._updateTable(nextNode);
        
        if (index === 0){
            //click en el principio de todo, vuelvo al estado inicial.
            this.setState({initialLevel:true, idContextText:"rightClickContextMenuPacient"});
        }
    }

    /**
    * Dado un path de carpeta devuelve el nodo donde esta es esa carpetaen el arbol
    * 
    * @param {number} first Path de la carpeta
    * @param {number} second arbol a buscar
    * @returns {number} nodo donde esta la carpeta
    */
    _nextNode(name,node) {
        if (node.Folder === name){
            return node;
        }
        for(var i = 0; i < node.SubFolders.length; i++){
            var aux = this._nextNode(name,node.SubFolders[i]);
            if (aux != null){
                return aux
            }
        }
    }

    _handleOnClickTableItem(e){
        var parent = e.target.parentElement;
        var idArray = parent.id.split("-"); 
        var nameTarget = "";
        for (var i = 1; i < idArray.length; i++){ // el nombre del archivo o carpeta puede contener "-", pero el primer elemento (0), es el folder ó file element
            nameTarget = nameTarget + idArray[i] + "-";
        }
        nameTarget = nameTarget.substr(0,nameTarget.length - 1); // quito el ultimo "-"
        if (this.state.initialLevel){
            switch (idArray[0]){
                case "folder":{
                    // estoy en el nivel inicial, cambio a una subcarpeta
                    this.setState({initialLevel : false});
                    const { username } = this.props.auth.user;
                    nameTarget = username + "/" + nameTarget;
                    var nextNode = this._nextNode(nameTarget,this.state.rawResponse); // busco la carpeta para abrirla
                    this._updateTable(nextNode);
                    break;
                }
                case "file":
                    console.log("en teoria no tendria que haber ningun archivo sin paciente!");
                    break;
            }
        } else {
            // tengo que armar el path
            var path = "";
            for (var i = 0; i < this.state.path.length; i++){
                path = path + this.state.path[i] + "/";
            }
            path = path + nameTarget;
            switch (idArray[0]){
                case "folder":{
                    var nextNode = this._nextNode(path,this.state.rawResponse); // busco la carpeta para abrirla
                    this._updateTable(nextNode);
                    break;
                }
                case "file":{
                    console.log("no es el nivel inicial y clikeaste un archivo");
                    break;
                }
            }
        }
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
    _callbackAddPacient(updatePacients){
        this.setState({showingModalAddPacient:false});
        if(updatePacients){
            this._getPacients(); // TODO: agregar el paciente en vez de hacer un request para evitar el uso de la red
        }
    }
    _callbackRenamePacient(updatePacients){
        this.setState({showingModalRenamePacient:false, pacientToRename:""});
        if (updatePacients){
            this._getPacients(); // TODO: modificar el paciente en vez de hacer un request para evitar el uso de la red
        }
    }

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

    _callbackRenameFolder(updateFolder,newFolderName,oldFolderName){
        this.setState({showingmodalRenameFolder:false});
        if (updateFolder){
            const { username } = this.props.auth.user;
            var previousFolder = username+"/";
            var split = oldFolderName.split("/");
            for (var i = 0; i < split.length-1; i++){ // me paro en la carpeta que lo contiene al viejo nombre
                previousFolder += split[i] + "/";
            }
            previousFolder = previousFolder.substring(0,previousFolder.length-1);  // quito el ultimo /
            var nextNode = this._nextNode(previousFolder,this.state.rawResponse);
            var toRename = username+"/"+oldFolderName;
            var newNameFolder = username+"/"+newFolderName;
            var found = false;
            for (var i = 0; !found && i < nextNode.SubFolders.length;i++){
                if (nextNode.SubFolders[i].Folder === toRename){
                    nextNode.SubFolders[i].Folder = newNameFolder;
                    found = true;
                }
            }
            this._updateTable(nextNode);
        }
    }   

    _callbackRenameFile(update,newFileName,oldFileName){
        this.setState({showingModalRenameFile:false});
        if (update){
            const { username } = this.props.auth.user;
            var actualPath = username+"/"+this._getCurrentPath();
            actualPath = actualPath.substring(0,actualPath.length-1); // quito el ultimo "/""
            var node = this._nextNode(actualPath,this.state.rawResponse);
            var found = false;
            for (var i = 0; i < node.Files.length && !found; i++){
                if (node.Files[i] === oldFileName){
                    node.Files[i] = newFileName;
                    found = true;
                }
            }
            this._updateTable(node);
        }
    }

    /* callbacks */

    _onClickAddPacient(){
        this.setState({showingModalAddPacient : true});
    }
    
    _onClickAddFolder(){
        this.setState({showingModalAddFolder  : true});
    } 

    _onClickAddFile(){
        this.setState({showingModalAddFile : true});
    }

    render(){
        // context menu del archivo adentro de un paciente
        const onClickRenderFile = ({event, ref,data,dataFromProvider}) => {
            console.log("on click render file");
        };
        const onClickUpgradeFile = ({event, ref,data,dataFromProvider}) => {
            console.log("on click upgrade file");
        };
        const onClickRenameFile = ({event, ref,data,dataFromProvider}) => {
            var fileToRename = event.target.parentElement.id.split("-");
            var fileToRename = fileToRename[1]+"."+fileToRename[2]; // le agrego el punto al archivo, aunque solo muestre el nombre
            this.setState({showingModalRenameFile:true,fileToRename});
        };
        const onClickCopyFile = ({event, ref,data,dataFromProvider}) => {
            console.log("on click copy file");
        };
        const onClickPasteFile = ({event, ref,data,dataFromProvider}) => {
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
                const { doctorRemoveFile } = this.props;
                confirm(ConfirmForm,"Warning","Are you sure you want to remove this file?").then(
                    (result) =>  { // `proceed` callback
                        var obj = {}
                       var path = this._getCurrentPath();
                        obj["file"] = path+fileName;
                        doctorRemoveFile(obj)
                        .then((response)=>{                         // actualizo los usuarios
                            addFlashMessage({
                                type:"success",
                                text:"file "+fileName+" removed"
                            });
                            this._getPacients(); 
                        })
                        .catch((response)=>{
                        });
                    },
                    (result) => {
                        // `cancel` callback
                        //TODO: fijar si si esta logueado sino mostrar el error
                    }
                );
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
            var target = event.target.parentElement.children[1].innerText; // obtengo el nombre de la carpeta a editar
            this.setState({showingmodalRenameFolder : true, folderToRename : target});
        };
        const onClickCopyFolder = ({event, ref,data,dataFromProvider}) => {
            console.log("on click copy folder");
        };
        const onClickPasteFolder = ({event, ref,data,dataFromProvider}) => {
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
                const { doctorRemoveFolder } = this.props;
                confirm(ConfirmForm,"Warning","Are you sure you want to remove this folder?").then(
                    (result) =>  { // `proceed` callback
                       var obj = {}
                       var path = this._getCurrentPath();
                        obj["folder"] = path+folderName;
                        doctorRemoveFolder(obj)
                        .then((response)=>{       
                            // actualizo los usuarios
                            addFlashMessage({
                                type:"success",
                                text:"file "+folderName+" removed"
                            });
                            this._getPacients(); 
                        })
                        .catch((response)=>{
                        });
                    },
                    (result) => {
                        // `cancel` callback
                        //TODO: fijar si si esta logueado sino mostrar el error
                    }
                );                
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
            this.setState({showingModalRenamePacient : true, pacientToRename : target});
        };
        const onClickDeletePacient = ({event, ref,data,dataFromProvider}) => {
            const parts = event.target.parentElement.id.split('-');
            var folderName = "";
            for(var i = 1; i < parts.length; i++){
                folderName += parts[i]+"-"
            }
            folderName = folderName.substring(0, folderName.length-1); // elimino el ultimo "-"
            if (folderName !== ''){
                const { doctorRemovePacient } = this.props;
                confirm(ConfirmForm,"Warning","Are you sure you want to remove this pacient?").then(
                    (result) =>  { // `proceed` callback
                        var obj = {}
                        obj["folder"] = folderName;
                        doctorRemovePacient(obj)
                        .then((response)=>{                         // actualizo los usuarios
                            addFlashMessage({
                                type:"success",
                                text:"pacient "+folderName+" removed"
                            });
                            this._getPacients(); 
                        })
                        .catch((response)=>{

                        });
                    },
                    (result) => {
                        // `cancel` callback
                        //TODO: fijar si si esta logueado sino mostrar el error
                    }
                );
            };
        };
        const onClickAddPacient = ({event, ref,data,dataFromProvider}) => {
            this._onClickAddPacient();
        };
        const MenuPacient = () => (
            <ContextMenu  id='rightClickContextMenuPacient'>
                <Item onClick = { onClickAddPacient }><IconFont className = "fa fa-plus"/> Add </Item>
                <Item onClick = { onClickEditPacient }><IconFont className = "fa fa-edit"/> Rename </Item>
                <Item onClick = { onClickDeletePacient }><IconFont className = "fa fa-trash"/> Delete </Item>
            </ContextMenu>
        );

        //modal renombrar un archivo
        if (this.state.showingModalRenameFile){
            var fileSplited = this.state.fileToRename.split(".");
            var fileToRename = fileSplited[0]; // solo el nombre del archivo
            var fileExt = fileSplited[1]; // extencion del archivo, el usuario final no puede cambiar la extencion del archivo, solo el nombre
            var currentPath = this._getCurrentPath();
            var currentFiles = this._getCurrentFiles();
            var currentFolder = this._getCurrentFolders();
            return (
                <ModalDoctorRenameFile fileExtension = { fileExt } fileToRename = { fileToRename } otherFiles = { currentFiles } otherFolders = { currentFolder } actualPath = { currentPath } callbackRenameFile = { this._callbackRenameFile }/>
            );
        }

        //modal renombrar una carpeta 
        if (this.state.showingmodalRenameFolder){
            var folderToRename = this.state.folderToRename;
            var currentPath = this._getCurrentPath();
            var currentFiles = this._getCurrentFiles();
            var currentFolders = this._getCurrentFolders();
            return (
                <ModalDoctorRenameFolder otherFolders = { currentFolders } otherFiles = { currentFiles } folderToRename = { folderToRename } actualPath = { currentPath } callbackRenameFolder = { this._callbackRenameFolder } />
            );
        }

        //modal de agregar un paciente
        if (this.state.showingModalAddPacient){
            var othersPacients = {};
            var pacients = this.state.rawResponse.SubFolders;
            for (var i = 0; i < pacients.length ; i++){
                var name = pacients[i].Folder.split("/")[1]; // obtengo el nombre de todos los paciente
                othersPacients[name] = i; 
            }
            return (
                <ModalDoctorAddPacient otherPacients = { othersPacients }  callbackAddPacient = { this._callbackAddPacient } />
            );
        }

        //modal renombrar un paciente
        if (this.state.showingModalRenamePacient){
            var pacientToRename = this.state.pacientToRename;
            var othersPacients = {};
            var pacients = this.state.rawResponse.SubFolders;
            for (var i = 0; i < pacients.length ; i++){
                var name = pacients[i].Folder.split("/")[1]; // obtengo el nombre de los otros pacientes
                othersPacients[name] = i; 
            }
            return (
                <ModalDoctorRenamePacient otherPacients = { othersPacients } pacientToRename = { pacientToRename } callbackRenamePacient = { this._callbackRenamePacient } />
            );
        }

        // modal agregar una carpeta en un paciente
        if (this.state.showingModalAddFolder){
            var actualPath = "";
            var files = {};
            for (var i = 0; i < this.state.files.length; i++){
                var file = this.state.files[i];
                files[file] = i;
            }
            var folders = {};
            for (var i = 0; i < this.state.folders.length; i++){
                var folder = this.state.folders[i];
                folders[folder] = i;
            }
            for (var i = 1; i < this.state.path.length; i++){
                actualPath += this.state.path[i] + "/"
            }

            return (
                <ModalDoctorAddFolder  otherFiles = { files } otherFolders = { folders } path = { actualPath } callbackAddFolder = { this._callbackAddFolder }/>
            );
        }

        // modal para agregar un archivo en una carpeta adentro de un paciente
        if (this.state.showingModalAddFile){
            var actualPath = "";
            var files = {};
            var folders = {};

            for (var i = 0; i < this.state.files.length; i++){
                var file = this.state.files[i];
                files[file] = i;
            }
            
            for (var i = 0; i < this.state.folders.length; i++){
                var folder = this.state.folders[i];
                folders[folder] = i;
            }

            for (var i = 1; i < this.state.path.length; i++){
                actualPath += this.state.path[i] + "/"
            }
            actualPath = actualPath.substring(0,actualPath.length-1); // quito el ultimo /
            return (
                <ModalDoctorAddFile otherFiles = { files } otherFolders = { folders }  actualPath = { actualPath } callbackAddFile = { this._callbackAddFile }/>
            );
        }

        const menu =  (this.state.initialLevel) ? <MenuPacient/> : ( (this.state.isFolder) ? <MenuFolder/> : <MenuFile/> );
        const addPacientButton = (this.state.initialLevel) ? <div className="form-group"> <botton className="btn btn-primary btn-lg" onClick = { this._onClickAddPacient  }> Add pacient </botton> </div> : null;
        const addFolderButton = (!this.state.initialLevel) ? <div className="form-group"> <botton className="btn btn-primary btn-lg" onClick = { this._onClickAddFolder }> Add Folder </botton>  </div> : null;
        const addFileButton = (!this.state.initialLevel) ? <div className="form-group"> <botton className="btn btn-primary btn-lg" onClick =   { this._onClickAddFile }> Add File </botton> </div>  : null;
        const idMenu = this.state.idContextText;
        
        // armo los datos de la tabla
        var data = [];
        this.state.folders.forEach((item) => {
            data.push([<IconFont className = "fa fa-folder-o"/> , item, "folder"]);
        });
        this.state.files.forEach((item) => {
            var dataSplitted = item.split(".")
            var name = dataSplitted[0];
            var extention = dataSplitted[1];
            data.push([<IconFont className = "fa fa-file-text-o"/> , name, "file",extention]);
        });
        // armo el path
        var path = ["/"];
        this.state.path.forEach((item) => {
            path.push(<label key = { item } onClick = { this._handleClickPath } style={{cursor:"pointer"}}>{ item }</label>)
            path.push("/");
        });
        path.pop(); // quito el ultimo "/"

        return (
            <div className="jumbotron"> 
                { addPacientButton }
                { addFolderButton }
                { addFileButton }
                <div> { path } </div>
                <ContextMenuProvider  id = { idMenu }>
                    <TableDoctor data = { data } onClickItems = { this._handleOnClickTableItem } onMouseEnter = { this._onMouseEnterTableItem }/>
                </ContextMenuProvider>
                { menu }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

DoctorLobby.propTypes = {
    auth : PropTypes.object.isRequired,
    doctorGetPacients : PropTypes.func.isRequired,
    doctorRemovePacient : PropTypes.func.isRequired,
}

export default connect(mapStateToProps,{ doctorGetPacients, doctorRemovePacient, doctorRemoveFile,doctorRemoveFolder })(DoctorLobby);