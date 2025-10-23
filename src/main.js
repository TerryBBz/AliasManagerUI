const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { AliasManager } = require('./shared/alias-manager-bridge');

// Garde une référence globale de l'objet window
let mainWindow;

function createWindow() {
  // Créer la fenêtre du navigateur
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hiddenInset', // Style macOS moderne
    show: false, // Ne pas afficher jusqu'à ce que le contenu soit prêt
  });

  // Charger l'interface React
  const isDev = process.argv.includes('--dev');
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile('src/renderer/build/index.html');
  }

  // Afficher la fenêtre quand elle est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Émis quand la fenêtre est fermée
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Cette méthode sera appelée quand Electron aura fini son initialisation
app.whenReady().then(createWindow);

// Quitter quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Communication avec le renderer process
const aliasManager = new AliasManager();

// IPC Handlers pour les opérations sur les alias
ipcMain.handle('get-all-aliases', async () => {
  try {
    return await aliasManager.getAllAliases();
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des alias: ${error.message}`);
  }
});

ipcMain.handle('get-groups', async () => {
  try {
    return await aliasManager.getGroups();
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des groupes: ${error.message}`);
  }
});

ipcMain.handle('add-alias', async (event, { name, command, group }) => {
  try {
    return await aliasManager.addAlias(name, command, group);
  } catch (error) {
    throw new Error(`Erreur lors de l'ajout de l'alias: ${error.message}`);
  }
});

ipcMain.handle('update-alias', async (event, { oldName, newName, command, group }) => {
  try {
    return await aliasManager.updateAlias(oldName, newName, command, group);
  } catch (error) {
    throw new Error(`Erreur lors de la modification de l'alias: ${error.message}`);
  }
});

ipcMain.handle('remove-alias', async (event, { name, group }) => {
  try {
    return await aliasManager.removeAlias(name, group);
  } catch (error) {
    throw new Error(`Erreur lors de la suppression de l'alias: ${error.message}`);
  }
});

ipcMain.handle('toggle-alias', async (event, { name, group, disabled }) => {
  try {
    return await aliasManager.toggleAlias(name, group, disabled);
  } catch (error) {
    throw new Error(`Erreur lors du changement d'état de l'alias: ${error.message}`);
  }
});

ipcMain.handle('update-alias-description', async (event, { name, group, description }) => {
  try {
    return await aliasManager.updateAliasDescription(name, group, description);
  } catch (error) {
    throw new Error(`Erreur lors de la mise à jour de la description: ${error.message}`);
  }
});

// IPC Handlers pour les opérations sur les groupes
ipcMain.handle('create-group', async (event, { groupName }) => {
  try {
    return await aliasManager.createGroup(groupName);
  } catch (error) {
    throw new Error(`Erreur lors de la création du groupe: ${error.message}`);
  }
});

ipcMain.handle('rename-group', async (event, { oldName, newName }) => {
  try {
    return await aliasManager.renameGroup(oldName, newName);
  } catch (error) {
    throw new Error(`Erreur lors du renommage du groupe: ${error.message}`);
  }
});

ipcMain.handle('delete-group', async (event, { groupName, deleteAliases = false }) => {
  try {
    return await aliasManager.deleteGroup(groupName, deleteAliases);
  } catch (error) {
    throw new Error(`Erreur lors de la suppression du groupe: ${error.message}`);
  }
});

ipcMain.handle('get-group-info', async (event, { groupName }) => {
  try {
    return await aliasManager.getGroupInfo(groupName);
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des informations du groupe: ${error.message}`);
  }
});

ipcMain.handle('get-groups-stats', async () => {
  try {
    return await aliasManager.getGroupsStats();
  } catch (error) {
    throw new Error(
      `Erreur lors de la récupération des statistiques des groupes: ${error.message}`
    );
  }
});