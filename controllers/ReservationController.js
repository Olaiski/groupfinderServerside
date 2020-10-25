const Rooms = require('../models/RoomModels/Room');
const RoomsReservation = require('../models/RoomModels/RoomReservation');
const sequelize = require('../util/database');
const { QueryTypes } = require('sequelize');


// TODO// Må nokk gå igjennom disse, noen endringer på DB modell fra forige prosjekt! 01/10/2020

// Henter alle reservasjoner til gruppen
// Anders Olai Pedersen - 225280
exports.getUserReservations = async (req, res) => {
    try {
        const userReservations = await sequelize.query(
            "SELECT groups.groupName, roomreservations.id AS RID, roomreservations.startDateTime AS start, roomreservations.endDateTime as end, groups.id AS GID, students.email, rooms.name AS RoomName " +
            "FROM RoomReservations " +
            "INNER JOIN rooms ON roomreservations.RoomId = rooms.id " +
            "INNER JOIN groups ON roomreservations.GroupId = groups.id " +
            "INNER JOIN groupmemberships ON groups.id = groupmemberships.GroupId " +
            "INNER JOIN students ON groupmemberships.StudentId = students.id " +
            'WHERE students.email = :user',
            {
                replacements:{user: req.userData.email},
                type: QueryTypes.SELECT
            }
        );

        if (!userReservations) {
            res.status(403).send({
                error: 'Fant ingen reservasjoner..'
            })
        }

        // const userReservationsJSON = JSON.stringify(userReservations);
        // res.status(200).send(userReservationsJSON);

        res.status(200).send({
            msg: 'Ok! Hentet bruker reservasjoner..',
            userReservations: userReservations
        });

    } catch (e) {
        res.status(400).send({
            msg: 'Fant ingen reservasjoner..'
        });
    }
};


// Henter alle ledige rom innen for dato/tidspunkt
// Anders Olai Pedersen - 225280
exports.getVacantRooms = async (req, res) => {

    try {
        let vacantRooms = await sequelize.query(
            "SELECT rooms.id, rooms.name FROM rooms " +
            "WHERE NOT EXISTS (SELECT * FROM roomreservations " +
            "WHERE roomreservations.RoomId = rooms.id " +
            "AND roomreservations.startDateTime < :tid2 " +
            "AND roomreservations.endDateTime > :tid1)",
            {
                replacements:{
                    tid1: req.query.date + ' ' + req.query.start,
                    tid2: req.query.date + ' ' + req.query.slutt
                },
                type: QueryTypes.SELECT
            }
        );

        if (!vacantRooms) {
            vacantRooms = await Rooms.findAll();
        }

        console.log(req.query)

        const vacantRoomsJSON = JSON.stringify(vacantRooms);
        res.status(200).send(vacantRoomsJSON);

    } catch (e) {
        res.status(400).send({
            msg: 'Fant ingen ledige rom..'
        })
    }
};

// Henter alle gruppene til gruppelederen
// Anders Olai Pedersen - 225280
exports.groupLeaderGroupsAll = async (req, res) => {
    try {
        const groupLeaderGroups = await sequelize.query(
            "SELECT students.id AS SID, groups.groupName, groups.description, groups.id AS GID " +
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
                msg: 'Ok, hentet gruppeleder grupper',
                groupLeaderGroups: groupLeaderGroups
            });
        } else {
            res.status(400).send({
                msg: 'Bruker er ikke gruppeleder i noen grupper'
            })
        }
    }catch (e) {
        res.status(400).send({
            msg: 'DB/Query Error..'
        });
    }
};


// Avbestiller reservasjon
// Anders Olai Pedersen - 225280
exports.cancelReservation = async (req,res) => {
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

// Oppdaterer reservasjon
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

// Reserverer rom, mangler sjekk..
// Anders Olai Pedersen - 225280
exports.reserveRoom = async (req, res) => {
    try{
        const reserveRoom = await RoomsReservation.create({
            startDateTime: req.body.startDateTime,
            endDateTime: req.body.endDateTime,
            RoomId: req.body.roomId,
            GroupId: req.body.GroupId
        });

        res.status(200).send({
            msg: `Ny reservation opprettet, GruppeId: ${reserveRoom.GroupId}`
        })

    }catch (e) {
        res.status(400).send({
            msg: 'Kunne ikke reservere rom ' + e.toString()
        });
    }


};


