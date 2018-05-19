import React    from 'react'
import PropTypes from 'prop-types'
import { ContextMenu, Item, ContextMenuProvider,IconFont } from 'react-contexify';
import { connect } from 'react-redux'

import { doctorGetPacients } from '../../actions/doctorActions';
import { addFlashMessage } from '../../actions/flashMessages'
import RemoteRender from '../../renders/RemoteRender'
import TableDoctor from '../common/TableDoctor'

import ModalDoctorAddPacient from '../modals/ModalDoctorAddPacient'

class DoctorLobby extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            rawResponse : {},
            initialLevel : true, // si esta en true, significa que es el nivel inicial y solo son pacientes lo que muestra, es para el click derecho
            isFolder : false,
            idContextText : "rightClickContextMenuPacient",
            showingModalAddPacient: false,
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
        this._callbackAddPacient = this._callbackAddPacient.bind(this);
    }
 
    componentWillMount(){
        const { doctorGetPacients, addFlashMessage } = this.props;
        doctorGetPacients()
            .then((response)=>{
                this.setState({ rawResponse : response.data.folders});
                this._updateTable(response.data.folders);
            })
            .catch((response)=>{
                addFlashMessage({
                    type:"error",
                    text:"cannot get the files from the doctor , error"+response.errorM
                });
            });
    }
    // dado un nodo , actualizo los datos de la tabla
    _updateTable(node){
        this._setPath(node);
        this._setFiles(node);
        this._setFolders(node);
    }
  
    _setPath(resp){
        this.setState({ path : resp.Folder.split('/') });
    }

    _setFiles(resp){
        this.setState({ files: resp.Files });        
    }

    _setFolders(resp){
        var subFolders = [];
        resp.SubFolders.forEach(function(elem){
            var split = elem.Folder.split('/');
            subFolders.push(split[split.length - 1]); // el 0 es el email del doctor --> doctor@doctor.com/paciente2
        });
        this.setState({ folders : subFolders });
    }
  
    _handleClickPath(e){
        debugger;
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
        var pepe = this;
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
    _callbackAddPacient(){
        this.setState({showingModalAddPacient:false});
    }
    /* callbacks */

    
    render(){
        //modal de agregar un paciente
        if (this.state.showingModalAddPacient){
            var othersPacients = {};
            debugger;
            var pacients = this.state.rawResponse.SubFolders;
            for (var i = 0; i < pacients.length ; i++){
                var name = pacients[i].Folder.split("/")[1]; // obtengo el nombre del paciente
                othersPacients[name] = i; 
            }
            return (
                <ModalDoctorAddPacient otherPacients = { othersPacients } callbackAddPacient = { this._callbackAddPacient } />
            );
        }

        // armo los datos de la tabla
        var data = [];
        this.state.folders.forEach((item) => {
            data.push([<IconFont className = "fa fa-folder-o"/> , item, "folder"]);
        });
        this.state.files.forEach((item) => {
            data.push([<IconFont className = "fa fa-file-text-o"/> , item, "file"]);
        });
        // armo el path
        var path = ["/"];
        this.state.path.forEach((item) => {
            path.push(<label key = { item } onClick = { this._handleClickPath } style={{cursor:"pointer"}}>{ item }</label>)
            path.push("/");
        });
        path.pop(); // quito el ultimo "/"
        // context menu del archivo adentro de un paciente
        const onClickRenderFile = ({event, ref,data,dataFromProvider}) => {
            console.log("on click render file");
        };
        const onClickUpgradeFile = ({event, ref,data,dataFromProvider}) => {
            console.log("on click upgrade file");
        };
        const onClickRenameFile = ({event, ref,data,dataFromProvider}) => {
            console.log("on click rename file");
        };
        const onClickCopyFile = ({event, ref,data,dataFromProvider}) => {
            console.log("on click copy file");
        };
        const onClickPasteFile = ({event, ref,data,dataFromProvider}) => {
            console.log("on click paste file");
        };
        const onClickDeleteFile = ({event, ref,data,dataFromProvider}) => {
            console.log("on click delete file");
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
        const onClickAddFolder = ({event, ref,data,dataFromProvider}) => {
            console.log("on click add folder");
        };
        const onClickRenameFolder = ({event, ref,data,dataFromProvider}) => {
            console.log("on click rename folder");
        };
        const onClickCopyFolder = ({event, ref,data,dataFromProvider}) => {
            console.log("on click copy folder");
        };
        const onClickPasteFolder = ({event, ref,data,dataFromProvider}) => {
            console.log("on click paste folder");
        };
        const onClickDeleteFolder = ({event, ref,data,dataFromProvider}) => {
            console.log("on click delete folder");
        };
        const MenuFolder = () => (
            <ContextMenu  id='rightClickContextMenuFolder'>
                <Item onClick = { onClickAddFolder }><IconFont className = "fa fa-plus"/> Add </Item>
                <Item onClick = { onClickRenameFolder }><IconFont className = "fa fa-edit"/> Rename </Item>
                <Item onClick = { onClickCopyFolder }><IconFont className = "fa fa-copy"/> Copy </Item>
                <Item onClick = { onClickPasteFolder }><IconFont className = "fa fa-paste"/> Paste </Item>
                <Item onClick = { onClickDeleteFolder }><IconFont className = "fa fa-trash"/> Delete </Item>
            </ContextMenu>
        );
        // context menu del paciente
        const onClickEditPacient = ({event, ref,data,dataFromProvider}) => {
            console.log("on click edit pacient");
        };
        const onClickDeletePacient = ({event, ref,data,dataFromProvider}) => {
            console.log("on click delete pacient");
        };
        const onClickAddPacient = ({event, ref,data,dataFromProvider}) => {
            console.log("on click add pacient");
            this.setState({showingModalAddPacient : true});
        };
        const MenuPacient = () => (
            <ContextMenu  id='rightClickContextMenuPacient'>
                <Item onClick = { onClickAddPacient }><IconFont className = "fa fa-plus"/> Add </Item>
                <Item onClick = { onClickEditPacient }><IconFont className = "fa fa-edit"/> Rename </Item>
                <Item onClick = { onClickDeletePacient }><IconFont className = "fa fa-trash"/> Delete </Item>
            </ContextMenu>
        );
        const menu =  (this.state.initialLevel) ? <MenuPacient/> :( (this.state.isFolder) ? <MenuFolder/> : <MenuFile/> );
        const idMenu = this.state.idContextText;
        return (
            <div className="jumbotron"> 
                <div> { path } </div>
                <ContextMenuProvider  id = { idMenu }>
                    <TableDoctor data = { data } onClickItems = { this._handleOnClickTableItem } onMouseEnter = { this._onMouseEnterTableItem }/>
                </ContextMenuProvider>
                { menu }
                <button> tocame! :$ </button>
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
}

export default connect(mapStateToProps,{ doctorGetPacients })(DoctorLobby);