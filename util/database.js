const Sequelize = require('sequelize');

/**
 * Constants for database connection and Sequelize object.
 */
const config = require("../config/config")


const DB_NAME = 'groupfinder';
const USER = 'root';
const PASSWORD = '1234';
const DIALECT = 'mysql';
const HOST = 'localhost';

const sequelize = new Sequelize(DB_NAME, USER, PASSWORD, {
    dialect: DIALECT,
    host: HOST
});

module.exports = sequelize;