const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const sequelize = require('./util/database');
const db = require("./models");
const models = require('./sequelizeModels');
const authRoute = require('./routes/authRoutes');
const reservationRoute = require('./routes/reservationRoutes');
const groupRoute = require('./routes/groupRoutes');
const homeRoute = require('./routes/homeRoutes');



const app = express();
app.use(express.json());
app.use(bodyParser.json()); // Handles JSON data
app.use(bodyParser.urlencoded({ extended : true })); // Handles URL-encoded data
app.use(cors()); // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.


// Route middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


// API routes
app.use('/api/auth', authRoute);
app.use('/api/user', reservationRoute);
app.use('/api/user', groupRoute);
app.use('/api/user', homeRoute);

// Import database models
// const Student = require('./sequelizeModels/Student');
// const Group = require('./sequelizeModels/Group');
// const GroupMembership = require('./sequelizeModels/GroupMembership');
//
// const Room = require('./sequelizeModels/Room');
// const RoomReservation = require('./sequelizeModels/RoomReservation');
// const RoomType = require('./sequelizeModels/RoomType');

const Student = db.Student;
const Group = db.Group;
const GroupMembership = db.GroupMembership;

const Room = db.Room;
const RoomReservation = db.RoomReservation;
const RoomType = db.RoomType;

//----- Database relations (Sequelize) ----- Object-Relational-Mapping //
//hasOne - adds a foreign key to the target and singular association mixins to the source.
//belongsTo - add a foreign key and singular association mixins to the source.
//hasMany - adds a foreign key to target and plural association mixins to the source.
//belongsToMany - creates an N:M association with a join table and adds plural association mixins to the source. The junction table is created with sourceId and targetId.



Room.hasOne(RoomReservation);
Group.hasMany(RoomReservation);
RoomType.hasOne(Room);
Student.belongsToMany(Group, {through: GroupMembership});
Group.belongsTo(Student);

app.get('/', function (req,res) {
    res.send(JSON.stringify({identity: 'Yolo'}))
});

const PORT = process.env.PORT || 3000;
db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log("Listening on " + PORT)
    })
});

// db.sequelize
//     .sync()
//     .then(() => {
//       app.listen(PORT);
//       console.log(`Server started on port ${PORT}`)
//     })
//     .catch(error => {
//       console.log(error)
//     });

