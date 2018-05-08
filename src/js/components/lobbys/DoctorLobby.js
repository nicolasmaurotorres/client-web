import React    from 'react'
import FileBrowserWidget  from 'paraviewweb/src/React/Widgets/FileBrowserWidget';
import RemoteRender from '../../renders/RemoteRender'
import TableDoctor from '../common/TableDoctor'
import { IconFont } from 'react-contexify';

class DoctorLobby extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
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
    }
 
    componentWillMount(){
         // mock-i-to
         var rawResponse =   {
             "Folder": "doctor@doctor.com",
             "Files": [
                 "README.txt",
                 "imagen_procesada.vtk",
                 "paciente31README.txt"
             ],
             "SubFolders": [{
                 "Folder": "doctor@doctor.com/paciente2",
                 "Files": [
                             "README.txt",
                             "README2.txt",
                             "imagen_procesada31.vtk"
                         ],
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
      this._setPath(rawResponse);
      this._setFiles(rawResponse);
      this._setFolders(rawResponse);
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
  
    _rightClick(event){
        console.log("asd");
    }
 
    _handleClickPath(e){
        console.log("click on labelll");
    }

    render(){
        // armo los datos de la tabla
        var data = [];
        this.state.folders.forEach((item) => {
            data.push([<IconFont className = "fa fa-folder-o"/> , item]);
        });
        this.state.files.forEach((item) => {
            data.push([<IconFont className = "fa fa-file-text-o"/> , item]);
        });
        // armo el path
        var path = ["/"];
        this.state.path.forEach((item) => {
            path.push(<label key = { item } onClick = { this._handleClickPath }>{ item }</label>);
        });
        return (
            <div className="jumbotron"> 
                <div> { path } </div>
                <div onContextMenu={this._rightClick.bind(this)}>
                    <TableDoctor data = { data }/>
                </div>
                <button> tocame! :$ </button>
            </div>
        );
    }
}

export default DoctorLobby;