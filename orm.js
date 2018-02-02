var config = require('./knexfile');
var knex = require('knex')(config.development);
var bookshelf = require('bookshelf')(knex);

var Week = bookshelf.Model.extend({
  tableName: 'weeks',
  // posts: function() {
  //   return this.hasMany(Posts);
  // }
});

module.exports = {Week: Week, knex: knex}

