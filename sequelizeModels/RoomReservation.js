
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