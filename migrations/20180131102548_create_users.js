exports.up = async function(knex) {
  await knex.schema.createTable("users", function(t) {
    t.increments();
		t.text('name').nullable();
		t.text('email').nullable();
		t.integer('weight_factor').nullable();
		t.integer('weight_least').nullable();
    t.timestamps();
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable("users");
};
