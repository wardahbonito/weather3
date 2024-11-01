const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
        },
    });

    win.loadFile('src/index.html')
        .then(() => console.log("HTML loaded successfully"))
        .catch(err => console.error("Error loading HTML:", err));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});