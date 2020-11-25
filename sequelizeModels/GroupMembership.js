const Sequelize = require('sequelize');
// const sequelize = require('../util/database');


// const GroupMembership = sequelize.define('GroupMembership', {
//
//
// },{
//     timestamps: false
//
// });
// module.exports = GroupMembership;

module.exports = function (sequelize, DataTypes) {

    var GroupMembership = sequelize.define('GroupMembership', {


    },{
        timestamps: false
    });
    return GroupMembership;
};