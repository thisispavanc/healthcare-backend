/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('audit_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.text('table_name').notNullable();
    table.uuid('record_id').notNullable();
    table.text('action').notNullable(); // CREATE, UPDATE, DELETE
    table.jsonb('changed_data');
    table.text('performed_by');
    table.timestamp('performed_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('table_name');
    table.index('record_id');
    table.index('action');
    table.index('performed_by');
    table.index('performed_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('audit_logs');
};