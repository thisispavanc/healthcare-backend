const { 
  ContactModel, 
  InsuranceModel, 
  ObservationModel, 
  AllergyModel, 
  MedicationModel 
} = require('../models');
const { asyncHandler } = require('../middleware/errorHandler');
const PatientModel = require('../models/PatientModel');

// Generic controller factory for patient-related entities
const createPatientRelatedController = (Model, entityName) => {
  return {
    // Get all records for a patient
    getByPatient: asyncHandler(async (req, res) => {
      const { patientId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      
      // Verify patient exists
      const patient = await PatientModel.findById(patientId);
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }
      
      const records = await Model.getByPatientId(patientId, {
        page: parseInt(page),
        limit: parseInt(limit)
      });
      
      res.json({
        success: true,
        message: `${entityName}s retrieved successfully`,
        data: records.data || records,
        ...(records.pagination && { pagination: records.pagination })
      });
    }),

    // Get single record
    getById: asyncHandler(async (req, res) => {
      const { id } = req.params;
      
      const record = await Model.findById(id);
      if (!record) {
        return res.status(404).json({
          success: false,
          message: `${entityName} not found`
        });
      }
      
      res.json({
        success: true,
        message: `${entityName} retrieved successfully`,
        data: record
      });
    }),

    // Create new record
    create: asyncHandler(async (req, res) => {
      const data = req.body;
      
      // Verify patient exists if patient_id is provided
      if (data.patient_id) {
        const patient = await PatientModel.findById(data.patient_id);
        if (!patient) {
          return res.status(404).json({
            success: false,
            message: 'Patient not found'
          });
        }
      }
      
      const newRecord = await Model.create(data);
      
      res.status(201).json({
        success: true,
        message: `${entityName} created successfully`,
        data: newRecord
      });
    }),

    // Update record
    update: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      
      const existingRecord = await Model.findById(id);
      if (!existingRecord) {
        return res.status(404).json({
          success: false,
          message: `${entityName} not found`
        });
      }
      
      const updatedRecord = await Model.update(id, updateData);
      
      res.json({
        success: true,
        message: `${entityName} updated successfully`,
        data: updatedRecord
      });
    }),

    // Delete record
    delete: asyncHandler(async (req, res) => {
      const { id } = req.params;
      
      const existingRecord = await Model.findById(id);
      if (!existingRecord) {
        return res.status(404).json({
          success: false,
          message: `${entityName} not found`
        });
      }
      
      await Model.delete(id);
      
      res.json({
        success: true,
        message: `${entityName} deleted successfully`
      });
    })
  };
};

// Create controllers for each entity
const ContactController = createPatientRelatedController(ContactModel, 'Contact');
const InsuranceController = createPatientRelatedController(InsuranceModel, 'Insurance');
const AllergyController = createPatientRelatedController(AllergyModel, 'Allergy');
const MedicationController = createPatientRelatedController(MedicationModel, 'Medication');

// Observation controller with additional methods
const ObservationController = {
  ...createPatientRelatedController(ObservationModel, 'Observation'),
  
  // Get observations by visit
  getByVisit: asyncHandler(async (req, res) => {
    const { visitId } = req.params;
    
    const observations = await ObservationModel.getByVisitId(visitId);
    
    res.json({
      success: true,
      message: 'Observations retrieved successfully',
      data: observations
    });
  })
};

module.exports = {
  ContactController,
  InsuranceController,
  ObservationController,
  AllergyController,
  MedicationController
};