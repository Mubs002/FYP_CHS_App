const appointmentModel = require('../models/appointmentModel');

const getAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.getAllAppointments();
        res.json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching appointments');
    }
};

const addAppointment = async (req, res) => {
    try {
        const { patient_id, professional_id, reason_for_visit } = req.body;

        const appointment = await appointmentModel.createAppointment(
            patient_id,
            professional_id,
            reason_for_visit
        );

        res.json(appointment);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating appointment');
    }
};

module.exports = {
    getAppointments,
    addAppointment
};