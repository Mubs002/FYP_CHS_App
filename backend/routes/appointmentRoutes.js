const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/', appointmentController.getAppointments);
router.post('/', appointmentController.addAppointment);

// i added this route so professionals can edit appointment details
router.put('/:id', appointmentController.updateAppointment);

// i added this route so professionals can accept or decline requests
router.put('/:id/status', appointmentController.updateStatus);

module.exports = router;
