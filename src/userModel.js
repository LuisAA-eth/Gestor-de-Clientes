const mysql = require('mysql');
require('dotenv').config();
// Creación del pool de conexiones a la base de datos
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Función para encontrar un usuario por nombre de usuario
function findUserByUsername(username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM usuarios WHERE username = ?';
        pool.query(sql, [username], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]); // Asumiendo que el nombre de usuario es único
            }
        });
    });
}

// Función para encontrar un usuario por ID
function findUserById(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM usuarios WHERE id = ?';
        pool.query(sql, [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]); // Asumiendo que el ID es único
            }
        });
    });
}

// Exportar las funciones para su uso en otras partes de la aplicación
module.exports = {
    findUserByUsername,
    findUserById
};
