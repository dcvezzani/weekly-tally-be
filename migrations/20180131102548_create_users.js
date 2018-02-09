exports.up = async function(knex) {
  await knex.schema.createTable("users", function(t) {
		t.increments('id').unsigned().primary();
		t.string('google_id').nullable();
		t.text('given_name').nullable();
		t.text('family_name').nullable();
		t.text('email').nullable();
		t.text('picture').nullable();
		t.integer('weight_factor').nullable();
		t.integer('weight_least').nullable();
    t.timestamps();
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable("users");
};

