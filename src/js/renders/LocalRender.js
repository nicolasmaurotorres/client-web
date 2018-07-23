import React from 'react'

import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkSTLReader from 'vtk.js/Sources/IO/Geometry/STLReader';

import vtkPolyDataReader from 'vtk.js/Sources/IO/Legacy/PolyDataReader';

class LocalRender extends React.Component {
    constructor(){
        super();
        this.state = {
            file : null
        }

        this._handleFile = this._handleFile.bind(this);
        this._update = this._update.bind(this);
        
        this.reader = vtkPolyDataReader.newInstance();
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
          const fileReader = new FileReader();
          fileReader.onload = function onLoad(e) {
            _this.reader.parseAsText(fileReader.result)
//            _this.reader.parseAsArrayBuffer(fileReader.result);
            _this._update();
          };
          fileReader.readAsText(files[0]);
        }
    }

      _update() {
        const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance();
        const renderer = fullScreenRenderer.getRenderer();
        const renderWindow = fullScreenRenderer.getRenderWindow();
      
        const resetCamera = renderer.resetCamera;
        const render2 = renderWindow.render;
      
        renderer.addActor(this.actor);
        resetCamera();
        render2();
      }

    render(){
        // ----------------------------------------------------------------------------
        // Use the reader to download a file
        // ----------------------------------------------------------------------------
        // reader.setUrl(`${__BASE_PATH__}/data/stl/segmentation.stl`, { binary: true }).then(update);
        var fileChooser = <input type="file" onChange={this._handleFile}/>;        
        return (
            <div id="localRenderId">
                { (this.state.file === null ) ? fileChooser : "" }
            </div>
        );
    }
}  