const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const GroupMembership = sequelize.define('GroupMembership', {


},{
    timestamps: false

});
module.exports = GroupMembership;