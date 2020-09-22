'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-2' });

const documentClient = new AWS.DynamoDB.DocumentClient();
const CAFES_TABLE = 'coffee-hmm-server-cafes-production';
const MENUS_TABLE = 'coffee-hmm-server-menus-production';

function populateCafe(cafe, callback) {
  const { name } = cafe;
  if (!name) return cafe;

  documentClient.scan({
    TableName: MENUS_TABLE,
    ExpressionAttributeValues: {
      ':c': name
    },
    FilterExpression: 'cafeName = :c'
  }, function(err, data) {
    if (err) {
      if (callback) callback(err);
      return;
    }

    const menus = { categories: [] };
    data.Items.forEach((menu) => {
      const { cafeName, categoryName, ...rest } = menu;
      const idx = menus.categories.findIndex((category) => category.categoryName === categoryName);
      if (idx >= 0) {
        menus.categories[idx].categoryMenu = [
          ...menus.categories[idx].categoryMenu,
          rest
        ];
      } else {
        menus.categories = [...menus.categories, {
          categoryName,
          categoryMenu: [rest]
        }];
      }
    });

    const { price: americanoPrice = undefined } = data.Items.find((menu) => menu.ename === 'Americano') || {};

    if (callback) callback(null, { viewCount: 0, ...cafe, menus, americanoPrice });
  });
}

module.exports.cafeListHandler = (event, context, callback) => {
  const onError = (err) => {
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
  }
  
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

  documentClient.scan(
    params,
    function(err, data) {
      if (err) {
        onError(err);
        return;
      }

      const { Items } = data;
      const populatedData = [];

      Items.forEach((cafe) => populateCafe(cafe, (err, data) => {
        if (err) {
          onError(err);
          return;
        }

        populatedData.push(data);
        if (populatedData.length === Items.length) {
          const response = {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(populatedData)
          };
          callback(null, response);
        }
      }));
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
    const onError = (err) => {
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
    }

    if (err) {
      onError(err);
      return;
    }
    
    const { Item } = data;
    populateCafe(Item, (err, data) => {
      if (err) {
        onError(err);
        return;
      }

      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(data)
      };
      callback(null, response);
    });
  });
};

module.exports.addView = (event, context, callback) => {
  const cafeId = event.queryStringParameters.cafe_id;

  function onError() {
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
  }
  
  const getParams = {
    TableName: CAFES_TABLE,
    Key: {
      id: cafeId,
    },
  };

  documentClient.get(getParams, function(err, data) {
    if (err) { onError(); return; }

    const { Item: cafe } = data;

    const updateParams = {
      TableName: CAFES_TABLE,
      Key: {
        id: cafeId
      },
      UpdateExpression: cafe.viewCount ? 'set viewCount = viewCount + :val' : 'set viewCount = :val',
      ExpressionAttributeValues: {
        ":val": 1
      },
      ReturnValues: "UPDATED_NEW",
    };

    documentClient.update(updateParams, function(err, data) {
      if (err) { onError(); return; }

      const { Item } = data;
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(Item)
      };
      callback(null, response);
    });
  });
}

module.exports.cleanViews = (event, context, callback) => {
  const response = {
    statusCode: 501,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  }
  callback(null, response);
}