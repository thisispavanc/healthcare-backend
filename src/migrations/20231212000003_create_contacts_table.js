/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('contacts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('patient_id').notNullable();
    table.text('name');
    table.text('relation');
    table.text('phone');
    table.text('email');
    table.boolean('is_emergency').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Foreign key constraint
    table.foreign('patient_id').references('id').inTable('patients').onDelete('CASCADE');
    
    // Index
    table.index('patient_id');
    table.index('is_emergency');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('contacts');
};