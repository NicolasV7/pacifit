const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión con PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'autorack.proxy.rlwy.net:21305',
  database: 'railway',
  password: 'aLownZSSBKFsMsdIgPEPOKOnPhjjIOMt',
  port: 5432
});

// Ruta para crear un nuevo usuario
app.post('/api/users', async (req, res) => {
  const { fullName, phoneNumber, idNumber, eps, bloodType, emergencyContactName, emergencyContactPhone } = req.body;

  try {
    const query = `
      INSERT INTO users (full_name, phone_number, id_number, eps, blood_type, emergency_contact_name, emergency_contact_phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await pool.query(query, [fullName, phoneNumber, idNumber, eps, bloodType, emergencyContactName, emergencyContactPhone]);
    res.status(200).send({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    res.status(500).send({ message: 'Error al registrar el usuario' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
