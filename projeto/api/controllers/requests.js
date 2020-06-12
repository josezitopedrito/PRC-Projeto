var Requests = require('../models/requests')
const mongoose = require('mongoose')
var fs = require('fs')
var path = require('path')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')

module.exports.listar = () => {
    return Requests
        .find()
        .exec()
}

module.exports.listarFriends = id => {
    return Requests
        .find({amigos : id})
        .exec()
}

module.exports.consultar = id => {
    return Requests
        .findOne({email: id})
        .exec()
}

module.exports.registo = async function (request){
    console.log("registando")
    try{
        var response= await Requests.findOne({email: request.email})
        if (response){
            return{status:"O Email fornecido já foi registado."}
        }
        else{
            var hash = bcrypt.hashSync(request.password, 10);
            request._id = mongoose.Types.ObjectId()
            var novo = new Requests(request)
            novo.password=hash
            novo.favs=[]
            novo.save()
            return {status:"inserido"}
        }

    }catch(e){
        throw(e)
    } 
}



module.exports.eliminar = id => {
    return Requests
        .deleteOne({email: id})
        .exec()
}