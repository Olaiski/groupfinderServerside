'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Student = require("../sequelizeModels/Student.js")(sequelize, Sequelize);
db.Group = require("../sequelizeModels/Group.js")(sequelize, Sequelize);
db.GroupMembership = require("../sequelizeModels/GroupMembership")(sequelize, Sequelize);
db.Room = require("../sequelizeModels/Room.js")(sequelize, Sequelize);
db.RoomReservation = require("../sequelizeModels/RoomReservation.js")(sequelize, Sequelize);
db.RoomType = require("../sequelizeModels/RoomType.js")(sequelize, Sequelize);

module.exports = db;
