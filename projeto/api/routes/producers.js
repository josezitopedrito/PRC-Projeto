var express = require('express');
var router = express.Router();
var Producers = require('../controllers/producers')
const verify = require('./verifytoken')

/* GET home page. */
router.get('/', function(req, res, next) {
    Producers.getLista()
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});
router.get('/:id', function(req, res, next) {
    Producers.getProducer(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});
router.post('/inserir',verify, function(req,res){
    Producers.inserir(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});
router.post('/editar',verify, function(req,res){
    Producers.editar(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;
