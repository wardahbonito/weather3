const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,   // Enable node integration
            contextIsolation: false, // Disable context isolation
        },
    });

    win.loadFile(path.join(__dirname, 'index.html'))
        .then(() => console.log("index.html loaded successfully"))
        .catch(err => console.error("Error loading HTML:", err));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
