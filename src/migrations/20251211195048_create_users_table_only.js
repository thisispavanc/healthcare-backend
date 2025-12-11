/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.text('username').unique().notNullable();
    table.text('email').unique().notNullable();
    table.text('password_hash').notNullable();
    table.text('first_name').notNullable();
    table.text('last_name').notNullable();
    table.text('role').notNullable().defaultTo('read-only'); // admin, clinician, read-only
    table.boolean('is_active').defaultTo(true);
    table.text('refresh_token');
    table.timestamp('last_login');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('username');
    table.index('email');
    table.index('role');
    table.index('is_active');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
