module.exports = function (sequelize, DataTypes) {

    var Student = sequelize.define('Student', {
            firstname: {
                type: DataTypes.STRING
            },

            lastname: {
                type: DataTypes.STRING
            },

            email: {
                type: DataTypes.STRING,
                unique: true
            },
            phonenumber: {
                type: DataTypes.STRING
            },

            password: {
                type: DataTypes.STRING
            },

            createdAt: {
                type: 'TIMESTAMP',
                defaultValue: DataTypes.NOW,
                allowNull: false
            },

            updatedAt: {
                type: 'TIMESTAMP',
                defaultValue: DataTypes.NOW,
                allowNull: false
            }

        }, {
        timestamps: false,
    });
    return Student;
};