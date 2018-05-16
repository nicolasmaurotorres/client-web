import React    from 'react'
import RemoteRender from '../../renders/RemoteRender'
import TableDoctor from '../common/TableDoctor'
import PropTypes from 'prop-types'
import { ContextMenu, Item, ContextMenuProvider,IconFont } from 'react-contexify';
import { connect } from 'react-redux'

class DoctorLobby extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            rawResponse : {},
            initialLevel : true, // si esta en true, significa que es el nivel inicial y solo son pacientes lo que muestra, es para el click derecho
            isFolder : false,
            idContextText : "",
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
        this._handleOnClickItem = this._handleOnClickItem.bind(this);
        this._identifyContextMenu = this._identifyContextMenu.bind(this);
        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._handleClickPath = this._handleClickPath.bind(this);
    }
 
    componentWillMount(){
         // mock-i-to
         var rawResponse =   {
             "Folder": "doctor@doctor.com",
             "Files": [],
             "SubFolders": [{
                 "Folder": "doctor@doctor.com/paciente2",
                 "Files": [],
                 "SubFolders": [{
                         "Folder": "doctor@doctor.com/paciente2/paciente3",
                         "Files": [
                                     "README (copy).txt",
                                     "README.txt",
                                     "imagen_procesada31.vtk"
                                 ],
                         "SubFolders": []
                     },
                     {
                         "Folder": "doctor@doctor.com/paciente2/paciente31",
                         "Files": [
                                     "README.txt"
                                 ],
                         "SubFolders": []
                     },
                     {
                         "Folder": "doctor@doctor.com/paciente2/paciente33",
                         "Files": [
                                     "README.txt"
                                 ],
                         "SubFolders": []
                     }
                 ]},
                 {
                     "Folder": "doctor@doctor.com/paciente31",
                     "Files": [
                             "README.txt",
                             "imagen_procesada.vtk"
                         ],
                     "SubFolders": []
                 }]
      };
      this.setState({ rawResponse : rawResponse});
      this._updateTable(rawResponse);
      // seteo el id del context menu
      this._identifyContextMenu();
    }
    // dado un nodo , actualizo los datos de la tabla
    _updateTable(node){
        this._setPath(node);
        this._setFiles(node);
        this._setFolders(node);
    }
    // inicializacion del me
    _identifyContextMenu(){
        if (this.state.initialLevel) {
            this.setState({idContextText:"rightClickContextMenuPacient"});
        } else {
            if (this.state.isFolder) {
                this.setState({idContextText:"rightClickContextMenuFolder"});
            } else {
                this.setState({idContextText:"rightClickContextMenuFile"});
            }
        }
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
        console.log("click on labelll");
        var target = e.target.innerText; // un item del path clickeado, vuelvo a esa carpeta
        var index = this.state.path.indexOf(target);
        var nextTarget = "";
        for(var i = 0; i < index; i++){
            nextTarget = nextTarget + this.state.path[i] + "/";
        }
        nextTarget = nextTarget + target;
        var nextNode = this._nextNode(nextTarget,this.state.rawResponse); // busco la carpeta para abrirla
        this._updateTable(nextNode);
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

    _handleOnClickItem(e){
        console.log("click on table items");
        debugger;
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
                    console.log("NO PUEDE PASAR ESTOOOOOOOOOOOOOOOO!!11!11!11!!!");
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

    _onMouseEnter(e){
        var parent = e.target.parentElement;
        if (!this.state.initialLevel){
            if (parent.id.includes("folder")){
                this.setState({isFolder: true, idContextText:"rightClickContextMenuFolder"});
            } else {
                this.setState({isFolder: false, idContextText:"rightClickContextMenuFile"});
            }
        }
    }
    
    render(){
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
        const MenuPacient = () => (
            <ContextMenu  id='rightClickContextMenuPacient'>
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
                    <TableDoctor data = { data } onClickItems = { this._handleOnClickItem } onMouseEnter = { this._onMouseEnter }/>
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
    auth : PropTypes.object.isRequired
}

export default connect(mapStateToProps,null)(DoctorLobby);