// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');


// const Room = sequelize.define('RoomType', {
//
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     description: {
//         type: Sequelize.STRING
//     },
//     maxCapacity : {
//         type: Sequelize.INTEGER
//     }
//
// },{
//     timestamps: false
//
// });
// module.exports = Room;


module.exports = function (sequelize, DataTypes) {

    var Room = sequelize.define('RoomType', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING
        },
        maxCapacity : {
            type: DataTypes.INTEGER
        }

    },{
        timestamps: false

    });
    return Room;
};