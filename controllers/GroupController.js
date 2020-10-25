const sequelize = require('../util/database');
const Student = require('../models/Student');
const Group = require('../models/Group');
const { QueryTypes } = require('sequelize');

// Get groups based on group membership and email
exports.getUserGroups = async (req, res) => {

    const student = await Student.findOne({where: {email : req.query.email }});

    if (!student)  {
        res.status(403).send({
            error: 'No student with email: ' + req.query.email
        });
        return
    }
    try {
        const userGroups = await sequelize.query(
            "SELECT students.id AS sId, groups.groupName, groups.description, groups.location, groups.courseCode, groups.id AS gId " +
            "FROM groups " +
            "INNER JOIN groupmemberships ON groupmemberships.GroupId = groups.id " +
            "INNER JOIN students ON groupmemberships.StudentId = students.id " +
            'WHERE students.email = :user',
            {
                replacements:{
                    user: req.query.email
                },
                type: QueryTypes.SELECT
            }
        );

        if (!userGroups) {
            res.status(403).send({
                error: 'You\'re not in a group'
            });
            return
        }

        res.status(200).send({
            message: 'Ok! Groups fetched from db.',
            userGroups: userGroups
        });

    } catch (e) {
        res.status(400).send({
            message: 'DB Query error',
            err: e.toString()
        });
    }
};

exports.getGroupMembers = async (req, res) => {
    const group = await Group.findOne({where: {id : req.query.gid }});

    if (!group) {
        res.status(400).send({
            error: 'No group found'
        });
        return ;
    }

    try {
        const groupMembers = await sequelize.query(
            "SELECT students.id, students.firstname, students.lastname " +
            "FROM groups " +
            "INNER JOIN groupmemberships ON groupmemberships.GroupId = groups.id " +
            "INNER JOIN students ON groupmemberships.StudentId = students.id " +
            'WHERE groups.id = :gid',
            {
                replacements:{gid: req.query.gid},
                type: QueryTypes.SELECT
            }
        );

        res.status(200).send({
            message: 'Ok! Group members fetched from db.',
            groupMembers: groupMembers
        });

    } catch (e) {
        console.log(e.toString());
        res.status(400).send({
            message: 'DB Query error',
            err: e.toString()
        });
    }
};


exports.postRegisterGroup = async (req, res, next) => {
    try {
        const studentId = req.body.studentId;
        const groupName = req.body.groupName;
        const description = req.body.description;
        const courseCode = req.body.courseCode;
        const location = req.body.location;

        const group = await Group.findOne({where: { groupName : req.body.groupName} });

        if (group) {
            res.status(400).send({
                message: "Group name exists"
            });
            return ;
        }
        

        const [results, metadata] = await sequelize.query(`INSERT INTO groups(groupName, description, courseCode, location, StudentId) 
                VALUES(:groupName, :description, :courseCode, :location, :studentId)`,
            {
                replacements: {
                    groupName: `${groupName}`,
                    description: `${description}`,
                    courseCode: `${courseCode}`,
                    location: `${location}`,
                    studentId: `${studentId}`},
                type: QueryTypes.INSERT
            });
        let idFromResults = results;
        let affectedRows = metadata;

        if(affectedRows > 0) {
            const result = await sequelize.query(`INSERT INTO groupmemberships(StudentId, GroupId)
                VALUES(:StudentId, :groupId)`, {
                replacements: {StudentId: `${studentId}`, groupId: `${idFromResults}`},
                type: QueryTypes.INSERT
            });


            if (result) {
                res.status(200).send({
                    message: "Success"
                })
            } else {
                res.status(400).send({
                    message: "Something went wrong"
                })
            }
        }



    } catch (e) {
        console.log(e.toString());

        res.status(400).send({
            message: 'DB Query error',
            err: e.toString()
        })

    }
};

