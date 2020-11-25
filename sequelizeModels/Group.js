const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Group = sequelize.define('Group', {

    groupName: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    // ++
    courseCode: {
        type: Sequelize.STRING
    },
    location: {
        type: Sequelize.STRING
    }
},{
    timestamps: false
});


module.exports = Group;