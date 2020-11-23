const router = require('express').Router();
const GroupController = require('../controllers/GroupController');

/**
 * Routes til gruppe kontrollern
 */

// GET
router.get('/userGroups',  GroupController.getUserGroups);
router.get('/allGroups', GroupController.getAllGroups);
router.get('/groupMembers', GroupController.getGroupMembers);

// POST
router.post('/registerGroup', GroupController.postRegisterGroup);
router.post('/joinGroup', GroupController.postJoinGroupRequest);


module.exports = router;