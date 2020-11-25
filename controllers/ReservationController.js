// const Rooms = require('../sequelizeModels/Room');
// const RoomsReservation = require('../sequelizeModels/RoomReservation');
// const sequelize = require('../util/database');
const { QueryTypes } = require('sequelize');

const db = require('../models');
const Room = db.Room;
const RoomReservation = db.RoomReservation;


// Henter alle fremtidige reservasjoner til gruppen
// Anders Olai Pedersen - 225280
exports.getUserReservations = async (req, res) => {
    try {
        const userReservations = await db.sequelize.query(
            "SELECT groups.groupName, roomreservations.startDateTime AS start, roomreservations.endDateTime as end, rooms.name AS roomName, rooms.location AS location, roomreservations.id AS rId " +
            "FROM roomreservations " +
            "INNER JOIN rooms ON roomreservations.RoomId = rooms.id " +
            "INNER JOIN groups ON roomreservations.GroupId = groups.id " +
            "INNER JOIN groupmemberships ON groups.id = groupmemberships.GroupId " +
            "INNER JOIN students ON groupmemberships.StudentId = students.id " +
            "WHERE students.email = :user " +
            "AND roomreservations.startDateTime > NOW() " +
            "ORDER BY roomreservations.startDateTime ASC",
            {
                replacements:{user: req.query.email},
                type: QueryTypes.SELECT,
                raw: true
            }
        );

        if (!userReservations) {
            res.status(403).send({
                error: 'Fant ingen reservasjoner..'
            })
        }

        let reservations = [];
        for (let i in userReservations) {
            reservations.push(
                {
                    rId: userReservations[i].rId,
                    groupName: userReservations[i].groupName,
                    date: userReservations[i].start.substr(0, 10),
                    start: userReservations[i].start.substr(11, 14),
                    end: userReservations[i].end.substr(11, 14),
                    roomName: userReservations[i].roomName,
                    location: userReservations[i].location
                }
            )
        }
        res.status(200).send({
            message: 'Ok! Hentet bruker reservasjoner..',
            userReservations: reservations
        });

    } catch (e) {
        res.status(400).send({
            message: "Query error"
        });
    }
};

// Henter alle ledige rom innen for dato/tidspunkt
// Anders Olai Pedersen - 225280
exports.getVacantRooms = async (req, res) => {

    try {
        let vacantRooms = await db.sequelize.query(
            "SELECT rooms.id, rooms.name FROM rooms " +
            "WHERE NOT EXISTS (SELECT * FROM roomreservations " +
            "WHERE roomreservations.RoomId = rooms.id " +
            "AND roomreservations.startDateTime < :time2 " +
            "AND roomreservations.endDateTime > :time1)",
            {
                replacements:{
                    time1: req.query.date + ' ' + req.query.start,
                    time2: req.query.date + ' ' + req.query.end
                },
                type: QueryTypes.SELECT
            }
        );

        // console.log(req.query)
        // console.log(vacantRooms)

        if (!vacantRooms) {
            vacantRooms = await Room.findAll();
        }

        // const vacantRoomsJSON = JSON.stringify(vacantRooms);

        res.status(200).send({
            message: 'Hentet ledige rom',
            vacantRooms: vacantRooms
        });

    } catch (e) {
        res.status(400).send({
            msg: 'Fant ingen ledige rom..'
        })
    }
};

// Henter alle gruppene til gruppelederen, brukes til reservasjon av rom
// Anders Olai Pedersen - 225280
exports.groupLeaderGroupsAll = async (req, res) => {
    try {
        const groupLeaderGroups = await db.sequelize.query(
            "SELECT students.id, groups.groupName, groups.description, groups.id " +
            "FROM groups " +
            "INNER JOIN students on groups.StudentId = students.id " +
            "WHERE students.email = :user ",
            {
                replacements: {user: req.query.email},
                type: QueryTypes.SELECT
            }
        );

        if (groupLeaderGroups.length > 0) {
            res.status(200).send({
                message: 'Ok, hentet gruppeleder grupper',
                groupLeaderGroups: groupLeaderGroups
            });
        } else {
            res.status(400).send({
                message: 'Bruker er ikke gruppeleder i noen grupper'
            })
        }
    }catch (e) {
        res.status(400).send({
            message: 'DB/Query Error..'
        });
    }
};

