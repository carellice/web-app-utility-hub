const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("slideshowerDesktop", {
  chooseDirectory: () => ipcRenderer.invoke("choose-directory"),
});
