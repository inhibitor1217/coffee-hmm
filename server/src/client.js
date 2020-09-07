const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const uuid = require('uuid');

dotenv.config('.env');

const CAFES_TABLE = 'coffee-hmm-server-cafes-production';
const RESOURCE_BUCKET_URI = 'coffee-hmm-resource.inhibitor.io';

AWS.config.update({
  region: 'ap-northeast-2'
});

const documentClient = new AWS.DynamoDB.DocumentClient();

function createCafe(client, cafe) {
  const params = {
    TableName: CAFES_TABLE,
    Item: cafe
  };

  client.put(params, function(err, data) {
    if (err) {
      console.error(JSON.stringify(err, null, 2));
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  });
}

function scanCafes(client) {
  const params = {
    ExpressionAttributeValues: {
      ':place': '성수동'
    },
    FilterExpression: `place = :place`,
    TableName: CAFES_TABLE
  };

  client.scan(params, function(err, data) {
    if (err) {
      console.error(JSON.stringify(err, null, 2));
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  });
}

function getCafeItem(client, id) {
  const params = {
    TableName: CAFES_TABLE,
    Key: {
      id: id
    }
  };

  client.get(params, function(err, data) {
    if (err) {
      console.error(JSON.stringify(err, null, 2));
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  });
}

function deleteItem(client, id) {
  const params = {
    TableName: CAFES_TABLE,
    Key: {
      id: id
    }
  };

  client.delete(params, function(err, data) {
    if (err) {
      console.error(JSON.stringify(err, null, 2));
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  });
}

scanCafes(documentClient);
