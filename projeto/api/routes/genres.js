var express = require('express');
var router = express.Router();
var Genres = require('../controllers/genres')

/* GET home page. */
router.get('/', function(req, res, next) {
    Genres.getLista()
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});
router.get('/:id', function(req, res, next) {
    Genres.getGenre(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(error => res.jsonp(error))
});

module.exports = router;
