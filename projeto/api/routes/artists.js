var express = require('express');
var router = express.Router();
var Artists = require('../controllers/artists')
const verify = require('./verifytoken')

/* GET home page. */
router.get('/', function(req, res, next) {
    Artists.getLista()
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});
router.get('/:id', function(req, res, next) {
    Artists.getArtist(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});
router.post('/inserir',verify, function(req,res){
    Artists.inserir(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});
router.post('/editar',verify, function(req,res){
    Artists.editar(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;
