const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Student = sequelize.define('Student', {

        firstname: {
            type: Sequelize.STRING
        },

        lastname: {
            type: Sequelize.STRING
        },

        email: {
            type: Sequelize.STRING,
            unique: true
        },
        phonenumber: {
            type: Sequelize.STRING
        },

        password: {
            type: Sequelize.STRING
        },

        createdAt: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.NOW,
            allowNull: false
        },

        updatedAt: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.NOW,
            allowNull: false
        }

    },{
        timestamps: false,

    },
);




module.exports = Student;