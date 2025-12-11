const { AddressModel } = require('../models');
const { asyncHandler } = require('../middleware/errorHandler');
const PatientModel = require('../models/PatientModel');

class AddressController {
  // Get addresses by patient ID
  getAddressesByPatient = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    
    // Verify patient exists
    const patient = await PatientModel.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    const addresses = await AddressModel.getByPatientId(patientId);
    
    res.json({
      success: true,
      message: 'Addresses retrieved successfully',
      data: addresses
    });
  });

  // Create new address
  createAddress = asyncHandler(async (req, res) => {
    const addressData = req.body;
    
    // Verify patient exists
    const patient = await PatientModel.findById(addressData.patient_id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    const newAddress = await AddressModel.create(addressData);
    
    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: newAddress
    });
  });

  // Update address
  updateAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    const existingAddress = await AddressModel.findById(id);
    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    const updatedAddress = await AddressModel.update(id, updateData);
    
    res.json({
      success: true,
      message: 'Address updated successfully',
      data: updatedAddress
    });
  });

  // Delete address
  deleteAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const existingAddress = await AddressModel.findById(id);
    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    await AddressModel.delete(id);
    
    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  });
}

module.exports = new AddressController();