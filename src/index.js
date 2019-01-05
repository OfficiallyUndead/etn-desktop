import { app, autoUpdater, BrowserWindow } from 'electron';
const electronLogger = require('electron-log');
electronLogger.info("Starting app " + app.getVersion());

electronLogger.info("Load updater ...");
const updater = require('update-electron-app')({
  repo: 'OfficiallyUndead/etn-desktop',
  updateInterval: '1 hour',
  logger: electronLogger,
});

// Start express which handles serving pages and some custom requests (forwarding to avoid content control errors)
electronLogger.info('Load express ...');
const interfaceServer = require('./modules/interface/index');
interfaceServer.start();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, updaterWindow;

const createWindow = () => {
  // Create the browser window.
  electronLogger.info("Set up main window");
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 480
  });

  electronLogger.info("Load the content")
  // and load the index.html of the app.
  // mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.loadURL('http://localhost:3000/stats.html');

  // Open the DevTools.
  electronLogger.info("If dev mode, load the dev tools window");
  if(isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electronLogger.info("Electron is ready, create the window");
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

function isDev() {
  return process.mainModule.filename.indexOf('app.asar') === -1;
}

/**
 * Updater stuff
 */
// autoUpdater.on("update-available", () => {
//   isUpdating = true;
//   if(justLaunched) {
//     mainWindow.hide();
//   }
//   updaterWindow = new BrowserWindow({
//     width: 200,
//     height: 200,
//     frame: false
//   });
//   updaterWindow.loadURL(`file://${__dirname}/updater.html`);
//   electronLogger.info("New update available, Downloading now ...");
// });
// autoUpdater.on("download-progress", (ev, progressObj) => {
//   console.log(progressObj);
// });