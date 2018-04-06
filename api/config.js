const _ = require('lodash');

let config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
};

const envConfig = require(`./${config.env}.js`);

module.exports = _.merge(config, envConfig);
