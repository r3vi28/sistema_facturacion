// /main.js

const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 800, // Ancho inicial
        height: 600, // Altura inicial
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Cargar la página HTML
    win.loadFile('index.html');

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