// /main.js

const { app, BrowserWindow } = require('electron');

const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800, // Ancho inicial
        height: 600, // Altura inicial
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", "data:"],
                    connectSrc: ["'self'", "http://localhost:3000"]
                }
            }
        }
    });

    // Cargar la página HTML
    win.loadFile('index.html');
    // win.loadFile(path.join(__dirname, 'views', 'dashboard.html'));

    // Maximizar la ventana
    win.maximize();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});