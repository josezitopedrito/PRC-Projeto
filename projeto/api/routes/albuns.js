var express = require('express');
var router = express.Router();
var Albuns = require('../controllers/albuns')

/* GET home page. */
router.get('/', function(req, res, next) {
    Albuns.getLista()
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});
router.get('/:id', function(req, res, next) {
    Albuns.getAlbum(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});

module.exports = router;