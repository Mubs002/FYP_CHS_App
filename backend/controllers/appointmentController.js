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

// i updated this to pass all the new fields to the model
const addAppointment = async (req, res) => {
    try {
        const {
            patient_id,
            professional_id,
            appointment_type,
            health_category,
            scheduled_start,
            scheduled_end,
            reason_for_visit,
            meeting_link,
            location,
            booked_by_professional
        } = req.body;

        // i set status to confirmed if a professional booked it directly
        const status = booked_by_professional ? 'confirmed' : 'pending';

        const appointment = await appointmentModel.createAppointment(
            patient_id,
            professional_id,
            appointment_type,
            health_category,
            scheduled_start,
            scheduled_end,
            reason_for_visit,
            meeting_link || null,
            location || null,
            status
        );

        res.json(appointment);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating appointment');
    }
};

// i added this so a professional can edit the appointment time and link
const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await appointmentModel.updateAppointment(id, req.body);
        res.json(appointment);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating appointment');
    }
};

// i added this so professionals can accept or decline a request
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const appointment = await appointmentModel.updateAppointmentStatus(id, status);
        res.json(appointment);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating appointment status');
    }
};

module.exports = {
    getAppointments,
    addAppointment,
    updateAppointment,
    updateStatus
};
