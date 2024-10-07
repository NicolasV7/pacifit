import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1150,
    height: 880,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.setMenu(null);

  win.loadURL('http://localhost:5173');

  //win.webContents.openDevTools();

  win.webContents.insertCSS(`
    ::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }

    body {
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE y Edge */
    }

    body::-webkit-scrollbar {
      display: none; /* Chrome, Safari y Opera */
    }
  `);
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
