const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");

const ElectronFind = require("@mikolaj6r/electron-find");

let win;

const winURL = "file://" + path.normalize(`${__dirname}/index.html`);

async function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 1040,
    center: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      enableRemoteModule: false,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  await win.loadURL(winURL);

  const findInPage = new ElectronFind(win.webContents);

  //win.webContents.openDevTools()
  win.on("closed", () => {
    win = null;
  });

  win.on("focus", () => {
    globalShortcut.register("CommandOrControl+F", function () {
      if (win && win.webContents) {
        win.webContents.send("on-find", "");
      }
    });
  });
  win.on("blur", () => {
    globalShortcut.unregister("CommandOrControl+F");
  });
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
  globalShortcut.unregister("CommandOrControl+F");
});

app.on("activate", () => {
  if (win === null) createWindow();
});
