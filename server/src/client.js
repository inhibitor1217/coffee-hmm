const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const uuid = require('uuid');

dotenv.config('.env');

const CAFES_TABLE = 'coffee-hmm-server-cafes-production';
const RESOURCE_BUCKET_URI = 'resource.coffee-hmm.inhibitor.com.s3.amazonaws.com';

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

// createCafe(documentClient, {
//   id: uuid.v4(),
//   name: "Kaldi",
//   mainImageUri: `${RESOURCE_BUCKET_URI}/IMG_2466.jpg`,
//   imageUris: [
//     `${RESOURCE_BUCKET_URI}/IMG_2461.jpg`,
//     `${RESOURCE_BUCKET_URI}/IMG_2462.jpg`,
//     `${RESOURCE_BUCKET_URI}/IMG_2463.jpg`,
//     `${RESOURCE_BUCKET_URI}/IMG_2464.jpg`,
//     `${RESOURCE_BUCKET_URI}/IMG_2466.jpg`,
//     `${RESOURCE_BUCKET_URI}/IMG_2469.jpg`,
//   ]
// });
scanCafes(documentClient);
