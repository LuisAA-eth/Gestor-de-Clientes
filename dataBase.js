const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});



connection.connect((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
    
});

// Función para insertar un nuevo cliente
function insertarCliente(cliente) {
    const { nombre, email, tipoSuscripcion,fechaInicio, fechaVencimiento, estadoSuscripcion} = cliente;
    // Primero, verificar si el cliente ya existe
    connection.query('SELECT * FROM clientes WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error al buscar el cliente:', err);
            return;
        }

        if (results.length > 0) {
            console.log('El cliente ya existe.');
            return; // Detener la ejecución si el cliente ya existe
        }

        // Si no existe, insertar el nuevo cliente
       
        
        const sqlInsert = 'INSERT INTO clientes (nombre, email,tipoSuscripcion, fechaInicio, fechaVencimiento, estadoSuscripcion) VALUE (?, ?, ?, ?, ?, ?)';

        connection.query(sqlInsert, [nombre, email,tipoSuscripcion, fechaInicio, fechaVencimiento , estadoSuscripcion], (err, result) => {
            if (err) {
                console.error('Error al insertar el cliente:', err);
                return;
            }
            if (result.affectedRows > 0) {
                console.log(`Cliente ${nombre} insertado con éxito.`);
            } else {
                console.log('No se pudo insertar el cliente.');
            }
        });
    });

}// Ejemplo de uso:
  insertarCliente({
    nombre: "Angel Lopez",
    email: "Angel@example.com",
    tipoSuscripcion: "MLB.TV",
    fechaInicio: new Date().toISOString().slice(0, 19).replace('T', ' '),
    fechaVencimiento: new Date().toISOString().slice(0, 19).replace('T', ' '),
    estadoSuscripcion: "Activa"
  });

// Verificar si un cliente ya existe antes de intentar insertarlo
function verificarCliente(email, callback) {
    const sql = 'SELECT * FROM clientes WHERE email = ?';

    connection.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Error al buscar el cliente:', err);
            callback(err, null);
            return;
        }
        if (results.length > 0) {
            console.log('El cliente ya existe en la base de datos.');
            callback(null, results[0]);
        } else {
            console.log('No se encontró ningún cliente con ese email.');
            callback(null, false);
        }
    });
}

// Uso de las funciones
verificarCliente('Manuel@example.com', (err, cliente) => {
    if (err) {
        console.error('Error al verificar el cliente.');
        return;
    }
    if (cliente) {
        console.log('Cliente encontrado:', cliente);
    } else {
        console.log('Cliente no existe, puede proceder a agregarlo.');
       
    }
});





/*const emailCliente = 'Manuel@example.com'; // Email del cliente que se desea buscar

// Consulta para buscar el cliente
connection.query('SELECT * FROM clientes WHERE email = ?', emailCliente, (err, rows) => {
    if (err) throw err;

    // Verificar si se encontraron resultados
    if (rows.length > 0) {
        const clienteEncontrado = rows[0]; // Se asume que solo se encuentra un cliente con ese email
        console.log('Cliente encontrado:', clienteEncontrado);
    } else {
        console.log('No se encontró ningún cliente con ese email.');
    }
});
*/

// Manejo de errores

connection.on('connect', () => {
    console.log('Conexión establecida con la base de datos MySQL');
});

connection.on('error', (err) => {
    console.error('Error en la conexión a la base de datos:', err);
});

// Cerrar la conexión al salir de la aplicación
process.on('SIGINT', () => {
    connection.end((err) => {
        if (err) throw err;
        console.log('Conexión a la base de datos cerrada');
        process.exit();
    });
});