/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('patients', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.text('mrn').unique().notNullable();
    table.text('first_name').notNullable();
    table.text('last_name').notNullable();
    table.text('middle_name');
    table.date('dob');
    table.text('gender');
    table.text('phone');
    table.text('email');
    table.text('preferred_language');
    table.text('nationality');
    table.text('national_id').unique();
    table.text('birth_place');
    table.jsonb('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes for better performance
    table.index(['first_name', 'last_name']);
    table.index('mrn');
    table.index('email');
    table.index('national_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('patients');
};