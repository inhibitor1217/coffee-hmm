const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const uuid = require('uuid');
const fs = require('fs');

dotenv.config('.env');

const CAFES_TABLE = 'coffee-hmm-server-cafes-production';
const MENUS_TABLE = 'coffee-hmm-server-menus-production';
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

function createMenu(client, menu) {
  const params = {
    TableName: MENUS_TABLE,
    Item: menu
  };
  
  client.put(params, (err, data) => {});
}

function populateCafe(client, cafe, callback) {
  const { name } = cafe;
  if (!name) return cafe;

  client.scan({
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

    if (callback) callback(null, { ...cafe, menus, americanoPrice });
  });
}

function scanCafes(client) {
  client.scan({
    TableName: CAFES_TABLE
  }, function(err, data) {
    if (err) {
      console.error(JSON.stringify(err, null, 2));
      return;
    }

    data.Items.forEach((cafe) => populateCafe(client, cafe, (err, data) => {
      console.log(JSON.stringify(data, null, 2));
    }));
  })
}

// scanCafes(documentClient);
getCafeItem(documentClient, "40e565e9-8c80-4eee-94c1-f5d164a13e74");
