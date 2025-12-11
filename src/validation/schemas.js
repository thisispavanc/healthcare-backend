const Joi = require('joi');

// User validation schemas
const userSchemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
      .messages({
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
      }),
    first_name: Joi.string().min(1).max(50).required(),
    last_name: Joi.string().min(1).max(50).required(),
    role: Joi.string().valid('admin', 'clinician', 'read-only').default('read-only')
  }),

  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required()
  })
};

// Patient validation schemas
const patientSchemas = {
  create: Joi.object({
    mrn: Joi.string().required(),
    first_name: Joi.string().min(1).max(100).required(),
    last_name: Joi.string().min(1).max(100).required(),
    middle_name: Joi.string().max(100).allow(null, ''),
    dob: Joi.date().iso().max('now').allow(null),
    gender: Joi.string().valid('male', 'female', 'other', 'unknown').allow(null),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).allow(null, ''),
    email: Joi.string().email().allow(null, ''),
    preferred_language: Joi.string().max(50).allow(null, ''),
    nationality: Joi.string().max(100).allow(null, ''),
    national_id: Joi.string().max(50).allow(null, ''),
    birth_place: Joi.string().max(200).allow(null, ''),
    notes: Joi.object().allow(null)
  }),

  update: Joi.object({
    mrn: Joi.string(),
    first_name: Joi.string().min(1).max(100),
    last_name: Joi.string().min(1).max(100),
    middle_name: Joi.string().max(100).allow(null, ''),
    dob: Joi.date().iso().max('now').allow(null),
    gender: Joi.string().valid('male', 'female', 'other', 'unknown').allow(null),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).allow(null, ''),
    email: Joi.string().email().allow(null, ''),
    preferred_language: Joi.string().max(50).allow(null, ''),
    nationality: Joi.string().max(100).allow(null, ''),
    national_id: Joi.string().max(50).allow(null, ''),
    birth_place: Joi.string().max(200).allow(null, ''),
    notes: Joi.object().allow(null)
  }).min(1)
};

// Address validation schemas
const addressSchemas = {
  create: Joi.object({
    patient_id: Joi.string().uuid().required(),
    type: Joi.string().valid('home', 'work', 'mailing', 'billing', 'other').required(),
    line1: Joi.string().max(200).required(),
    line2: Joi.string().max(200).allow(null, ''),
    city: Joi.string().max(100).required(),
    state: Joi.string().max(100).allow(null, ''),
    postal_code: Joi.string().max(20).allow(null, ''),
    country: Joi.string().max(100).required()
  }),

  update: Joi.object({
    type: Joi.string().valid('home', 'work', 'mailing', 'billing', 'other'),
    line1: Joi.string().max(200),
    line2: Joi.string().max(200).allow(null, ''),
    city: Joi.string().max(100),
    state: Joi.string().max(100).allow(null, ''),
    postal_code: Joi.string().max(20).allow(null, ''),
    country: Joi.string().max(100)
  }).min(1)
};

// Contact validation schemas
const contactSchemas = {
  create: Joi.object({
    patient_id: Joi.string().uuid().required(),
    name: Joi.string().min(1).max(100).required(),
    relation: Joi.string().max(50).allow(null, ''),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).allow(null, ''),
    email: Joi.string().email().allow(null, ''),
    is_emergency: Joi.boolean().default(false)
  }),

  update: Joi.object({
    name: Joi.string().min(1).max(100),
    relation: Joi.string().max(50).allow(null, ''),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).allow(null, ''),
    email: Joi.string().email().allow(null, ''),
    is_emergency: Joi.boolean()
  }).min(1)
};

// Visit validation schemas
const visitSchemas = {
  create: Joi.object({
    patient_id: Joi.string().uuid().required(),
    encounter_type: Joi.string().max(100).allow(null, ''),
    facility: Joi.string().max(200).allow(null, ''),
    provider_id: Joi.string().uuid().allow(null),
    started_at: Joi.date().iso().required(),
    ended_at: Joi.date().iso().min(Joi.ref('started_at')).allow(null),
    reason: Joi.string().max(500).allow(null, ''),
    diagnosis: Joi.string().max(1000).allow(null, ''),
    notes: Joi.object().allow(null)
  }),

  update: Joi.object({
    encounter_type: Joi.string().max(100).allow(null, ''),
    facility: Joi.string().max(200).allow(null, ''),
    provider_id: Joi.string().uuid().allow(null),
    started_at: Joi.date().iso(),
    ended_at: Joi.date().iso().allow(null),
    reason: Joi.string().max(500).allow(null, ''),
    diagnosis: Joi.string().max(1000).allow(null, ''),
    notes: Joi.object().allow(null)
  }).min(1)
};

// Common validation schemas
const commonSchemas = {
  uuid: Joi.string().uuid().required(),
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
};

module.exports = {
  userSchemas,
  patientSchemas,
  addressSchemas,
  contactSchemas,
  visitSchemas,
  commonSchemas
};