// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }, 
		useNullAsDefault: true, 
		debug: true, 
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: './prod.sqlite3'
    }
  },

};
