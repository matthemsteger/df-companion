import {app, BrowserWindow} from 'electron';
import path from 'path';
import log from './logger';
import Database from './../database';

let mainWindow;

async function initializeDatabase() {
	const databasePath = `${app.getPath('userData')}/database.sqlite`;
	const connection = {
		filename: databasePath
	};

	const database = new Database({connection});
	await database.migrate();
	return database;
}

async function createMainWindow() {
	try {
		await initializeDatabase();
	} catch (err) {
		log.error('error while initializing database %o', err);
	}

	mainWindow = new BrowserWindow({width: 1024, height: 768});
	mainWindow.loadURL(`file://${path.resolve(__dirname, '../app')}/index.html`);
	mainWindow.webContents.openDevTools();

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createMainWindow();
	}
});
