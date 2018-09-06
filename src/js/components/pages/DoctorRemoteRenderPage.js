import React    from 'react'
import RemoteRender from '../../renders/RemoteRender'

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
            <RemoteRender file = { this.state.file }/>
        );
    }
}

export default DoctorRemoteRenderPage;