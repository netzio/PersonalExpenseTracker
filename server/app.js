const express = require('express');
const cors = require('cors');
require('dotenv').config();
const prisma = require('./utils/prisma');
const routes = require('./routes');

prisma.$connect()
  .then(() => console.log('Connected to the database'))
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });

const app = express();
app.use(cors());
app.use(express.json());

routes(app);

app.get('/', (req, res) => {
  res.send('Healthy');
});

module.exports = app;
