/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('medications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('patient_id').notNullable();
    table.text('name');
    table.text('dose');
    table.text('route');
    table.text('frequency');
    table.date('start_date');
    table.date('end_date');
    table.text('status');
    table.jsonb('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Foreign key constraint
    table.foreign('patient_id').references('id').inTable('patients').onDelete('CASCADE');
    
    // Indexes
    table.index('patient_id');
    table.index('name');
    table.index('status');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('medications');
};