// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');


// const RoomReservation = sequelize.define('RoomReservation', {
//
//     id : {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     startDateTime: {
//         type: Sequelize.STRING,
//     },
//     endDateTime: {
//         type: Sequelize.STRING,
//     },
//
// },{
//     timestamps: false
//
// });
// module.exports = RoomReservation;


module.exports = function (sequelize, DataTypes) {

    var RoomReservation = sequelize.define('RoomReservation', {
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        startDateTime: {
            type: DataTypes.STRING,
        },
        endDateTime: {
            type: DataTypes.STRING,
        },

    },{
        timestamps: false

    });
    return RoomReservation;
};