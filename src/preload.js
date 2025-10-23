const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Opérations sur les alias
  getAllAliases: () => ipcRenderer.invoke('get-all-aliases'),
  getGroups: () => ipcRenderer.invoke('get-groups'),
  addAlias: (aliasData) => ipcRenderer.invoke('add-alias', aliasData),
  updateAlias: (aliasData) => ipcRenderer.invoke('update-alias', aliasData),
  removeAlias: (aliasData) => ipcRenderer.invoke('remove-alias', aliasData),
  toggleAlias: (aliasData) => ipcRenderer.invoke('toggle-alias', aliasData),
  updateAliasDescription: (aliasData) => ipcRenderer.invoke('update-alias-description', aliasData),

  // Opérations sur les groupes
  createGroup: (groupData) => ipcRenderer.invoke('create-group', groupData),
  renameGroup: (groupData) => ipcRenderer.invoke('rename-group', groupData),
  deleteGroup: (groupData) => ipcRenderer.invoke('delete-group', groupData),
  getGroupInfo: (groupData) => ipcRenderer.invoke('get-group-info', groupData),
  getGroupsStats: () => ipcRenderer.invoke('get-groups-stats'),
});