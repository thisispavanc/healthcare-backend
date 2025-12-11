const path = require('path');
require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      directory: path.join(__dirname, 'src/migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, 'src/seeds')
    },
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 200
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      directory: path.join(__dirname, 'src/migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, 'src/seeds')
    },
    pool: {
      min: 2,
      max: 20
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false
    },
    migrations: {
      directory: path.join(__dirname, 'src/migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, 'src/seeds')
    },
    pool: {
      min: 5,
      max: 50
    }
  }
};