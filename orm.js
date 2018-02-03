var config = require('./knexfile');
var knex = require('knex')(config.development);
var bookshelf = require('bookshelf')(knex);

var Day = bookshelf.Model.extend({
  tableName: 'days',
  // posts: function() {
  //   return this.hasMany(Posts);
  // }
});

module.exports = {Day: Day, knex: knex}

