require('dotenv').config();
const socketIO = require('socket.io');

//server
const app = require('./server/config');

//Initialization DB
require('./database');

//Initialization Passport
require('./configs/passport.config');

//Initialization server
const server = app.listen(app.get('port'), () => {
    console.log('server on port: ' + app.get('port'));
});

//webSocket
const io = socketIO(server);

//Initialization socket
require('./socket')(io);