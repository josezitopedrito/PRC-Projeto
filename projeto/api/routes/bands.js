var express = require('express');
var router = express.Router();
var Bands = require('../controllers/bands')

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

module.exports = router;
