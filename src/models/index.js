const BaseModel = require('./BaseModel');

// Address Model
class AddressModel extends BaseModel {
  constructor() {
    super('addresses');
  }

  async getByPatientId(patientId) {
    return this.db(this.tableName).where('patient_id', patientId);
  }
}

// Contact Model  
class ContactModel extends BaseModel {
  constructor() {
    super('contacts');
  }

  async getByPatientId(patientId) {
    return this.db(this.tableName).where('patient_id', patientId);
  }

  async getEmergencyContacts(patientId) {
    return this.db(this.tableName)
      .where('patient_id', patientId)
      .where('is_emergency', true);
  }
}

// Insurance Model
class InsuranceModel extends BaseModel {
  constructor() {
    super('insurances');
  }

  async getByPatientId(patientId) {
    return this.db(this.tableName).where('patient_id', patientId);
  }
}

// Observation Model
class ObservationModel extends BaseModel {
  constructor() {
    super('observations');
  }

  async getByPatientId(patientId, options = {}) {
    return this.findAll({ patient_id: patientId }, {
      ...options,
      orderBy: 'obs_timestamp',
      order: 'desc'
    });
  }

  async getByVisitId(visitId) {
    return this.db(this.tableName)
      .where('visit_id', visitId)
      .orderBy('obs_timestamp', 'desc');
  }
}

// Allergy Model
class AllergyModel extends BaseModel {
  constructor() {
    super('allergies');
  }

  async getByPatientId(patientId) {
    return this.db(this.tableName)
      .where('patient_id', patientId)
      .orderBy('recorded_at', 'desc');
  }
}

// Medication Model
class MedicationModel extends BaseModel {
  constructor() {
    super('medications');
  }

  async getByPatientId(patientId, options = {}) {
    return this.findAll({ patient_id: patientId }, {
      ...options,
      orderBy: 'created_at',
      order: 'desc'
    });
  }

  async getActiveByPatientId(patientId) {
    return this.db(this.tableName)
      .where('patient_id', patientId)
      .where('status', 'active')
      .orderBy('created_at', 'desc');
  }
}

module.exports = {
  AddressModel: new AddressModel(),
  ContactModel: new ContactModel(),
  InsuranceModel: new InsuranceModel(),
  ObservationModel: new ObservationModel(),
  AllergyModel: new AllergyModel(),
  MedicationModel: new MedicationModel()
};