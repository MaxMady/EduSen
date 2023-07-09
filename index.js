const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1048,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, 'neonix.png')
  });

  win.loadFile("index.html");
  win.maximize();

  win.on('maximize', () => {
    console.log('Window maximized');
  });

  win.on('unmaximize', () => {
    win.maximize(); // Forces the window to stay maximized
  });
  win.on('blur', () => {
    // Code to execute when the window loses focus
    console.log('Window lost focus');
  });
  win.on('will-move', (event, newBounds) => {
    const { x, y } = newBounds;
    console.log(`Window will be moved: x=${x}, y=${y}`);
  });
  

  win.on('move', () => {
    const { x, y } = win.getBounds();
    console.log(`Window moved: x=${x}, y=${y}`);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});