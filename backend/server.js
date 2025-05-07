const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Umgebungsvariablen laden
dotenv.config();

// Datenbankverbindung
connectDB();

// Route-Dateien
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Body Parser
app.use(express.json());

// CORS aktivieren
app.use(cors());

// Routen mounten
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);

// Basis-Route
app.get('/', (req, res) => {
  res.send('HHM Imkerei API läuft');
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server läuft im ${process.env.NODE_ENV} Modus auf Port ${PORT}`)
);
