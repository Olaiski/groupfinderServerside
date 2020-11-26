const db = require('../models');
const Student = db.Student;
const Group = db.Group;
const GroupMembership = db.GroupMembership;

const { QueryTypes } = require('sequelize');


// Heneter alle gruppene brukeren er medlem av - Anders Olai Pedersen 225280
exports.getUserGroups = async (req, res) => {

    const student = await Student.findOne({where: {email : req.query.email }});

    if (!student)  {
        res.status(403).send({
            error: 'No student with email: ' + req.query.email
        });
        return
    }
    try {
        const userGroups = await db.sequelize.query(
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

// Henter alle gruppene - Anders Olai Pedersen 225280
exports.getAllGroups = async (req, res) => {

    try {
        const userGroups = await db.sequelize.query(
            "SELECT groups.StudentId AS sId, groups.groupName, groups.description, groups.location, groups.courseCode, groups.id AS gId " +
            "FROM groups " +
            "GROUP BY gId",
            {
                type: QueryTypes.SELECT
            }
        );

        if (!userGroups) {
            res.status(403).send({
                error: 'No groups in db..'
            });
            return
        } else {

            res.status(200).send({
                message: 'Ok! Groups fetched from db.',
                userGroups: userGroups
            });
        }

    }catch (e) {
        res.status(400).send({
            message: 'DB Query error',
            err: e.toString()
        });
    }

};

// Henter alle gruppemedlemmene - Anders Olai Pedersen 225280
exports.getGroupMembers = async (req, res) => {
    const group = await Group.findOne({where: {id : req.query.gid }});

    if (!group) {
        res.status(400).send({
            error: 'No group found'
        });
        return ;
    }

    try {
        const groupMembers = await db.sequelize.query(
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

// Blir med i gruppe - Anders Olai Pedersen 225280
exports.postJoinGroupRequest = async (req, res, next) => {
    try {
        const groupMembershipExists = GroupMembership.findAll({where: {StudentId: req.body.StudentId, GroupId: req.body.GroupId }});

        if (groupMembershipExists.length > 0) {
            res.status(400).send({
                message: "Student already in group.."
            });
            return
        }

        const groupMembership = await GroupMembership.create({
            StudentId : req.body.StudentId,
            GroupId: req.body.GroupId
        });

        if (groupMembership) {
            res.status(200).send({
                message: "Student added to group."
            })
        }
    }catch (e) {
        res.status(400).send({
            message: "Query error."
        })
    }
};

// Registerer gruppe - Anders Olai Pedersen 225280
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


        const [results, metadata] = await db.sequelize.query(`INSERT INTO groups(groupName, description, courseCode, location, StudentId) 
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
            const result = await db.sequelize.query(`INSERT INTO groupmemberships(StudentId, GroupId)
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

