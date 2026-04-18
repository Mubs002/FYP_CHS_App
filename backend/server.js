const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const appointmentRoutes = require('./routes/appointmentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');
const healthRecordRoutes = require('./routes/healthRecordRoutes');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('CHS Backend Running');
});

app.use('/appointments', appointmentRoutes);
app.use('/', messageRoutes);
app.use('/', authRoutes);
app.use('/health-records', healthRecordRoutes);

// i added this so the frontend can access uploaded files directly by url
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});