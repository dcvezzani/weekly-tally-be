var express = require('express');
var moment = require('moment');
var orm = require('../orm');
var router = express.Router();

function gatherWeekDays (user_id, fullWeek, days, idx, date, stopDate, done) {
	console.log([date, stopDate]);
	if (date > stopDate) {
		console.log({ days: fullWeek });
		done(fullWeek);
		return;
	}

	// console.log([days[idx], moment(days[idx].recorded_on).toString(), date.toString()]);
	if (days && days[idx] && moment(days[idx].recorded_on).format("YYYY-MM-DD") == date.format("YYYY-MM-DD")) {
		fullWeek.push (days[idx]);
		date = date.add(1, 'days');
		return gatherWeekDays (user_id, fullWeek, days, idx+1, date, stopDate, done)
	} else {
		// console.log([moment(days[idx].recorded_on).format("YYYY-MM-DD"), date.format("YYYY-MM-DD")]);
		// console.log({recorded_on: date.format("YYYY-MM-DD")});
		new orm.Day({user_id: user_id, recorded_on: date.format("YYYY-MM-DD")}).save().then((day) => {
			// console.log(day.attributes);
			fullWeek.push (day.attributes);
			date =date.add(1, 'days');
			return gatherWeekDays (user_id, fullWeek, days, idx, date, stopDate, done)
		});
	}
}

/* INDEX days. */
router.get('/user/:user_id/week', function(req, res, next) {
	let user_id = req.params.user_id;
	console.log(req.query);
	const sql = "select * from days where user_id == " + user_id + " and recorded_on >= Date('" + req.query.recordedAtStart + " 00:00:00') and recorded_on <= Date('" + req.query.recordedAtStop + " 00:00:00') order by recorded_on";
	new orm.knex.raw(sql).then((days) => {
		new Promise((resolve, reject) => {
			gatherWeekDays(user_id, [], days, 0, moment(req.query.recordedAtStart), moment(req.query.recordedAtStop), resolve)
		})
		.then((fullWeek) => {
			console.log({ days: fullWeek });
			res.json({ week: fullWeek });
		});
	});
});

/* SHOW total. */
router.get('/user/:user_id/week/all/total', function(req, res, next) {
	let user_id = req.params.user_id;
	let topic = 'all';
	console.log(req.params);

	let summable_elements = 'ifnull(sum(' + ['positive_food', 'fruits_vegetables', 'negative_food', 'water', 'after_8', 'daily_greatness', 'scripture_study', 'personal_prayer'].join('_points),0) + ifnull(sum(') + '_points),0)';

	const sql = "select (" + summable_elements + ") as total, sum(exercise_points) as exercise_total from days where user_id == " + user_id + " and recorded_on >= Date('" + req.query.recordedAtStart + " 00:00:00') and recorded_on <= Date('" + req.query.recordedAtStop + " 00:00:00') order by recorded_on";
	new orm.knex.raw(sql).then((data) => {
		console.log(["sum of points", data, data[0].total]);
		res.json({ topic: topic, total: data[0].total, asdf: 'qwer', exercise_total: data[0].exercise_total});
	});
});

/* SHOW total. */
router.get('/user/:user_id/week/:topic/total', function(req, res, next) {
	let user_id = req.params.user_id;
	let topic = req.params.topic.replace(/-/, '_');
	console.log(req.params);

	if (!['positive_food', 'fruits_vegetables', 'negative_food', 'water', 'after_8', 'exercise', 'daily_greatness', 'scripture_study', 'personal_prayer'].includes(topic)) {
		console.error({error: "unsupported topic", value: topic});
		res.json({error: "unsupported topic", value: topic});
		return;
	}

	let summable_elements = 'ifnull(sum(' + topic + "_points),0)"
	if (topic == 'all') { 
		summable_elements = 'ifnull(sum(' + ['positive_food', 'fruits_vegetables', 'negative_food', 'water', 'after_8', 'exercise', 'daily_greatness', 'scripture_study', 'personal_prayer'].join('_points),0) + ifnull(sum(') + '_points),0)'
	}

	const sql = "select (" + summable_elements + ") as total from days where user_id == " + user_id + " and recorded_on >= Date('" + req.query.recordedAtStart + " 00:00:00') and recorded_on <= Date('" + req.query.recordedAtStop + " 00:00:00') order by recorded_on";
	new orm.knex.raw(sql).then((data) => {
		console.log(["sum of points", data]);
		res.json({ topic: topic, total: data[0].total});
	});
});

/* CREATE day. */
// router.post('/user/:user_id/week/day', function(req, res, next) {
// 	let user_id = req.params.user_id;
// 	new orm.Day(req.body).save().then((day) => {
// 		res.json({ day: day });
// 	});
// });

function pointsFor (topic) {
	let pointValue = 0;
	switch (topic) {
		case 'positive_food':
		case 'fruits_vegetables':
		case 'water':
			pointValue = 10;
			break;

		case 'negative_food':
			pointValue = -2;
			break;

		case 'exercise':
			pointValue = 20;
			break;

		case 'after_8':
		case 'daily_greatness':
		case 'scripture_study':
		case 'personal_prayer':
			pointValue = 5;
			break;
	}
	return pointValue;
}

/* UPDATE day. */
router.put('/user/:user_id/week/day/:date', function(req, res, next) {
  orm.Day.where({user_id: req.params.user_id, recorded_on: req.params.date}).fetch().then((data) => {
		let attrs = {}
		for (attr in req.body) {
			let matched = attr.match(/^(.*)_checked$/);
			if (matched) {
				console.log(["matched", req.body, matched[1], pointsFor(matched[1])]);
				attrs[matched[1] + "_points"] = (req.body[matched[1] + "_checked"] == true) ? pointsFor(matched[1]) : 0;
			} else {
				attrs[attr] = req.body[attr];
			}
		}

		if (Object.keys(attrs).length > 0) {
			console.log(["attrs", attrs, data.attributes]);
			new orm.Day({id: data.id}).save(attrs).then((day) => {
				const dayAttrs = Object.assign({}, data.attributes, day.attributes);
				
				delete dayAttrs['created_at']; 
				delete dayAttrs['updated_at']; 
				
				console.log(["day", day, dayAttrs]);
				res.json({ day: dayAttrs });
			});
		} else {
			res.json({ day: data.attributes });
		}
	})
});


module.exports = router;
