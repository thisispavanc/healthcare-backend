/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const clinicianPassword = await bcrypt.hash('Clinician123!', 12);
  const readOnlyPassword = await bcrypt.hash('ReadOnly123!', 12);
  
  // Insert seed entries
  await knex('users').insert([
    {
      id: uuidv4(),
      username: 'admin',
      email: 'admin@paa.com',
      password_hash: adminPassword,
      first_name: 'System',
      last_name: 'Administrator',
      role: 'admin',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      username: 'doctor',
      email: 'doctor@paa.com',
      password_hash: clinicianPassword,
      first_name: 'Dr. John',
      last_name: 'Smith',
      role: 'clinician',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      username: 'nurse',
      email: 'nurse@paa.com',
      password_hash: clinicianPassword,
      first_name: 'Jane',
      last_name: 'Doe',
      role: 'clinician',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      username: 'viewer',
      email: 'viewer@paa.com',
      password_hash: readOnlyPassword,
      first_name: 'View',
      last_name: 'Only',
      role: 'read-only',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
  
  console.log('✅ Default users created successfully');
  console.log('📝 Login credentials:');
  console.log('   Admin: admin / Admin123!');
  console.log('   Doctor: doctor / Clinician123!');
  console.log('   Nurse: nurse / Clinician123!');
  console.log('   Viewer: viewer / ReadOnly123!');
};