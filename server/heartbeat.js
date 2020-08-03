'use strict';

module.exports.handler = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: 'coffee-hmm server is alive!'
  };

  callback(null, response);
};