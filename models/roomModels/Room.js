const Sequelize = require('sequelize');
const sequelize = require('../../util/database');


const Room = sequelize.define('Room', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    location: {
        type: Sequelize.STRING
    },

},{
    timestamps: false
});

module.exports = Room;