// /assets/js/login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    // Credenciales predeterminadas para el login (solo para desarrollo)
    const USERNAME = 'admin';
    const PASSWORD = 'admin';

    // Manejar el evento de envío del formulario
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío del formulario

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validación de las credenciales
        if (username === USERNAME && password === PASSWORD) {
            // Redirigir al dashboard
            window.location.href = 'views/dashboard.html';
        } else {
            // Mostrar mensaje de error
            errorMessage.textContent = 'Usuario o contraseña incorrectos';
        }
    });
});
