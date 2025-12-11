const BaseModel = require('./BaseModel');

class PatientModel extends BaseModel {
  constructor() {
    super('patients');
  }

  // Find patient by MRN
  async findByMRN(mrn) {
    return this.db(this.tableName).where('mrn', mrn).first();
  }

  // Search patients by name or MRN
  async search(searchTerm, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    let query = this.db(this.tableName);

    if (searchTerm) {
      query = query.where(function() {
        this.whereILike('first_name', `%${searchTerm}%`)
          .orWhereILike('last_name', `%${searchTerm}%`)
          .orWhereILike('mrn', `%${searchTerm}%`)
          .orWhereILike('email', `%${searchTerm}%`);
      });
    }

    // Get total count
    const totalQuery = query.clone();
    const [{ count }] = await totalQuery.count('* as count');
    const total = parseInt(count);

    // Get paginated results
    const data = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    return {
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get patient with all related data
  async getPatientWithDetails(patientId) {
    const patient = await this.findById(patientId);
    if (!patient) return null;

    const [addresses, contacts, insurances, visits, allergies, medications] = await Promise.all([
      this.db('addresses').where('patient_id', patientId),
      this.db('contacts').where('patient_id', patientId),
      this.db('insurances').where('patient_id', patientId),
      this.db('visits').where('patient_id', patientId).orderBy('started_at', 'desc'),
      this.db('allergies').where('patient_id', patientId),
      this.db('medications').where('patient_id', patientId).orderBy('created_at', 'desc')
    ]);

    return {
      ...patient,
      addresses,
      contacts,
      insurances,
      visits,
      allergies,
      medications
    };
  }
}

module.exports = new PatientModel();