const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const buildingRoutes = require('./routes/userCities');
const ubmRoutes = require('./routes/UBMdatabase');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: 'http://localhost:3000', // дозволити запити з фронтенда
  methods: ['GET', 'POST', 'PUT'], // додати PUT до дозволених методів
  allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());

// Підключення маршрутів
app.use('/api/userCities', buildingRoutes);
app.use('/api/ubm', ubmRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
