// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Student = sequelize.define('Student', {
//
//         firstname: {
//             type: Sequelize.STRING
//         },
//
//         lastname: {
//             type: Sequelize.STRING
//         },
//
//         email: {
//             type: Sequelize.STRING,
//             unique: true
//         },
//         phonenumber: {
//             type: Sequelize.STRING
//         },
//
//         password: {
//             type: Sequelize.STRING
//         },
//
//         createdAt: {
//             type: 'TIMESTAMP',
//             defaultValue: Sequelize.NOW,
//             allowNull: false
//         },
//
//         updatedAt: {
//             type: 'TIMESTAMP',
//             defaultValue: Sequelize.NOW,
//             allowNull: false
//         }
//
//     },{
//         timestamps: false,
//
//     },
// );
// module.exports = Student;

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