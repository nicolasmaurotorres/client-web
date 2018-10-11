import 'normalize.css';
import React from 'react'
import PropTypes from 'prop-types'
import 'pvw-visualizer/dist/Visualizer'
import { renderConfig } from '../config/renderConfig'

class VisualizerServerRender extends React.Component {
    constructor(props){
        super(props);
        console.log({visualizer : Visualizer});
    }

    componentDidMount(){
        const { dataDir, dataFile } = this.props;
        var config = renderConfig;
        config['dataDir'] = config['dataDir']+ dataDir;
        config['dataFile'] = config['dataDir'] + "/"+ dataFile;
        Visualizer.connect(renderConfig);
        Visualizer.autoStopServer(10);
    }

    render(){
        return (
            <div className='content'></div>  
        );
    }
}

VisualizerServerRender.PropTypes = {
    dataDir : PropTypes.string.isRequired,
    dataFile : PropTypes.string.isRequired
} 

export default VisualizerServerRender;