const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const appointmentRoutes = require('./routes/appointmentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('CHS Backend Running');
});

app.use('/appointments', appointmentRoutes);
app.use('/', messageRoutes);
app.use('/', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});