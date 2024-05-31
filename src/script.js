
// Obtener referencias a elementos HTML solo una vez, pero no sus valores
const form = document.getElementById('cliente-form');
const nombreInput = document.getElementById('nombre');
const emailInput = document.getElementById('email');
const tipoSuscripcionInput = document.getElementById('tipoSuscripcion');
const fechaInicioInput = document.getElementById('fechaInicio');
const fechaVencimientoInput = document.getElementById(`fechaVencimiento`);
const clientesList = document.getElementById('clientes-list'); // Asegúrate de que este elemento exista en tu HTML

// Evento para manejar la presentación del formulario
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Obtener los valores de los inputs al momento de enviar el formulario
    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const tipoSuscripcion = tipoSuscripcionInput.value;
    const fechaInicio = fechaInicioInput.value;
    const fechaVencimiento = fechaVencimientoInput.value
   

    // Validar los campos aquí antes de enviarlos al servidor
    if (!nombre || !email || !tipoSuscripcion || !fechaInicio || !fechaVencimiento) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    // Expresión regular para validar el correo electrónico
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        alert('Por favor ingrese un correo electrónico válido.');
        return;
    }

    // Objeto cliente para enviar al servidor
    const cliente = { nombre, email, tipoSuscripcion, fechaInicio, fechaVencimiento };

    // Llamar a la API para agregar el cliente
    const token = localStorage.getItem('token');
    console.log('Token recuperado:', token);

    if (!token) {
        alert('No se encontró el token de autenticación. Por favor, inicia sesión de nuevo.');
        return;
    }
    fetch('http://localhost:3000/api/clientes/agregar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token} `
        },
        body: JSON.stringify(cliente)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Cliente agregado:', data);
        alert(data.message);
        if (data.success) {
            // Actualiza la lista de clientes si es necesario
            document.getElementById('cliente-form').reset();
            mostrarClientes();
        }
    })

    .catch(error => {
        console.error('Error al agregar el cliente:', error);
        alert('Falló al agregar el cliente. Por favor, revise los detalles y reintente.');
    });

   
});

// Función para mostrar los clientes en la lista
function mostrarClientes() {
    fetch('/api/clientes/activos') // Asegúrate de que esta URL es correcta
        .then(response => response.json())
        .then(clientes => {
            clientesList.innerHTML = ''; // Limpiar la lista
            clientes.forEach(cliente => {
                const item = document.createElement('div');
                item.textContent = `Nombre: ${cliente.nombre}, Email: ${cliente.email},Tipo de Suscripción: ${cliente.tipoSuscripcion}, Fecha de Inicio: ${cliente.fechaInicio}, Fecha de Vencimiento: ${cliente.fechaVencimiento}`;
                clientesList.appendChild(item);
            });
        })
        .catch(error => console.error('Error al cargar los clientes:', error));
}

