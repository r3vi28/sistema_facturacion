// controllers/authController.js
const predefinedUser = {
    username: 'admin',
    password: 'admin'  // ⚠️ Esto es solo para desarrollo. Nunca almacenes contraseñas planas en producción.
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    
    // Verificar si las credenciales coinciden
    if (username === predefinedUser.username && password === predefinedUser.password) {
        res.json({ success: true, redirectURL: '/views/dashboard' });
    } else {
        res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' }); // Mejora: Usa código 401 para autenticación fallida
    }
};
