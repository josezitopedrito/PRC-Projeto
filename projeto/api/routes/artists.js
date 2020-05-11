var express = require('express');
var router = express.Router();
var Artists = require('../controllers/artists')

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
router.post('/inserir', function(req,res){
    Artists.inserir(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})

module.exports = router;
