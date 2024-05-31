const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
    origin: '*', // Permitir todos los orígenes
    optionsSuccessStatus: 200,
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        console.log('Token recibido:', bearerToken);
        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log('Error al verificar el token:', err.message);
                return res.status(403).json({ success: false, message: 'Acceso no autorizado' });
            }
            console.log('Token verificado, usuario:', decoded);
            req.user = decoded;
            next();
        });
    } else {
        console.log('No se proporcionó token');
        res.status(401).json({ success: false, message: 'No se proporcionó token' });
    }
}

app.post('/api/usuarios/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT id, username, password FROM usuarios WHERE username = ?';

    pool.query(sql, [username], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Error de base de datos' });
        }
        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error al verificar la contraseña' });
                }
                if (result) {
                    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '4h' });
                    console.log("Generated Token:", token);
                    return res.json({ success: true, token: token });
                } else {
                    return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
                }
            });
        } else {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});



app.get('/api/protected', verifyToken, (req, res) => {
    res.json({ message: 'Welcome to the protected route!', user: req.user });
});

app.get('/api/clientes/activos',verifyToken, (req, res) => {
    const query = "SELECT * FROM clientes WHERE estadoSuscripcion = 'Activa'";
    pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Error al consultar la base de datos' });
        }
        res.json(results);
    });
});

app.post('/api/clientes/agregar', verifyToken, (req, res) => {
    const { nombre, email, tipoSuscripcion, fechaInicio, fechaVencimiento } = req.body;
    const sql = 'INSERT INTO clientes (nombre, email, tipoSuscripcion, fechaInicio, fechaVencimiento, estadoSuscripcion) VALUES (?, ?, ?, ?, ?, "Activa")';
    pool.query(sql, [nombre, email, tipoSuscripcion, fechaInicio, fechaVencimiento], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Error al insertar el cliente' });
        }
        res.status(201).json({ success: true, message: 'Cliente agregado exitosamente', id: results.insertId });
    });
});

app.delete('/api/clientes/eliminar/:email', verifyToken,(req, res) => {
    const email = req.params.email;
    const sql = 'DELETE FROM clientes WHERE email = ?';
    pool.query(sql, [email], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Error al eliminar el cliente' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }
        res.json({ success: true, message: 'Cliente eliminado exitosamente' });
    });
});

app.get('/api/clientes/verificar/:email', verifyToken, (req, res) => {
    const sql = 'SELECT estadoSuscripcion FROM clientes WHERE email = ?';
    pool.query(sql, [req.params.email], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Error al consultar el estado de suscripción' });
        }
        if (results.length > 0) {
            res.json({ success: true, estadoSuscripcion: results[0].estadoSuscripcion });
        } else {
            res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }
    });
});

app.put('/api/clientes/renovar', verifyToken, (req, res) => {
    const { email, periodo } = req.body;
    const intervalo = periodo === 'anio' ? '1 YEAR' : '1 MONTH';
    const sql = `UPDATE clientes SET fechaVencimiento = DATE_ADD(fechaVencimiento, INTERVAL ${intervalo}), estadoSuscripcion = 'Activa' WHERE email = ?`;
    pool.query(sql, [email], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Error al renovar la suscripción' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }
        res.json({ success: true, message: 'Suscripción renovada exitosamente' });
    });
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
