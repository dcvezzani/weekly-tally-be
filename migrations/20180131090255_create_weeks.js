
exports.up = function(knex, Promise) {
	return knex.schema.createTable('weeks', function(t) {
			t.increments('id').unsigned().primary();

			t.dateTime('recorded_at').notNull();
		
			t.text('positive_food_details').nullable();
			t.text('positive_food').nullable();
			t.integer('positive_food_points').nullable();

			t.text('negative_food_details').nullable();
			t.text('negative_food').nullable();
			t.integer('negative_food_points').nullable();

			t.text('water_details').nullable();
			t.text('water').nullable();
			t.integer('water_points').nullable();

			t.text('exercise_details').nullable();
			t.text('exercise').nullable();
			t.integer('exercise_points').nullable();

			t.text('daily_greatness_details').nullable();
			t.text('daily_greatness').nullable();
			t.integer('daily_greatness_points').nullable();

			t.text('scripture_study_details').nullable();
			t.text('scripture_study').nullable();
			t.integer('scripture_study_points').nullable();

			t.text('personal_prayer_details').nullable();
			t.text('personal_prayer').nullable();
			t.integer('personal_prayer_points').nullable();

			//t.decimal('price', 6, 2).notNull();
			//t.enum('category', ['apparel', 'electronics', 'furniture']).notNull();
			t.timestamps();
	});
};

exports.down = function(knex, Promise) {
  
};
