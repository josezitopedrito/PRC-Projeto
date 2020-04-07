var express = require('express');
var router = express.Router();
var Producers = require('../controllers/producers')

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

module.exports = router;
