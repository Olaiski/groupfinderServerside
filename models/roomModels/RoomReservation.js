const Sequelize = require('sequelize');
const sequelize = require('../../util/database');


const RoomReservation = sequelize.define('RoomReservation', {

    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    startDateTime: {
        type: Sequelize.STRING,
    },
    endDateTime: {
        type: Sequelize.STRING,
    },


},{
    timestamps: false

});
module.exports = RoomReservation;