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

module.exports = router;
