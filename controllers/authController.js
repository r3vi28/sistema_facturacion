// controllers/authController.js
const predefinedUser = {
    username: 'admin',
    password: 'admin'
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    
    // Verificar si las credenciales coinciden
    if (username === predefinedUser.username && password === predefinedUser.password) {
        res.json({ success: true, redirectURL: '/views/dashboard' });
    } else {
        res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
};
