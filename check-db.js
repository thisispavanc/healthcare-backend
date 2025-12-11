const db = require('./src/config/database');

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Test basic connection
    await db.raw('SELECT 1+1 as result');
    console.log('✅ Database connection successful');
    
    // Check if tables exist
    console.log('\n📋 Checking existing tables...');
    const tables = await db.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('Existing tables:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Check migrations table
    const migrationTables = tables.rows.filter(row => 
      row.table_name.includes('migration') || row.table_name.includes('knex')
    );
    
    if (migrationTables.length === 0) {
      console.log('\n⚠️  No migration tracking table found');
      console.log('🔧 You have two options:');
      console.log('   1. Mark existing migrations as completed (recommended)');
      console.log('   2. Drop existing tables and run fresh migrations');
    } else {
      console.log(`\n✅ Migration tracking table exists: ${migrationTables[0].table_name}`);
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    await db.destroy();
  }
}

checkDatabase();