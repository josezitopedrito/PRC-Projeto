var express = require('express');
var router = express.Router();
var Bands = require('../controllers/bands')
const verify = require('./verifytoken')

/* GET home page. */
router.get('/', function(req, res, next) {
    Bands.getLista()
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});
router.get('/:id', function(req, res, next) {
    Bands.getBand(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});
router.post('/inserir', verify,function(req,res){
    Bands.inserir(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});
router.post('/editar',verify, function(req,res){
    Bands.editar(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;
