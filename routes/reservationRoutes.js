const router = require('express').Router();
const ReservationController = require('../controllers/ReservationController');
// const middlewareUser = require('./middlewareUser');


// router.get('/kalender', middlewareUser.isLoggedIn, (req,res) =>{});

router.post('/reserveRoom', ReservationController.reserveRoom);
router.delete('/cancelReservation', ReservationController.cancelReservation);
router.post('/updateReservation',  ReservationController.updateReservation);

router.get('/groupLeaderGroups',  ReservationController.groupLeaderGroupsAll);
router.get('/userReservations', ReservationController.getUserReservations);
router.get('/vacantRooms', ReservationController.getVacantRooms);



module.exports = router;