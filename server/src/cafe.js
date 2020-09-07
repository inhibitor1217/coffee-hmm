'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-2' });

const documentClient = new AWS.DynamoDB.DocumentClient();
const CAFES_TABLE = 'coffee-hmm-server-cafes-production';

module.exports.cafeListHandler = (event, context, callback) => {
  const { place = null } = event.queryStringParameters || {};

  const params = place ? {
    TableName: CAFES_TABLE,
    ExpressionAttributeValues: {
      ':place': place
    },
    FilterExpression: 'place = :place'
  } : {
    TableName: CAFES_TABLE
  };

  console.log(params);

  documentClient.scan(
    params,
    function(err, data) {
      if (err) {
        const response = {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(err)
        };
        console.error(err, null, 2);
        callback(null, response)
      } else {
        const response = {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(data)
        };
        callback(null, response);
      }
    }
  );
};

module.exports.cafeHandler = (event, context, callback) => {
  const id = event.pathParameters.cafe_id;
  const params = {
    TableName: CAFES_TABLE,
    Key: {
      id: id
    }
  };

  documentClient.get(params, function(err, data) {
    if (err) {
      const response = {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(err)
      };
      console.error(JSON.stringify(err, null, 2));
      callback(null, response);
    } else {
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(data)
      };
      callback(null, response);
    }
  });
};