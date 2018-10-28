import React from 'react'

import 'vtk.js/Sources/favicon';

import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkSTLReader from 'vtk.js/Sources/IO/Geometry/STLReader';

class LocalRender extends React.Component {
    constructor(){
        super();
        this.state = {
            file : null
        }

        this._handleFile = this._handleFile.bind(this);
        this._update = this._update.bind(this);
        
        this.reader = vtkSTLReader.newInstance();
        this.mapper = vtkMapper.newInstance({ scalarVisibility: false });
        this.actor = vtkActor.newInstance();
        this.actor.setMapper(this.mapper);
        this.mapper.setInputConnection(this.reader.getOutputPort());
    }

    _handleFile(event) {
        event.preventDefault();
        var _this = this;
        const dataTransfer = event.dataTransfer;
        const files = event.target.files || dataTransfer.files;
        if (files.length === 1) {
          //myContainer.removeChild(fileContainer);
          const fileReader = new FileReader();
          this.setState({file:true});
          fileReader.onload = function onLoad(e) {
            _this.reader.parseAsArrayBuffer(fileReader.result);
            _this._update();
          };
          fileReader.readAsArrayBuffer(files[0]);
        }
    }

    _update() {
        const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance();
        const renderer = fullScreenRenderer.getRenderer();
        const renderWindow = fullScreenRenderer.getRenderWindow();
        
        const resetCamera = renderer.resetCamera;
        const render = renderWindow.render;
        renderer.addActor(this.actor);
        resetCamera();
        render();
    }

    render(){
        var fileChooser = <input type="file" onChange={this._handleFile}/>;        
        return (
            <div id="localRenderId">
                { (this.state.file === null ) ? fileChooser : "" }
            </div>
        );
    }
}  

export default LocalRender;