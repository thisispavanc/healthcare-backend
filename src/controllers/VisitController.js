const VisitModel = require('../models/VisitModel');
const { asyncHandler } = require('../middleware/errorHandler');
const PatientModel = require('../models/PatientModel');

class VisitController {
  // Get visits by patient ID
  getVisitsByPatient = asyncHandler(async (req, res) => {
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
    
    const result = await VisitModel.getByPatientId(patientId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    res.json({
      success: true,
      message: 'Visits retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  });

  // Get single visit with observations
  getVisit = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const visit = await VisitModel.getVisitWithObservations(id);
    
    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Visit retrieved successfully',
      data: visit
    });
  });

  // Create new visit
  createVisit = asyncHandler(async (req, res) => {
    const visitData = req.body;
    
    // Verify patient exists
    const patient = await PatientModel.findById(visitData.patient_id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    const newVisit = await VisitModel.create(visitData);
    
    res.status(201).json({
      success: true,
      message: 'Visit created successfully',
      data: newVisit
    });
  });

  // Update visit
  updateVisit = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    const existingVisit = await VisitModel.findById(id);
    if (!existingVisit) {
      return res.status(404).json({
        success: false,
        message: 'Visit not found'
      });
    }
    
    const updatedVisit = await VisitModel.update(id, updateData);
    
    res.json({
      success: true,
      message: 'Visit updated successfully',
      data: updatedVisit
    });
  });

  // Delete visit
  deleteVisit = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const existingVisit = await VisitModel.findById(id);
    if (!existingVisit) {
      return res.status(404).json({
        success: false,
        message: 'Visit not found'
      });
    }
    
    await VisitModel.delete(id);
    
    res.json({
      success: true,
      message: 'Visit deleted successfully'
    });
  });
}

module.exports = new VisitController();