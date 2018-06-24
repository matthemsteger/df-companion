import {app, BrowserWindow} from 'electron';
import installExtension, {REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, REACT_PERF} from 'electron-devtools-installer';
import path from 'path';
import {ensureDirectory} from './../common/utils/fs';
import log from './logger';

const appRoot = `${app.getPath('userData')}`;
let mainWindow;

async function createMainWindow() {
	try {
		await ensureDirectory(path.join(appRoot, 'df-raw-cache')).promise();
	} catch (err) {
		log.error('error while initializing database %o', err);
	}

	try {
		await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, REACT_PERF], true);
	} catch (err) {
		log.error('error while installing extensions', err);
	}

	mainWindow = new BrowserWindow({width: 1024, height: 768, webPreferences: {nodeIntegrationInWorker: true}});
	mainWindow.loadURL(`file://${path.resolve(__dirname, '../app')}/index.html`);
	mainWindow.webContents.openDevTools();

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

// async function createBackgroundWorkerWindow() {
// 	backgroundWorkerWindow = new BrowserWindow({show: false});
// 	backgroundWorkerWindow.loadURL(`file://${path.resolve(__dirname, '../app')}/worker.html`);
// 	backgroundWorkerWindow.on('closed', () => {
// 		backgroundWorkerWindow = null;
// 	});
// 	backgroundWorkerWindow.openDevTools();
// }

app.on('ready', async () => {
	await Promise.all([/* createBackgroundWorkerWindow(), */createMainWindow()]);
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createMainWindow();
	}

	// if (backgroundWorkerWindow === null) {
	// 	createBackgroundWorkerWindow();
	// }
});

// ipcMain.on(WORKER_CHANNEL_IN, (event, action) => {
// 	if (backgroundWorkerWindow) {
// 		backgroundWorkerWindow.webContents.send(WORKER_CHANNEL_IN, action);
// 	}
// });

// ipcMain.on(WORKER_CHANNEL_OUT, (event, action) => {
// 	if (mainWindow) {
// 		mainWindow.webContents.send(WORKER_CHANNEL_OUT, action);
// 	}
// });
