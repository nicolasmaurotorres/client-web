module.exports = [
    {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        /*options: {   **** this option is deprecated from this loader **** 
            runtimeCompat = true 
        },*/
        exclude: /fonts/,        
    },
    {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: {
            limit: 60000,
            mimetype: 'application/font-woff'
        }
    },
    {   // de prueba
        test: /\.(woff|ttf|eot|svg)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/, 
        loader: 'url-loader',
        options: {
          limit : 100000
        } 
    },
    {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: {
            limit: 60000,
            mimetype: 'application/font-woff'
        },
        include: /fonts/
    },
    {
        test: /\.(png|jpg)$/,
        loader: 'url-loader',
        options: {
            limit: 8192,
        }
    },
    {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              config: {
                path: __dirname + "/postcss.config.js"
              }
            }
          },
        ],
      },
      {
        test: /\.mcss$/,
        use : [
          {
              loader: require.resolve('style-loader'),
          },
          {
              loader: require.resolve('css-loader'),
              options : {
                  module: true,
                  importLoaders : true,
                  localIdentName : "[name]_[local]_[hash:base64:5]"
              }
          },
          {
              loader: require.resolve('postcss-loader'),
          }
        ]
      },
      {
        test : /\.c$/i,
        loader : 'shader-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.isvg$/,
        loader: 'html-loader',
       /* options : {
            attrs= [false],
        }*/
      },
      {
        test: /\.js$/,
        include: /node_modules(\/|\\)paraviewweb(\/|\\)/,
        loader: 'babel-loader',
        options: {
            presets: ['env','react']
        }
      },
      {
        test: /\.js$/,
        include: /node_modules(\/|\\)vtk.js(\/|\\)/,
        loader: 'babel-loader',
        options: {
            presets: ['env','react']
        }
      },
      {
        test: /\.js$/,
        include: /node_modules(\/|\\)wslink(\/|\\)/,
        loader: 'babel-loader',
        options: {
            presets: ['env']
        }
      },
      {
        test: /\.glsl$/,
        loader: 'shader-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
            presets: ['env','react']
        }
      },
      {
        test: /\.glsl$/i,
        include: /node_modules(\/|\\)vtk\.js(\/|\\)/,
        loader: 'shader-loader',
      },
      {
        test: /\.worker\.js$/,
        include: /node_modules(\/|\\)vtk\.js(\/|\\)/,
        loader: 'worker-loader',
        options: { 
          inline: true, 
          fallback: false 
        },
      },
      {
        test: /\.js$/,
        include: /node_modules(\/|\\)vtk\.js(\/|\\)/,
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      },
      {
        test: /\.scss$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "sass-loader" // compiles Sass to CSS
        }]
      },
]