const healthRecordModel = require('../models/healthRecordModel');
const multer = require('multer');
const path = require('path');

// i set up multer to save uploaded files into the uploads folder
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        // i added a timestamp to the filename so files never overwrite each other
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

// i created the upload so the route can use it
const upload = multer({ storage });

// gets all records based on the users role
const getRecords = async (req, res) => {
    try {
        const { role, user_id } = req.query;

        let records;
        if (role === 'professional') {
            records = await healthRecordModel.getRecordsByProfessional(user_id);
        } else {
            records = await healthRecordModel.getRecordsByPatient(user_id);
        }

        res.json(records);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching health records');
    }
};

// i added this so professionals can create a new health record with an optional file
const addRecord = async (req, res) => {
    try {
        // if a file was uploaded multer puts it in req.file
        const file_path = req.file ? req.file.filename : null;

        const record = await healthRecordModel.createRecord(req.body, file_path);
        res.json(record);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating health record');
    }
};

//i added this so patients can share their records with a professional
const shareRecord = async (req, res) => {
    try {
        const { patient_id, professional_id } = req.body;
        const consent = await healthRecordModel.shareRecord(patient_id, professional_id);
        res.json(consent);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error sharing health record');
    }
};

// gets all profeessionals a patient has shared their records with
const getShared = async (req, res) => {
    try {
        const { patient_id } = req.params;
        const list = await healthRecordModel.getSharedProfessionals(patient_id);
        res.json(list);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching shared professionals');
    }
};

module.exports = { getRecords, addRecord, shareRecord, getShared, upload };
