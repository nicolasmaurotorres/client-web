**Software needed**
- Python 2.7
- Nodejs
- npm
- npm install --global windows-build-tools (only windows)
	+ set the enviroment variable of python 2.7

**Installation** 
- git clone https://github.com/nicolasmaurotorres/thesis-client
- npm install
- node-gyp rebuild (if needed)
- go to /node_modules/paraview/webpack.config.js 
	change the following line "var loaders = require('./config/webpack.loaders.js');"
	to this one "var loaders = require('../../loaders.paraviewweb.webpack-2');"
- npm run dev
