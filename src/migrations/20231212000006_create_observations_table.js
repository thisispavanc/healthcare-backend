/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('observations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('patient_id').notNullable();
    table.uuid('visit_id');
    table.text('obs_type');
    table.timestamp('obs_timestamp');
    table.text('value_text');
    table.jsonb('value_json');
    table.text('unit');
    table.uuid('performer_id');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Foreign key constraints
    table.foreign('patient_id').references('id').inTable('patients').onDelete('CASCADE');
    table.foreign('visit_id').references('id').inTable('visits').onDelete('CASCADE');
    
    // Indexes
    table.index('patient_id');
    table.index('visit_id');
    table.index('obs_type');
    table.index('obs_timestamp');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('observations');
};