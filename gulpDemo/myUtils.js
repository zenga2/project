/**
 * Created by ZENG on 2017/2/19.
 */
function log(msg) {
    var d = new Date();
    var arr = [d.getHours(), d.getMinutes(), d.getSeconds()].map(function (val) {
        return val < 10 ? '0' + val : val;
    });
    var prefixStr = '[' + arr.join(":") + '] ';
    console.log(prefixStr + msg);
}

// 为在pipe中运行代码进行包装
function wrapper(fn) {
    var Stream = require('stream');
    var stream = new Stream.Transform({objectMode: true});

    stream._transform = function (file, unused, callback) {
        callback(null, file);
    };

    fn && fn();

    return stream;
}

function logObj(obj) {
    console.log(JSON.stringify(obj, null, '    '));
}

module.exports = {
    log: log,
    wrapper: wrapper,
    logObj: logObj
};