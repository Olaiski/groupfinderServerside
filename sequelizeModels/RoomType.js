
module.exports = function (sequelize, DataTypes) {

    var RoomType = sequelize.define('RoomType', {
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
    return RoomType;
};