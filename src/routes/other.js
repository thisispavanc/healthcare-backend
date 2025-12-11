const express = require('express');
const { 
  ContactController, 
  InsuranceController, 
  ObservationController, 
  AllergyController, 
  MedicationController 
} = require('../controllers/GenericControllers');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../validation/middleware');
const { contactSchemas, commonSchemas } = require('../validation/schemas');
const { auditLog } = require('../middleware/audit');

// Contact routes
const contactRouter = express.Router();

contactRouter.get('/patient/:patientId', authenticate, ContactController.getByPatient);
contactRouter.get('/:id', authenticate, validate(commonSchemas.uuid, 'params'), ContactController.getById);
contactRouter.post('/', authenticate, authorize('clinician'), validate(contactSchemas.create), auditLog('contacts', 'CREATE'), ContactController.create);
contactRouter.put('/:id', authenticate, authorize('clinician'), validate(commonSchemas.uuid, 'params'), validate(contactSchemas.update), auditLog('contacts', 'UPDATE'), ContactController.update);
contactRouter.delete('/:id', authenticate, authorize('admin'), validate(commonSchemas.uuid, 'params'), auditLog('contacts', 'DELETE'), ContactController.delete);

// Insurance routes
const insuranceRouter = express.Router();

insuranceRouter.get('/patient/:patientId', authenticate, InsuranceController.getByPatient);
insuranceRouter.get('/:id', authenticate, validate(commonSchemas.uuid, 'params'), InsuranceController.getById);
insuranceRouter.post('/', authenticate, authorize('clinician'), auditLog('insurances', 'CREATE'), InsuranceController.create);
insuranceRouter.put('/:id', authenticate, authorize('clinician'), validate(commonSchemas.uuid, 'params'), auditLog('insurances', 'UPDATE'), InsuranceController.update);
insuranceRouter.delete('/:id', authenticate, authorize('admin'), validate(commonSchemas.uuid, 'params'), auditLog('insurances', 'DELETE'), InsuranceController.delete);

// Observation routes
const observationRouter = express.Router();

observationRouter.get('/patient/:patientId', authenticate, ObservationController.getByPatient);
observationRouter.get('/visit/:visitId', authenticate, ObservationController.getByVisit);
observationRouter.get('/:id', authenticate, validate(commonSchemas.uuid, 'params'), ObservationController.getById);
observationRouter.post('/', authenticate, authorize('clinician'), auditLog('observations', 'CREATE'), ObservationController.create);
observationRouter.put('/:id', authenticate, authorize('clinician'), validate(commonSchemas.uuid, 'params'), auditLog('observations', 'UPDATE'), ObservationController.update);
observationRouter.delete('/:id', authenticate, authorize('admin'), validate(commonSchemas.uuid, 'params'), auditLog('observations', 'DELETE'), ObservationController.delete);

// Allergy routes
const allergyRouter = express.Router();

allergyRouter.get('/patient/:patientId', authenticate, AllergyController.getByPatient);
allergyRouter.get('/:id', authenticate, validate(commonSchemas.uuid, 'params'), AllergyController.getById);
allergyRouter.post('/', authenticate, authorize('clinician'), auditLog('allergies', 'CREATE'), AllergyController.create);
allergyRouter.put('/:id', authenticate, authorize('clinician'), validate(commonSchemas.uuid, 'params'), auditLog('allergies', 'UPDATE'), AllergyController.update);
allergyRouter.delete('/:id', authenticate, authorize('admin'), validate(commonSchemas.uuid, 'params'), auditLog('allergies', 'DELETE'), AllergyController.delete);

// Medication routes
const medicationRouter = express.Router();

medicationRouter.get('/patient/:patientId', authenticate, MedicationController.getByPatient);
medicationRouter.get('/:id', authenticate, validate(commonSchemas.uuid, 'params'), MedicationController.getById);
medicationRouter.post('/', authenticate, authorize('clinician'), auditLog('medications', 'CREATE'), MedicationController.create);
medicationRouter.put('/:id', authenticate, authorize('clinician'), validate(commonSchemas.uuid, 'params'), auditLog('medications', 'UPDATE'), MedicationController.update);
medicationRouter.delete('/:id', authenticate, authorize('admin'), validate(commonSchemas.uuid, 'params'), auditLog('medications', 'DELETE'), MedicationController.delete);

module.exports = {
  contactRouter,
  insuranceRouter,
  observationRouter,
  allergyRouter,
  medicationRouter
};