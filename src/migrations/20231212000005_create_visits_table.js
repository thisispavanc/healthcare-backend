/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('visits', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('patient_id').notNullable();
    table.text('encounter_type');
    table.text('facility');
    table.uuid('provider_id');
    table.timestamp('started_at');
    table.timestamp('ended_at');
    table.text('reason');
    table.text('diagnosis');
    table.jsonb('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Foreign key constraint
    table.foreign('patient_id').references('id').inTable('patients').onDelete('CASCADE');
    
    // Indexes
    table.index('patient_id');
    table.index('provider_id');
    table.index('started_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('visits');
};