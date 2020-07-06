var User = require('../models/users')
var Requests = require('../models/requests')
const mongoose = require('mongoose')
var fs = require('fs')
var path = require('path')
var axios = require('axios')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')

var prefixes = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX noInferences: <http://www.ontotext.com/explicit>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX c: <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
`
var getLink = "http://localhost:7200/repositories/PRC-PROJECT" + "?query=" 

var postLink = "http://localhost:7200/repositories/PRC-PROJECT/statements" + "?update=" 

function normalize(response) {
    return response.results.bindings.map(obj =>
        Object.entries(obj)
            .reduce((new_obj, [k,v]) => (new_obj[k] = v.value, new_obj),
                    new Object()));
};

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
            console.log("email:" +user.email)
            await Requests.deleteOne({email:user.email})
            user._id = mongoose.Types.ObjectId()
            var novo = new User(user)
            novo.favs=[]
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
                userval._id = response._id
                userval.favs = response.favs
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

module.exports.newFav = async function (cont){
    console.log("new Fav")
    console.log(JSON.stringify(cont))
    try{
        let response= await User.findOne({email: cont.user.email})
        if (response){
            var userval = {}
            userval.email = response.email
            userval.password = response.password
            userval.username = response.username
            userval.tipo = response.tipo
            userval._id = response._id
            let arr = response.favs
            User.deleteOne({email: cont.user.email}).exec()
            arr.push(cont.fav)
            userval.favs = []
            for(let i=0;i<arr.length;i++){
                if(!userval.favs.includes(arr[i])){
                    userval.favs.push(arr[i])
                }
            }
            console.log("Val:" + userval.favs)
            var user = new User(userval)
            user.save()
            if(arr.length != userval.favs.length){
                return{status:"já é favorito"}
            }
            let getVotes = `select ?vote where {
                                c:${cont.fav} c:votes ?vote.
                            }`
            let encodedGet = encodeURIComponent(prefixes + getVotes)
            var responseGet = await axios.get(getLink + encodedGet)
            var normalizedResponseGet = parseInt(normalize(responseGet.data)[0].vote,10)
           
            var delVotes = `DELETE DATA {
                c:${cont.fav} c:votes \"${normalizedResponseGet}\".
            }`
            var encodedDel = encodeURIComponent(prefixes + delVotes)
            await axios.post(postLink + encodedDel, null).then(() => {
                console.log("Delete dos votos do album bem sucedido")
              }).catch(e => {
                console.log(e)
            })
            console.log("Val 2:" + normalizedResponseGet)
            var insVotes = `INSERT DATA {
                c:${cont.fav} c:votes \"${normalizedResponseGet + 1}\".
            }`
            console.log(insVotes)
            var encodedIns = encodeURIComponent(prefixes + insVotes)
            await axios.post(postLink + encodedIns, null).then(() => {
                console.log("Insert dos votos do album bem sucedido")
              }).catch(e => {
                console.log(e)
            })
            return {status:"inserido"}
        }
        else{
            return{status:"ocorreu um erro"}
        }
    }catch(e){
        throw(e)
    } 
}

module.exports.myFavs = async function(email){
    console.log("favs")
    try{
        var response= await User.findOne({email: email})
        if (response){
            var favs = []
            for (let i = 0;i < response.favs.length;i++){
                favs.push(response.favs[i])
            }
            return{favs:favs}
        }
        else{
            return{favs:"ocorreu um erro"}
        }
    }
    catch(e){
        throw(e)
    }
}

module.exports.elimFav = async function(res){
    console.log("favs")
    try{
        var response = await User.findOne({email: res.user.email})
        if (response){
            console.log(JSON.stringify(response))
            var userval = {}
            userval.email = response.email
            userval.password = response.password
            userval.username = response.username
            userval.tipo = response.tipo
            userval._id = response._id
            userval.favs = []
            for (let i = 0;i < response.favs.length;i++){
                if(response.favs[i] != res.fav){
                    userval.favs.push(response.favs[i])
                }
            }
            console.log("pila1")
            User.deleteOne({email: res.user.email}).exec()
            console.log("pila1.5")
            var user = new User(userval)
            user.save()
            console.log("pila2")

            var getVotes = `select ?vote where {
                c:${res.fav} c:votes ?vote.
            }`
            var encodedGet = encodeURIComponent(prefixes + getVotes)
            var responseGet = await axios.get(getLink + encodedGet)
            var normalizedResponseGet = parseInt(normalize(responseGet.data)[0].vote,10)
            var delVotes = `DELETE DATA {
                c:${res.fav} c:votes \"${normalizedResponseGet}\".
            }`
            console.log("pila3")
            var encodedDel = encodeURIComponent(prefixes + delVotes)
            await axios.post(postLink + encodedDel, null).then(() => {
                console.log("Delete dos votos do album bem sucedido")
              }).catch(e => {
                console.log(e)
            })
            var insVotes = `INSERT DATA {
                c:${res.fav} c:votes \"${normalizedResponseGet - 1}\".
            }`
            console.log("pila4")
            var encodedIns = encodeURIComponent(prefixes + insVotes)
            await axios.post(postLink + encodedIns, null).then(() => {
                console.log("Insert dos votos do album bem sucedido")
              }).catch(e => {
                console.log(e)
            })
            return {status:"removido"}
        }
        else{
            return{favs:"ocorreu um erro"}
        }
    }
    catch(e){
        throw(e)
    }
}


module.exports.eliminar = id => {
    return User
        .deleteOne({email: id})
        .exec()
}