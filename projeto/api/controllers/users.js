var User = require('../models/users')
const mongoose = require('mongoose')
var fs = require('fs')
var path = require('path')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')


module.exports.listar = () => {
    return User
        .find()
        .exec()
}

module.exports.listarFriends = id => {
    return User
        .find({amigos : id})
        .exec()
}

module.exports.consultar = id => {
    return User
        .findOne({email: id})
        .exec()
}

/*
module.exports.registo = user => {
    user._id = mongoose.Types.ObjectId()
    var novo = new User(user)
    return novo.save()
}*/

module.exports.registo = async function (user){
    console.log("registando")
    try{
        var response= await User.findOne({email: user.email})
        if (response){
            return{status:"O Email fornecido já foi registado."}
        }
        else{
            var hash = bcrypt.hashSync(user.password, 10);
            user._id = mongoose.Types.ObjectId()
            var novo = new User(user)
            novo.password=hash
            novo.save()
            return {status:"inserido"}
        }

    }catch(e){
        throw(e)
    } 
}

module.exports.login = async function (user){
    console.log("loggin")
    try{
        var response= await User.findOne({email: user.email})
        if (response){
            if(bcrypt.compareSync(user.password, response.password)){
                //build user
                var userval = {}
                userval.email = response.email
                userval.username = response.username
                userval.tipo = response.tipo
                userval._id= response._id
                //build jwt
                const token = jwt.sign({_id: response._id}, 'prcproject')
                return{token: token, user: userval}
            }
        }
        else{
            return{status:"Wrong password or email."}
        }
    }catch(e){
        throw(e)
    } 
}



module.exports.eliminar = id => {
    return User
        .deleteOne({email: id})
        .exec()
}