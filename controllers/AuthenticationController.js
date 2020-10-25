const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { registerValidation } = require('../policies/validation');
const { loginValidation } = require('../policies/validation');

exports.register = async (req, res) => {
    // Bruker funksjonen i policies/validation
    // const { error } = registerValidation(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    // Sjekker om studenten er i db'en
    const emailExist = await Student.findOne({
        where: {
            email: req.body.email
        }
    });
    if (emailExist) return res.status(400).send('E-Mail already exists');

    // Hash passord
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(req.body.password, salt);

    try {
        // Ny student
        const savedStudent = await Student.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phonenumber: req.body.phonenumber,
            password: hashedPw
        });

        res.status(200).send({
            message: `New user created, ID: ${savedStudent.id}`
        });

    }catch (e) {
        res.status(400).send({
            message: 'User/Email already exists!'
        })
    }
};


// LOGIN
exports.login = async (req, res) => {
    // Validere data
    // const { error } = loginValidation(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    // Sjekker om studenten er i db'en
    const student = await Student.findOne({
        where: {
            email: req.body.email
        }
    });

    if (!student) {
        res.status(403).send({
            error: 'The login information was incorrect'
        });
    } else {
        // ER PASSORD KORREKT?
        const validPass = await bcrypt.compare(req.body.password, student.password);

        if (!validPass) {
            res.status(403).send({
                error: 'The login information was incorrect'
            });
        }

        const savedStudent = ({
            id: student.id,
            firstname: student.firstname,
            lastname: student.lastname,
            email: student.email,
            phonenumber: student.phonenumber
        });


        res.status(200).send({
            message: 'Logged in!',
            // token: token,
            student: savedStudent
        });
    }

    // TODO//: Skal vi bruke tokens på samme måte?
    // Lager / tildeler token når man logger inn
    // const token = await jwt.sign({
    //         email: student.email,
    //         id: student.id
    //     },
    //     'SECRETKEY', {
    //         expiresIn: '1d'
    //     }
    // );
};