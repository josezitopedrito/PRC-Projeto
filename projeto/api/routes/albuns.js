var express = require('express');
var router = express.Router();
var Albuns = require('../controllers/albuns')
const verify = require('./verifytoken')

/* GET home page. */
router.get('/',function(req, res, next) {
    var i = false
    for(var key in req.query) {
        if(req.query.hasOwnProperty(key))
            i = true;
    }
    if(i == true){
        Albuns.getLista(req.query.data)
            .then(dados => res.jsonp(dados))
            .catch(error => res.jsonp(error))
    }else{
        Albuns.getLista("all")
            .then(dados => res.jsonp(dados))
            .catch(error => res.jsonp(error))
    }
});
router.get('/albumsByDate', function(req, res, next) {
    Albuns.getListaOrdenada()
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});
router.get('/favoritos', function(req,res,next) {
    Albuns.getFavoritos()
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});
router.get('/:id', function(req, res, next) {
    Albuns.getAlbum(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});
router.post('/inserir',verify, function(req,res){
    Albuns.inserir(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});
router.post('/editar', verify,function(req,res){
    Albuns.editar(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;