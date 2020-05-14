var express = require('express');
var router = express.Router();
var RecordLabels = require('../controllers/rlabels')

/* GET home page. */
router.get('/', function(req, res, next) {
    RecordLabels.getLista()
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});
router.get('/:id', function(req, res, next) {
    RecordLabels.getRecordLabel(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});
router.post('/inserir', function(req,res){
    RecordLabels.inserir(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});
router.post('/editar', function(req,res){
    RecordLabels.editar(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;
