const router = require('express').Router();
const GroupController = require('../controllers/GroupController');


router.get('/userGroups',  GroupController.getUserGroups);
router.get('/groupMembers', GroupController.getGroupMembers);

router.post('/registerGroup', GroupController.postRegisterGroup);


module.exports = router;