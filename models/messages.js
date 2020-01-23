var mongoose = require('mongoose')

//Messages schema
var messagesSchema = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    message_body:{
        type: String,
        required: true
    }
})

var Message = module.exports= mongoose.model('Message', messagesSchema)