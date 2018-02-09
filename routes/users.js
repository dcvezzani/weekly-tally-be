var express = require('express');
var router = express.Router();
var orm = require('../orm');

/* GET users listing. */
router.get('/user/:user_id', function(req, res, next) {
  orm.User.where({id: req.params.user_id}).fetch().then((user) => {
			res.json({ user: user.attributes });
  });
});

router.put('/user/:user_id', function(req, res, next) {
  let attrs = req.body;
	new orm.User({id: req.params.user_id}).save(attrs).then((user) => {
		res.json({ user: user.attributes });
  });
});

module.exports = router;

