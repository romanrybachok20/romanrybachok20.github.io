const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const buildingRoutes = require('./routes/userCities');
const ubmRoutes = require('./routes/UBMdatabase');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT'], 
  allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());
app
app.use('/api/userCities', buildingRoutes);
app.use('/api/ubm', ubmRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
