


module.exports = function (sequelize, DataTypes) {
    const Room = sequelize.define('Room', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        location: {
            type: DataTypes.STRING
        },
    },{
        timestamps: false
    });
    return Room;
};