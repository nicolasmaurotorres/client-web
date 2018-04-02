var axios = require('axios');

var axiosInstance = axios.create({
  baseURL: 'http://localhost:8001',
});

module.exports = axiosInstance;