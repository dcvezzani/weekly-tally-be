
exports.up = function(knex, Promise) {
    return knex.schema.table('users', function(t) {
        t.dropColumn('weight_least'); 
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', function(t) {
        t.decimal('weight_least', 8, 1).notNull().defaultTo(0.0);
    });
};



