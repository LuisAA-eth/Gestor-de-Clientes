document.addEventListener('DOMContentLoaded', function() {
    fetchClientesActivos();

    // Función para obtener clientes activos desde el servidor
    function fetchClientesActivos() {
        const token = localStorage.getItem('token'); // Obtener el token almacenado en localStorage

        fetch('http://localhost:3000/api/clientes/activos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Añadir el token en la cabecera Authorization
                'Content-Type': 'application/json'
            }
        })
        .then(handleTokenExpiry)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
                return response.json();
            
            
        })
        .then(data => {
            if (data && data.length > 0) {
                populateTable(data);
                console.log(data);
            } else {
                console.log('No hay datos disponibles para mostrar.');
            }
        })
        .catch(error => {
            console.error('Error al cargar los clientes activos:', error);
            const tableBody = document.getElementById('clientes-activos-table').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '<tr><td colspan="7">No se pudo cargar la información de los clientes.</td></tr>';
        });

        
    }

    // Función para mostrar los datos de los clientes en una tabla
    function populateTable(clientes) {
        const tableBody = document.getElementById('clientes-activos-table').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';  // Limpiar la tabla antes de agregar nuevos datos

        clientes.forEach(cliente => {
            let row = tableBody.insertRow();
            row.insertCell(0).textContent = cliente.Id_cliente;
            row.insertCell(1).textContent = cliente.Nombre;
            row.insertCell(2).textContent = cliente.Email;
            row.insertCell(3).textContent = cliente.tipoSuscripcion;
            row.insertCell(4).textContent = new Date(cliente.FechaInicio).toLocaleDateString(); 
            row.insertCell(5).textContent = new Date(cliente.FechaVencimiento).toLocaleDateString();
            row.insertCell(6).textContent = cliente.estadoSuscripcion;

          
            let checkSubCell = row.insertCell(7); 
            let checkSubButton = document.createElement('button');
            checkSubButton.textContent = 'Verificar Suscripción';
            checkSubButton.className = 'check-sub-button';
            checkSubButton.onclick = function() { verificarEstadoSuscripcion(cliente.Email); };
            checkSubCell.appendChild(checkSubButton);

            
            let renewCell2 = row.insertCell(8);
            let renewButtonYear = document.createElement('button');
            renewButtonYear.textContent = 'Renovar 1 Año';
            renewButtonYear.className = 'renew-button';
            renewButtonYear.onclick = function() { renovarSuscripcion(cliente.Email, 'anio'); };
            renewCell2.appendChild(renewButtonYear);

            let renewButtonMonth = document.createElement('button');
            renewButtonMonth.textContent = 'Renovar 1 Mes';
            renewButtonMonth.className = 'renew-button';
            renewButtonMonth.onclick = function() { renovarSuscripcion(cliente.Email, 'mes'); };
            renewCell2.appendChild(renewButtonMonth);


        

            let deleteCell = row.insertCell(9);
            let deleteButton = document.createElement('button');
            deleteButton.className = 'noselect delete-button';  // Añadir clases para estilos
            deleteButton.innerHTML = `
            <span class="text">Eliminar</span>
            <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                </svg>
            </span>
           `;
            deleteButton.onclick = function() { eliminarCliente(cliente.Email); };
            deleteCell.appendChild(deleteButton);



        });
    }

    
    // Funciones para manejar las acciones específicas
    function renovarSuscripcion(email, periodo) {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/api/clientes/renovar`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, periodo })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            fetchClientesActivos(); // Recargar la lista de clientes
        })
        .catch(error => {
            console.error('Error al renovar suscripcion del cliente:', error);
            alert('Error al renovar suscripcion del cliente.');
        });
    }

    function eliminarCliente(email) {

        if (!email) {
            console.error("Email is undefined");
            return;
        }
        if (confirm(`¿Está seguro de que desea eliminar al cliente con email: ${email}?`)) {
            const token = localStorage.getItem('token');
            fetch(`http://localhost:3000/api/clientes/eliminar/${email}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                alert(data.message);
                fetchClientesActivos(); // Recargar la lista de clientes
            })
            .catch(error => {
                console.error('Error al eliminar el cliente:', error);
                alert('Error al eliminar el cliente.');
            });
        }
    }
    

    function verificarEstadoSuscripcion(email) {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/api/clientes/verificar/${email}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert(`Estado de suscripción: ${data.estadoSuscripcion}` );
        })
        .catch(error => console.error('Error:', error));
    }

   
    
    function handleTokenExpiry(response) {
        if (response.status === 401) { // Asumiendo que el servidor devuelve 401 cuando el token ha expirado
            console.log('Token ha expirado, redirigiendo a la página de inicio de sesión.');
            alert('Tu sesión ha expirado, por favor vuelve a iniciar sesión.');
            localStorage.removeItem('token'); // Opcional: limpiar el token expirado
            window.location.href = 'login.html'; 
        }
        // Si el estado no es 401, simplemente retorna la respuesta para continuar con el procesamiento habitual
        return response;
    }
    

    function refreshToken() {
        const expiredToken = localStorage.getItem('token');
        return fetch('http://localhost:3000/api/token/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ expiredToken })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return data.token; // Retorna el nuevo token
            } else {
                throw new Error(data.message);
            }
        });
    }
    


});
