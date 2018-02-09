
exports.up = function(knex, Promise) {
    return knex.schema.table('users', function(t) {
        t.dropColumn('weight_factor'); 
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', function(t) {
        t.decimal('weight_factor', 3, 1).notNull().defaultTo(0.0);
    });
};


