const PatientModel = require('../models/PatientModel');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../config/logger');

class PatientController {
  // Get all patients with pagination and search
  getPatients = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, search } = req.query;
    
    let result;
    
    if (search) {
      result = await PatientModel.search(search, { page: parseInt(page), limit: parseInt(limit) });
    } else {
      result = await PatientModel.findAll({}, { page: parseInt(page), limit: parseInt(limit) });
    }
    
    res.json({
      success: true,
      message: 'Patients retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  });

  // Get single patient by ID
  getPatient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const patient = await PatientModel.findById(id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Patient retrieved successfully',
      data: patient
    });
  });

  // Get patient with all related data
  getPatientWithDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const patientDetails = await PatientModel.getPatientWithDetails(id);
    
    if (!patientDetails) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Patient details retrieved successfully',
      data: patientDetails
    });
  });

  // Create new patient
  createPatient = asyncHandler(async (req, res) => {
    const patientData = req.body;
    
    // Check if MRN already exists
    const existingPatient = await PatientModel.findByMRN(patientData.mrn);
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: 'Patient with this MRN already exists'
      });
    }
    
    const newPatient = await PatientModel.create(patientData);
    
    logger.info(`Patient created: ${newPatient.id} by user: ${req.user.username}`);
    
    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: newPatient
    });
  });

  // Update patient
  updatePatient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if patient exists
    const existingPatient = await PatientModel.findById(id);
    if (!existingPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // If MRN is being updated, check for duplicates
    if (updateData.mrn && updateData.mrn !== existingPatient.mrn) {
      const duplicatePatient = await PatientModel.findByMRN(updateData.mrn);
      if (duplicatePatient) {
        return res.status(400).json({
          success: false,
          message: 'Another patient with this MRN already exists'
        });
      }
    }
    
    const updatedPatient = await PatientModel.update(id, updateData);
    
    logger.info(`Patient updated: ${id} by user: ${req.user.username}`);
    
    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: updatedPatient
    });
  });

  // Delete patient (soft delete recommended)
  deletePatient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const existingPatient = await PatientModel.findById(id);
    if (!existingPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    await PatientModel.delete(id);
    
    logger.info(`Patient deleted: ${id} by user: ${req.user.username}`);
    
    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  });
}

module.exports = new PatientController();