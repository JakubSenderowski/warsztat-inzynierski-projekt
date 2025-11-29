require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// { Middlewarek }
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// {Pojazdy i pochodne ~^.^~}
const vehicleRoutes = require('./routes/vehicleRoute');
app.use('/api', vehicleRoutes);
const vehicleBrandRoutes = require('./routes/vehicleBrandRoute');
app.use('/api/vehicles', vehicleBrandRoutes);
const vehicleModelRoutes = require('./routes/vehicleModelRoute');
app.use('/api/vehicles', vehicleModelRoutes);
const engineTypeRoutes = require('./routes/engineTypeRoute');
app.use('/api/vehicles', engineTypeRoutes);

//Testowy roucik
app.get('/health', (req, res) => {
	res.json({ status: 'ok', msg: 'Server 🏃‍♂️' });
});

app.listen(PORT, () => {
	console.log(`Server 🏃‍♂️ on http://localhost:${PORT}`);
});
