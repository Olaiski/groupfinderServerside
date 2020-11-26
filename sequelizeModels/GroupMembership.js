module.exports = function (sequelize, DataTypes) {

    var GroupMembership = sequelize.define('GroupMembership', {


    },{
        timestamps: false
    });
    return GroupMembership;
};