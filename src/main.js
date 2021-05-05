const {app, BrowserWindow} = require('electron');
const path = require('path');
const XLSX = require('xlsx');

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile(path.join(__dirname, 'pages/index.html'));
}
readExcel();
console.log(111);

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

function readExcel () {
    var reader = new FileReader();
    reader.onload = function (e) {
        // 数据预处理
        var binary = '';
        var bytes = new Uint8Array(e.target.result);
        var length = bytes.byteLength;
        for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        /* 读取 workbook */
        var wb = XLSX.read(binary, {
            type: 'binary'
        });

        /* 选择第一个sheet */
        var wsname = wb.SheetNames[0];
        var ws = wb.Sheets[wsname];

        /* excel转换json数组,加上{header:1}是普通数组，不写是对象数组 */
        self.data = XLSX.utils.sheet_to_json(ws);
        console.log(self.data);
    };
}