// Reserverer rom, mangler sjekk..
// Anders Olai Pedersen - 225280
exports.reserveRoom = async (req, res) => {
    try{
        const reserveRoom = await RoomReservation.create({
            startDateTime: req.body.startDateTime,
            endDateTime: req.body.endDateTime,
            RoomId: req.body.roomId,
            GroupId: req.body.GroupId
        });

        res.status(200).send({
            message: `Ny reservation opprettet, GruppeId: ${reserveRoom.GroupId}`
        })

    }catch (e) {
        res.status(400).send({
            message: 'Kunne ikke reservere rom ' + e.toString()
        });
    }


};

// Avbestiller reservasjon (Blir ikke brukt i frontend)
// Anders Olai Pedersen - 225280
exports.cancelReservation = async (req,res) => {
    try {
        const GroupId = await db.sequelize.query(
            "SELECT roomreservations.GroupId " +
            "FROM roomreservations " +
            "WHERE roomreservations.id = :RID",
            {
                replacements: {
                    RID: req.query.RID
                },
                type: QueryTypes.SELECT,
                raw:true
            }
        );


        const GroupIdValue = GroupId[0].GroupId;
        const studId = await db.sequelize.query (
            "SELECT groups.StudentId " +
            "FROM groups " +
            "WHERE groups.id = :GroupId",
            {
                replacements: {
                    GroupId: GroupIdValue
                },
                type: QueryTypes.SELECT
            }
        );

        const studIdUD = req.userData.id;
        const idVal = studId[0].StudentId;
        if (studIdUD === idVal) {
            const resToCancel = await RoomsReservation.destroy({where: {id : req.query.RID}});
            res.status(200).send({
                msg:'Reservasjon slettet!'
            });
        } else {
            res.status(200).send({
                msg:'Endring ble ikke utført. Bare gruppeleder kan avbestille reservasjon!'
            });
        }

    }catch (e) {
        res.status(400).send({
            msg: 'Katastrofe.. ' + e.toString()
        });
    }
};

// Oppdaterer reservasjon (Blir ikke brukt i frontend)
// Anders Olai Pedersen - 225280
exports.updateReservation = async (req, res) => {

    try {
        const GroupId = await sequelize.query(
            "SELECT roomreservations.GroupId " +
            "FROM roomreservations " +
            "WHERE roomreservations.id = :RID",
            {
                replacements: {
                    RID: req.query.RID
                },
                type: QueryTypes.SELECT,
                raw:true
            }
        );

        const GroupIdValue = GroupId[0].GroupId;
        const studId = await sequelize.query (
            "SELECT groups.StudentId " +
            "FROM groups " +
            "WHERE groups.id = :GroupId",
            {
                replacements: {
                    GroupId: GroupIdValue
                },
                type: QueryTypes.SELECT
            }
        );

        const studIdUD = req.userData.id;
        const idVal = studId[0].StudentId;

        if (studIdUD === idVal) {
            const resToUpdate = await sequelize.query(
                "UPDATE roomreservations " +
                "SET roomreservations.startDateTime = :nyStartTid, " +
                "roomreservations.endDateTime = :nySluttTid, " +
                "roomreservations.RoomId = :roomId " +
                "WHERE id = :RID",
                {
                    replacements: {
                        RID: req.query.RID,
                        nyStartTid: req.query.nyStartTid,
                        nySluttTid: req.query.nySluttTid,
                        roomId: req.query.roomId
                    },
                    type: QueryTypes.UPDATE
                }
            );

            res.status(200).send({
                msg: 'Oppdatert reservasjon!'
            });

        } else {
            res.status(200).send({
                msg:'Endring ble ikke utført. Bare gruppeleder kan endre reservasjon!'
            });
        }


    } catch (e) {
        res.status(400).send({
            msg: 'Reservasjon finnes ikke'
        });
    }
};
