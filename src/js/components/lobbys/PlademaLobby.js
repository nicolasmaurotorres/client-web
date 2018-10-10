import React from 'react'
import { connect } from 'react-redux';
import uuid from 'uuid'
import { ContextMenu, Item, ContextMenuProvider,IconFont } from 'react-contexify'

import { openModal } from '../../actions/modalActions'
import { plademaGetAllFolders, plademaGetFile } from '../../actions/plademaActions'
import { setTableState, setCurrentLevel } from '../../actions/tableActions'
import { addFlashMessage } from '../../actions/flashMessagesActions'

import TablePladema from '../common/TablePladema'
import PlademaAddFolderForm from '../forms/pladema/PlademaAddFolderForm'
import PlademaAddFileForm from '../forms/pladema/PlademaAddFileForm'
import { _getPathAsString } from '../../utils/tableFunctions';
import { setSpinnerState } from '../../actions/spinnerActions';

class PlademaLobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFolder : false,
            idContextText : 'rightClickContextMenuInitialMenuFolder',
        };
        /* bindings */
        this._hoverTableItem = this._hoverTableItem.bind(this);
        this._onConfirmDownloadFile = this._onConfirmDownloadFile.bind(this);
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
   
    _onConfirmDownloadFile(nameFile){
        var path = _getPathAsString(this.props.table.level.path);
        var obj = {};
        obj["file"] = path+"/"+nameFile;
        this.props.dispatch(setSpinnerState({
            state : true
        }));
        plademaGetFile(obj)
        .then((response)=>{ 
            var fileName = "";
            var parts = nameFile.split(".");
            for (var i = 0; i < parts.length-1; i++){
                fileName += parts[i] + ".";
            }
            fileName = fileName.substring(0,fileName.length-1);//quito el ultimo .
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName+".zip");
            document.body.appendChild(link);
            link.click();
            this.props.dispatch(setSpinnerState({
                state : false
            }));
        })
        .catch((response)=>{
            this.props.dispatch(addFlashMessage({
                type:"error",
                text:"network error downloading file"
            }));
            this.props.dispatch(setSpinnerState({
                state : false
            }));
        });
    }

    render() {
        const onClickAddFolder = ({event, ref,data,dataFromProvider}) => {
            this.props.dispatch(openModal({
                id: uuid.v4(),
                type: 'custom',
                content: <PlademaAddFolderForm/>,
            }));
        }; 

        const onClickUploadFile = ({event, ref,data,dataFromProvider}) => {
            this.props.dispatch(openModal({
                id: uuid.v4(),
                type: 'custom',
                content: <PlademaAddFileForm/>,
            }));
        }; 
        
        const onClickDownloadFile = ({event, ref,data,dataFromProvider}) => {
            var parts = event.target.parentElement.id.split("-");
            var fileName = ""; 
            for (var i = 1; i < parts.length-1; i++){ // por si el archivo contenia un "-"
                fileName = fileName + parts[i] + "-";
            }
            fileName = fileName.substring(0,fileName.length-1); // quito el ultimo -
            this.props.dispatch(openModal({
                id: uuid.v4(),
                type: 'confirmation',
                text: 'Are you sure to download this file?',
                onClose: null,
                onConfirm: () => this._onConfirmDownloadFile(fileName),
              }));
        }; 

        const NotInitialMenuFolder = () => (
            <ContextMenu id='rightClickContextMenuNotInitialMenuFolder'>
                <Item onClick = { onClickUploadFile }><IconFont className = "fa fa-upload"/> Upload File </Item>
                <Item onClick = { onClickAddFolder }><IconFont className = "fa fa-plus"/> Create Folder </Item>
            </ContextMenu>
        );

        const NotInitialMenuFile = () => (
            <ContextMenu id='rightClickContextMenuNotInitialMenuFile'>
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
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(PlademaLobby);