var mongoose = require('mongoose')

//Users schema
var usersSchema = mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

var User = module.exports = mongoose.model('User', usersSchema)