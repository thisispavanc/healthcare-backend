/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('allergies', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('patient_id').notNullable();
    table.text('substance');
    table.text('reaction');
    table.text('severity');
    table.timestamp('recorded_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Foreign key constraint
    table.foreign('patient_id').references('id').inTable('patients').onDelete('CASCADE');
    
    // Indexes
    table.index('patient_id');
    table.index('substance');
    table.index('severity');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('allergies');
};