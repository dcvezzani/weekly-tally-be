
exports.up = function(knex, Promise) {
	return knex.schema.createTable('days', function(t) {
			t.increments('id').unsigned().primary();

			t.dateTime('recorded_on').notNull();
		
			t.text('positive_food_details').nullable();
			t.integer('positive_food_points').nullable();

			t.text('fruits_vegetables_details').nullable();
			t.integer('fruits_vegetables_points').nullable();

			t.text('negative_food_details').nullable();
			t.integer('negative_food_points').nullable();

			t.text('water_details').nullable();
			t.integer('water_points').nullable();

			t.text('exercise_details').nullable();
			t.integer('exercise_points').nullable();

			t.text('after_8_details').nullable();
			t.integer('after_8_points').nullable();

			t.text('daily_greatness_details').nullable();
			t.integer('daily_greatness_points').nullable();

			t.text('scripture_study_details').nullable();
			t.integer('scripture_study_points').nullable();

			t.text('personal_prayer_details').nullable();
			t.integer('personal_prayer_points').nullable();

			//t.decimal('price', 6, 2).notNull();
			//t.enum('category', ['apparel', 'electronics', 'furniture']).notNull();
			t.timestamps();
	});
};

exports.down = function(knex, Promise) {
	knex.schema.dropTable('days')
};

