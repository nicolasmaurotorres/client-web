module.exports = ({ file, options, env }) => ({
    parser: file.extname === '.sss' ? 'sugarss' : false, // Handles `.css` && '.sss' files dynamically
    plugins: {
      'postcss-import': { root: file.dirname },
      'postcss-cssnext': options.cssnext ? options.cssnext : false,
      'autoprefixer': env == 'production' ? options.autoprefixer : false,
      'cssnano': env === 'production' ? {} : false
    }
  });