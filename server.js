
const express = require('express')
const mongoose = require('mongoose')
const bcryt = require('bcryptjs')
const dbconfig = require('./config/DB-config')
const bodyParser  = require('body-parser')
//var expressValidator = require('express-validator');
//const passport = require('passport')
const path = require('path');
const users = {}
var Message = require('./models/messages')
var User = require('./models/user.js')
var name =''

var app = express()
var server = require('http').Server(app);
const io = require('socket.io').listen(server)
server = server.listen(3000)


app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended: false}));
//app.use(expressValidator())
// app.use(passport.initialize())
// app.use(passport.session())

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/login.html'));
});

app.post('/login', function (req, res) {

    // passport.authenticate('local', {
    //     successRedirect: '/',
    //     failureRedirect: '/login',
    //     //failureFlash: true
    // })
    name = req.body.usernameLogin
    password = req.body.passwordLogin

    // req.checkBody('name','Username is required').notEmpty();
    // req.checkBody('password','Password is required').notEmpty();
     
    res.redirect('/');
     
     console.log(name)
});

app.post('/', function (req, res, next) {

     res.redirect('/login');
     
});

mongoose.connect(dbconfig.database)
var db = mongoose.connection;
var messagesCollection = db.collection('messages')

//checking the connection
db.once('open', function () {
    console.log('Connected to MongoDB')
})

//check for database errors
db.on('error', function (err) {
    console.log(err)
})

io.on('connection', socket => {
    //when user connects
    socket.on('new-user', () => {
        users[socket.id] = name

        messagesCollection.find().toArray().then(function (docs) {
            socket.emit('chat-history', {docs: docs, name: name})
        })

        socket.broadcast.emit('user-connected', name)
    })

    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })

    socket.on('store-chat-message', data => {
        var myMessage = new Message();

        myMessage.username = users[socket.id]
        myMessage.time = data.time
        myMessage.message_body = data.message

        myMessage.save(function (err) {
            if (err) {
                console.log(err)
                return
            }
            else {
                console.log('Message Inserted')
            }
        })
    })

    socket.on('disconnect', (req, res) => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })

    socket.on('register-user', data => {
        var newUser = new User()

        newUser.username = data.username
        newUser.password = data.password

        //check if the username entered is already used

        //hash password before saving it
        bcryt.genSalt(10, function (err, salt) {
            bcryt.hash(newUser.password, salt, function (err, hash) {
                if (err) {
                    if(err.name === 'MongoError' && err.code === 11000){
                        socket.emit('user-exists')
                    }
                    console.log(err)
                }
                else {
                    newUser.password = hash
                    newUser.save(function (err) {
                        if (err) {
                            console.log(err)
                            return
                        }
                        else {
                            console.log('User Inserted')
                        }
                    })
                }
            })
        })
    })

})