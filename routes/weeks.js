var express = require('express');
var orm = require('../orm');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	new orm.Week().fetchAll({}).then((weeks) => {
		res.json({ title: 'Express', weeks: weeks });
	});
});

router.post('/', function(req, res, next) {
	new orm.Week(req.body).save().then((week) => {
		res.json({ title: 'Express', week: week });
	});
});

router.put('/:id', function(req, res, next) {
	new orm.Week({id: req.params.id}).save(req.body, {patch: true}).then((week) => {
		res.json({ title: 'Express', week: week });
	});
});


module.exports = router;
