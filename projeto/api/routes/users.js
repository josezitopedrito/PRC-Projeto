var express = require('express');
var router = express.Router();
var Users = require('../controllers/users')

//for test purposes, /registo is protected
//use "verify" middleware to protect a function
const verify = require('./verifytoken')
///////////////

/* GET home page. */
router.post('/login', function(req, res, next) {
    Users.login(req.body)
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});
router.post('/registo', function(req, res, next) {
    console.log("here")
    console.log(JSON.stringify(req.body))
    Users.registo(req.body)
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});
router.get('/myFavs', function(req,res){
    Users.myFavs()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});
router.post('/newFav', function(req,res){
    Users.newFav(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;