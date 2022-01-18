const { app, BrowserWindow } = require('electron');
const path = require('path');

const ElectronStore = require('electron-store');
ElectronStore.initRenderer();

if (require('electron-squirrel-startup')) { 
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 400,
    height: 700,
    resizable: false,
    icon: __dirname + '/favicon.ico',
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
    },
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.show();
  });

  mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});