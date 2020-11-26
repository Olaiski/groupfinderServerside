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
