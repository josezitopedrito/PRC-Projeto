var express = require('express');
var router = express.Router();
var Users = require('../controllers/users')
var Requests = require('../controllers/requests')

//for test purposes, /registo is protected
//use "verify" middleware to protect a function
const verify = require('./verifytoken')
const verifyadmin = require('./verifytokenadmin')
///////////////

/* GET home page. */
router.get('/', verifyadmin, function(req,res){
    Users.listar()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

router.post('/login', function(req, res, next) {
    Users.login(req.body)
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});
router.post('/registo', function(req, res, next) {
    Requests.registo(req.body)
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});

router.get('/pedidos', verifyadmin, function(req,res){
    Requests.listar()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

router.post('/pedidos', verifyadmin, function(req,res){
    Users.registo(req.body.user)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});


router.post('/myFavs', verify, function(req,res){
    Users.myFavs(req.body.email)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

router.post('/newFav', verify, function(req,res){
    Users.newFav(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});
router.post('/elimFav', verify, function(req,res){
    Users.elimFav(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});


router.delete('/:id', verifyadmin, function(req,res){
    Users.eliminar(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

router.delete('/pedidos/:id', verifyadmin, function(req,res){
    Requests.eliminar(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;