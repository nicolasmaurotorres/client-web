import 'normalize.css';
import React from 'react'
import 'pvw-visualizer/dist/Visualizer'
import { renderConfig } from '../config/renderConfig'

class VisualizerServerRender extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            file : ""
        }
        console.log(Visualizer);
    }

    render(){
        return (
            <div className='content'></div>  
        );
    }

    componentDidMount(){
        Visualizer.connect(renderConfig);
        Visualizer.autoStopServer(10);
    }
}

export default VisualizerServerRender;