const Student = require('../sequelizeModels/Student');
const sequelize = require('../util/database');
const { QueryTypes } = require('sequelize');

// Henter brukeren - Anders Olai Pedersen 225280
exports.getUser = async (req, res) => {
    const student = await Student.findOne({where: {email : req.query.email }});

    if (!student)  {
        res.status(403).send({
            error: 'No student with email: ' + req.query.email
        });
        return
    }

    res.status(200).send({
        message: 'Ok! Student fetched from db.',
        student: student
    });
};