import React    from 'react'
import VisualizerServerRender from '../../renders/VisualizerServerRender'

class DoctorRemoteRenderPage extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            dataFile : "",
            dataDir : ""
        }
    }

    componentWillMount(){
        this.setState({ dataFile : this.props.history.location.state.dataFile,
                        dataDir : this.props.history.location.state.dataDir  });
    }

    render(){
        {/*TODO: agregar componentes para modificar el remote render*/}
       return ( 
            <VisualizerServerRender dataFile = { this.state.dataFile } dataDir = { this.state.dataDir }/>
        );
    }
}

export default DoctorRemoteRenderPage;