print("repl.js");

function readFile(filename, cb) {
    uv.fs_open(filename, 'r', 0, function (handle, err) {
        var fileOff = 0;
        var data = new Uint8Array(256);
        var dataOff = 0;

        if (err) {
            return cb(null, err);
        }
        function readCb(buf, err) {
            var res;
            var newData;

            print('Read callback:', buf.length, err);
            if (err) {
                uv.fs_close(handle);
                return cb(null, err);
            }
            if (buf.length == 0) {
                uv.fs_close(handle);
                res = new Uint8Array(dataOff);
                res.set(data.subarray(0, dataOff));
                res = Duktape.Buffer(res);  // plain buffer
                print('Read', res.length, 'bytes from', filename);
                return cb(res, null);
            }
            while (data.length - dataOff < buf.length) {
                print('Resize file read buffer:', data.length, '->', data.length * 2);
                newData = new Uint8Array(data.length * 2);
                newData.set(data);
                data = newData;
            }
            data.set(new Uint8Array(buf), dataOff);
            dataOff += buf.length;
            fileOff += buf.length;
            uv.fs_read(handle, 4096, fileOff, readCb);
        }
        uv.fs_read(handle, 4096, fileOff, readCb);
    });
}

// readFile("/home/ubuntu/dev/v8_qjs/output/vendor/WAService.js", function(res, err) {
//     if (err) return print("readFile repl.js err:", err);
//     print("repl.js:", res.toString()); 
// })

// var res = loadFile("/home/ubuntu/dev/v8_qjs/output/vendor/WAService.js", function(res, err) {
//     if (err) return print("readFile repl.js err:", err);
//     print("repl.js:", res.toString()); 
// })

// print("repl.js:", res.toString());



// (function(global) {

//     print(global.print)

// })(this)

print(globalThis.print)

print(eval("repl.js", "print(123)"))


var res = loadFile("/home/ubuntu/dev/v8_qjs/output/vendor/WAService.js")
var res = loadFile("/home/ubuntu/dev/v8_qjs/output/vendor/WAService.js")
 
