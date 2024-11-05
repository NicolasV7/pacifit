const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

app.post('/api/users', async (req, res) => {
  const { fullName, phoneNumber, idNumber, eps, bloodType, emergencyContactName, emergencyContactPhone } = req.body;

  try {
    const query = `
      INSERT INTO users (full_name, phone_number, id_number, eps, blood_type, emergency_contact_name, emergency_contact_phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `;
    const result = await pool.query(query, [
      fullName, phoneNumber, idNumber, eps, bloodType, emergencyContactName, emergencyContactPhone
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al guardar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

app.get('/api/users/:idNumber', async (req, res) => {
  const { idNumber } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id_number = $1', [idNumber]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
});

app.delete('/api/users/:idNumber', async (req, res) => {
  const { idNumber } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id_number = $1', [idNumber]);
    res.status(204).end();
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
});

app.put('/api/users/:idNumber', async (req, res) => {
  const { idNumber } = req.params;
  const { fullName, phoneNumber, eps, bloodType, emergencyContactName, emergencyContactPhone } = req.body;

  try {
    const query = `
      UPDATE users
      SET full_name = $1, phone_number = $2, eps = $3, blood_type = $4, emergency_contact_name = $5, emergency_contact_phone = $6
      WHERE id_number = $7 RETURNING *
    `;
    const result = await pool.query(query, [
      fullName, phoneNumber, eps, bloodType, emergencyContactName, emergencyContactPhone, idNumber
    ]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
});

app.post('/api/plans', async (req, res) => {
  const { name, price, days } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO plans (name, price, days) VALUES ($1, $2, $3) RETURNING *`,
      [name, price, days]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear el plan:', error);
    res.status(500).json({ message: 'Error al crear el plan' });
  }
});

app.get('/api/plans', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM plans');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener los planes:', error);
    res.status(500).json({ message: 'Error al obtener los planes' });
  }
});

app.delete('/api/plans/:name', async (req, res) => {
  const { name } = req.params;
  try {
    await pool.query('DELETE FROM plans WHERE name = $1', [name]);
    res.status(204).end();
  } catch (error) {
    console.error('Error al eliminar el plan:', error);
    res.status(500).json({ message: 'Error al eliminar el plan' });
  }
});

app.get('/api/subscriptions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subscriptions');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener las suscripciones:', error);
    res.status(500).json({ message: 'Error al obtener las suscripciones' });
  }
});

app.get('/api/subscriptions/:idNumber', async (req, res) => {
  const { idNumber } = req.params;
  try {
    const result = await pool.query('SELECT * FROM subscriptions WHERE id_number = $1', [idNumber]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Suscripción no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener la suscripción:', error);
    res.status(500).json({ message: 'Error al obtener la suscripción' });
  }
});

app.delete('/api/subscriptions/:idNumber', async (req, res) => {
  const { idNumber } = req.params;
  try {
    await pool.query('DELETE FROM subscriptions WHERE id_number = $1', [idNumber]);
    res.status(204).end();
  } catch (error) {
    console.error('Error al eliminar la suscripción:', error);
    res.status(500).json({ message: 'Error al eliminar la suscripción' });
  }
});

app.post('/api/subscriptions', async (req, res) => {
  const { idNumber, endDate, daysRemaining } = req.body;

  try {
    // Verificar si ya existe una suscripción con el id_number
    const existingSubscription = await pool.query('SELECT * FROM subscriptions WHERE id_number = $1', [idNumber]);

    if (existingSubscription.rows.length > 0) {
      // Si existe, actualizar el registro existente
      const query = `
        UPDATE subscriptions
        SET end_date = $2, days_remaining = $3, status = CASE WHEN $2 <= CURRENT_DATE OR $3 = 0 THEN 'Inactiva' ELSE 'Activo' END
        WHERE id_number = $1 RETURNING *
      `;
      const result = await pool.query(query, [idNumber, endDate, daysRemaining]);
      res.status(200).json(result.rows[0]);
    } else {
      // Si no existe, insertar un nuevo registro
      const query = `
        INSERT INTO subscriptions (id_number, end_date, days_remaining, status)
        VALUES ($1, $2, $3, CASE WHEN $2 <= CURRENT_DATE OR $3 = 0 THEN 'Inactiva' ELSE 'Activo' END) RETURNING *
      `;
      const result = await pool.query(query, [idNumber, endDate, daysRemaining]);
      res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error al crear o actualizar la suscripción:', error);
    res.status(500).json({ message: 'Error al crear o actualizar la suscripción' });
  }
});

app.put('/api/subscriptions/:idNumber', async (req, res) => {
  const { idNumber } = req.params;
  const { endDate, daysRemaining } = req.body;

  try {
    // Verificar si ya existe una suscripción con el id_number
    const existingSubscription = await pool.query('SELECT * FROM subscriptions WHERE id_number = $1', [idNumber]);

    if (existingSubscription.rows.length > 0) {
      // Si existe, actualizar el registro existente
      const query = `
        UPDATE subscriptions
        SET end_date = $2, days_remaining = $3, status = CASE WHEN $2 <= CURRENT_DATE OR $3 = 0 THEN 'Inactiva' ELSE 'Activo' END
        WHERE id_number = $1 RETURNING *
      `;
      const result = await pool.query(query, [idNumber, endDate, daysRemaining]);
      res.status(200).json(result.rows[0]);
    } else {
      // Si no existe, insertar un nuevo registro
      const query = `
        INSERT INTO subscriptions (id_number, end_date, days_remaining, status)
        VALUES ($1, $2, $3, CASE WHEN $2 <= CURRENT_DATE OR $3 = 0 THEN 'Inactiva' ELSE 'Activo' END) RETURNING *
      `;
      const result = await pool.query(query, [idNumber, endDate, daysRemaining]);
      res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error al actualizar la suscripción:', error);
    res.status(500).json({ message: 'Error al actualizar la suscripción' });
  }
});

// Endpoint para registrar una nueva entrada
app.post('/api/suma', async (req, res) => {
  const { tipo, monto } = req.body;

  try {
    const query = `
      INSERT INTO entradas (tipo, monto)
      VALUES ($1, $2) RETURNING *
    `;
    const result = await pool.query(query, [tipo, monto]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al registrar la entrada:', error);
    res.status(500).json({ message: 'Error al registrar la entrada' });
  }
});

// Endpoint para obtener todas las entradas
app.get('/api/suma', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM entradas');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener las entradas:', error);
    res.status(500).json({ message: 'Error al obtener las entradas' });
  }
});

const PORT = 5055;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});