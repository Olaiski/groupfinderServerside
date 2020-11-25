// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Group = sequelize.define('Group', {
//
//     groupName: {
//         type: Sequelize.STRING
//     },
//     description: {
//         type: Sequelize.STRING
//     },
//     // ++
//     courseCode: {
//         type: Sequelize.STRING
//     },
//     location: {
//         type: Sequelize.STRING
//     }
// },{
//     timestamps: false
// });
// module.exports = Group;

module.exports = function (sequelize, DataTypes) {
    var Group = sequelize.define('Group', {

    groupName: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    // ++
    courseCode: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.STRING
    }
},{
    timestamps: false
});
    return Group;
};
