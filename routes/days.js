var express = require('express');
var moment = require('moment');
var orm = require('../orm');
var router = express.Router();

function gatherWeekDays (fullWeek, days, idx, date, stopDate, done) {
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
		return gatherWeekDays (fullWeek, days, idx+1, date, stopDate, done)
	} else {
		// console.log([moment(days[idx].recorded_on).format("YYYY-MM-DD"), date.format("YYYY-MM-DD")]);
		// console.log({recorded_on: date.format("YYYY-MM-DD")});
		new orm.Day({recorded_on: date.format("YYYY-MM-DD")}).save().then((day) => {
			// console.log(day.attributes);
			fullWeek.push (day.attributes);
			date =date.add(1, 'days');
			return gatherWeekDays (fullWeek, days, idx, date, stopDate, done)
		});
	}
}

/* INDEX days. */
router.get('/', function(req, res, next) {
	console.log(req.query.recordedAtStart);
	const sql = "select * from days where recorded_on >= Date('" + req.query.recordedAtStart + " 00:00:00') and recorded_on <= Date('" + req.query.recordedAtStop + " 00:00:00') order by recorded_on";
	new orm.knex.raw(sql).then((days) => {
		new Promise((resolve, reject) => {
			gatherWeekDays([], days, 0, moment(req.query.recordedAtStart), moment(req.query.recordedAtStop), resolve)
		})
		.then((fullWeek) => {
			console.log({ days: fullWeek });
			res.json({ week: fullWeek });
		});
	});
});

/* CREATE day. */
router.post('/day', function(req, res, next) {
	new orm.Day(req.body).save().then((day) => {
		res.json({ day: day });
	});
});

function pointsFor (topic) {
	let pointValue = 0;
	switch (topic) {
		case 'positive_food':
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
router.put('/day/:date', function(req, res, next) {
  orm.Day.where({recorded_on: req.params.date}).fetch().then((data) => {
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
