const Sequelize = require('sequelize');

/**
 * Constants for database connection and Sequelize object.
 */
const DB_NAME = 'groupfinder';
const USER = '';
const PASSWORD = '';
const DIALECT = 'mysql';
const HOST = 'localhost';

const sequelize = new Sequelize(DB_NAME, USER, PASSWORD, {
    dialect: DIALECT,
    host: HOST
});

module.exports = sequelize;