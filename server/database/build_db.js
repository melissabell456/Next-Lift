'use strict';

const sequelize = require('sequelize');
// const qui = require('sequelize/lib/query-interface'); TODO: remove if not needed
const app = require('../app/app');
const models = require('../app/models');

const lifts = require('./json/lifts');
const muscles = require('./json/muscle-groups');
const paymentOptions = require('./json/paymentOptions');
const products = require('./json/products');
const orders = require('./json/orders');
const productOrders = require('./json/productOrders');

const createDb = qi => {
  return models.sequelize.sync({force: true})
    .then(qi => {
      return models.Lift.bulkCreate(lifts);
    })
    .then(qi => {
      return models.ProductType.bulkCreate(muscles);
    })
    .then(qi => {
      return models.PaymentOption.bulkCreate(paymentOptions);
    })
    .then(qi => {
      return models.Product.bulkCreate(products);
    })
    .then(qi => {
      return models.Order.bulkCreate(orders);
    })
    .then(qi => {
      return models.ProductOrder.bulkCreate(productOrders);
    })
    .then(response => {
      process.exit();
    })
    .catch(err => console.log(err));
};

createDb();