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

// {Service i Repair ~^.^~}
const serviceRequestRoutes = require('./routes/serviceRequestRoutes');
app.use('/api', serviceRequestRoutes);
const repairOrderRoutes = require('./routes/repairOrderRoutes');
app.use('/api', repairOrderRoutes);
const serviceCatalogRoutes = require('./routes/serviceCatalogRoutes');
app.use('/api', serviceCatalogRoutes);

// {Order Routes}
const orderServiceItemRoutes = require('./routes/orderServiceItemRoutes');
app.use('/api', orderServiceItemRoutes);
const orderPartItemRoutes = require('./routes/orderPartItemRoutes');
app.use('/api', orderPartItemRoutes);

// {Part Routes}
const partRoutes = require('./routes/partRoutes');
app.use('/api', partRoutes);
const partCategoryRoutes = require('./routes/partCategoryRoutes');
app.use('/api', partCategoryRoutes);
const unitOfMeasureRoutes = require('./routes/unitOfMeasureRoutes');
app.use('/api', unitOfMeasureRoutes);
const supplierRoutes = require('./routes/supplierRoutes');
app.use('/api', supplierRoutes);

// {Rouciki od finansów}
const taxRateRoutes = require('./routes/taxRateRoutes');
app.use('/api', taxRateRoutes);
const paymentMethodRoutes = require('./routes/paymentMethodRoutes');
app.use('/api', paymentMethodRoutes);
const invoiceRoutes = require('./routes/invoiceRoutes');
app.use('/api', invoiceRoutes);
const invoiceItemRoutes = require('./routes/invoiceItemRoutes');
app.use('/api', invoiceItemRoutes);

// {Kalendarze Roucik}
const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api', appointmentRoutes);
const mechanicScheduleRoutes = require('./routes/mechanicScheduleRoutes');
app.use('/api', mechanicScheduleRoutes);

// {Ustawionka + Pliki}

const systemSettingRoutes = require('./routes/systemSettingRoutes');
app.use('/api', systemSettingRoutes);
const printTemplateRoutes = require('./routes/printTemplateRoutes');
app.use('/api', printTemplateRoutes);
const fileAttachmentRoutes = require('./routes/fileAttachmentRoutes');
app.use('/api', fileAttachmentRoutes);

// {Użytkownik}

const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);
app.listen(PORT, () => {
	console.log(`Server 🏃‍♂️ on http://localhost:${PORT}`);
});
