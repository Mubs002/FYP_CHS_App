const express = require('express');
const router = express.Router();
const { getRecords, addRecord, shareRecord, getShared, upload } = require('../controllers/healthRecordController');

// get all records for a patient or professional
router.get('/', getRecords);

// i added this so multer handles the file before the controller runs
router.post('/', upload.single('file'), addRecord);

// patient shares their records with a professional
router.post('/share', shareRecord);

// get the list of professionals a patient shared with
router.get('/shared/:patient_id', getShared);

module.exports = router;
