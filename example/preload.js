const { contextBridge, ipcRenderer } = require("electron");

const ElectronFind = require("@mikolaj6r/electron-find/renderer.js");

let findInPage = null;

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels
    //let validChannels = ["toMain"];
    //if (validChannels.includes(channel)) {
    ipcRenderer.send(channel, data);
    //}
  },
  receive: (channel, func) => {
    // let validChannels = ["fromMain"];
    // if (validChannels.includes(channel)) {
    // Deliberately strip event as it includes `sender`
    ipcRenderer.on(channel, (event, ...args) => func(...args));
    //}
  },

  initFind: () => {
    findInPage = new ElectronFind();

    ipcRenderer.on("on-find", () => findInPage.openFindWindow());
  },
});
