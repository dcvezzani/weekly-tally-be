exports.up = async function(knex) {
  await knex.schema.createTable("users", function(t) {
    t.increments();
    t.timestamps();
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable("users");
};
