const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
	password: String,
    username: String,
    tipo: String,
    favs:Array
})

module.exports = mongoose.model('users', userSchema)