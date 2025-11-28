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

//Testowy roucik
app.get('/health', (req, res) => {
	res.json({ status: 'ok', msg: 'Server 🏃‍♂️' });
});

app.listen(PORT, () => {
	console.log(`Server 🏃‍♂️ on http://localhost:${PORT}`);
});
