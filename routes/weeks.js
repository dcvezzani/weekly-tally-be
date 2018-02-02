var express = require('express');
var moment = require('moment');
var orm = require('../orm');
var router = express.Router();

function gatherWeekDays (fullWeek, weeks, idx, date, stopDate) {
	// console.log([date, stopDate]);
	if (date > stopDate) {
		return fullWeek
	}

	// console.log([weeks[idx], moment(weeks[idx].recorded_at).toString(), date.toString()]);
	if (weeks[idx] && moment(weeks[idx].recorded_at).format("YYYY-MM-DD") == date.format("YYYY-MM-DD")) {
		fullWeek.push (weeks[idx]);
		date = date.add(1, 'days');
		return gatherWeekDays (fullWeek, weeks, idx+1, date, stopDate)
	} else {
		console.log([moment(weeks[idx].recorded_at).format("YYYY-MM-DD"), date.format("YYYY-MM-DD")]);
		// console.log({recorded_at: date.format("YYYY-MM-DD")});
		new orm.Week({recorded_at: date.format("YYYY-MM-DD")}).save().then((week) => {
			fullWeek.push (week);
			date =date.add(1, 'days');
			return gatherWeekDays (fullWeek, weeks, idx, date, stopDate)
		});
	}
}

/* INDEX week. */
router.get('/', function(req, res, next) {
	console.log(req.query.recordedAtStart);
	const sql = "select * from weeks where recorded_at >= Date('" + req.query.recordedAtStart + " 00:00:00') and recorded_at <= Date('" + req.query.recordedAtStop + " 00:00:00') order by recorded_at";
	new orm.knex.raw(sql).then((weeks) => {
		const fullWeek = gatherWeekDays([], weeks, 0, moment(req.query.recordedAtStart), moment(req.query.recordedAtStop));
		res.json({ weeks: fullWeek });
	});
});

/* CREATE week. */
router.post('/', function(req, res, next) {
	new orm.Week(req.body).save().then((week) => {
		res.json({ title: 'Express', week: week });
	});
});

/* UPDATE week. */
router.put('/:date', function(req, res, next) {
  orm.Week.where({recorded_at: req.params.date}).fetch({columns: 'id'}).then((data) => {
		new orm.Week({id: data.id}).save(req.body, {patch: true}).then((week) => {
			res.json({ week: week });
		});
	})
});


module.exports = router;



function findWeek(weeks, date){
	const mdate = moment(date);
	for (week of weeks) {
		let wdate = week.recorded_at;
		if (mdate == wdate)
			return week;
	}
	return null;
}

function fetchWeekDay (date) {
	return new Promise((resolve, reject) => {
		const fdate = moment(date).format('YYYY-MM-DD')
		new orm.Week({recorded_at: fdate}).fetch()
		.then((week) => {
			if (week != null) {
				resolve({ weekDay: week });
			} else {
				reject("no record in database for: " + date);
			}
		})
	})
	.catch((err) => { reject(err) });
}

function createWeekDay (date) {
	return new Promise((resolve, reject) => {
		const fdate = moment(date).format('YYYY-MM-DD')
		new orm.Week({recorded_at: fdate}).save().then((week) => {
			if (week != null) {
				resolve({ weekDay: week });
			} else {
				reject("no record created in database for: " + date);
			}
		});
	})
	.catch((err) => { reject(err) });
}

/* INDEX week. */
router.get('/', function(req, res, next) {
	// new orm.Week().fetchAll({}).then((weeks) => {
	// console.log(req.query);
	const sql = "select * from weeks where recorded_at >= Date('" + req.query.recordedAtStart + " 00:00:00') and recorded_at <= Date('" + req.query.recordedAtStop + " 00:00:00')";
	// console.log(sql);
	new orm.knex.raw(sql).then((weeks) => {
		// console.log(weeks);

		const startDate = moment(date).startOf('week').format('YYYY-MM-DD');
		const stopDate = moment(date).endOf('week').format('YYYY-MM-DD');
		let fullWeek = [];
		let date = moment(req.query.recordedAtStart);

		for (let idx=0; idx<7; idx+=1) {
			fetchWeekDay (date)
			.then((json) => {
				fullWeek.push (date);
				date = moment(date).add(1, 'days');
			})
			.catch((e) => {
				createWeekDay (date).then(() => {})
				idx -= 1;
			})
		}
		
		res.json({ weeks: weeks });
	});
});

