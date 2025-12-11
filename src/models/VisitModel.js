const BaseModel = require('./BaseModel');

class VisitModel extends BaseModel {
  constructor() {
    super('visits');
  }

  // Get visits by patient ID
  async getByPatientId(patientId, options = {}) {
    return this.findAll({ patient_id: patientId }, { 
      ...options, 
      orderBy: 'started_at', 
      order: 'desc' 
    });
  }

  // Get visit with observations
  async getVisitWithObservations(visitId) {
    const visit = await this.findById(visitId);
    if (!visit) return null;

    const observations = await this.db('observations')
      .where('visit_id', visitId)
      .orderBy('obs_timestamp', 'desc');

    return {
      ...visit,
      observations
    };
  }
}

module.exports = new VisitModel();