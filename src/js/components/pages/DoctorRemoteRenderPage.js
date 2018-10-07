import React    from 'react'
import VisualizerServerRender from '../../renders/VisualizerServerRender'

class DoctorRemoteRenderPage extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            file : ""
        }
    }

    componentWillMount(){
        this.setState({file:this.props.history.location.state.file});
    }

    render(){
        {/*TODO: agregar componentes para modificar el remote render*/}
       return ( 
            <VisualizerServerRender file = { this.state.file }/>
        );
    }
}

export default DoctorRemoteRenderPage;