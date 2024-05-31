document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to login');
        }
        return response.json();
    })

    .then(data => {
        if (data.success) {
            console.log('Login successful:', data);
            localStorage.setItem('token', data.token);  // Guarda el token en localStorage
            window.location.href = 'index.html'; // Redirecciona a la página principal o a donde sea necesario
        } else {
            throw new Error(data.message || 'Unknown error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('error-msg').textContent = error.message;  // Mostrar el mensaje de error en el DOM
    });
});


