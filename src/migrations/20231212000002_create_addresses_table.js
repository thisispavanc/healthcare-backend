/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('addresses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('patient_id').notNullable();
    table.text('type');
    table.text('line1');
    table.text('line2');
    table.text('city');
    table.text('state');
    table.text('postal_code');
    table.text('country');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Foreign key constraint
    table.foreign('patient_id').references('id').inTable('patients').onDelete('CASCADE');
    
    // Index
    table.index('patient_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('addresses');
};