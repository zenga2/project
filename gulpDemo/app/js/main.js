/**
 * Created by ZENG on 2017/1/15.
 */
define('../js/main.js', function (require, exports, module) {
    var worker = new Worker("../js/testWorker.js");
    worker.onmessage = function (event) {
        console.log(event);
    };
    worker.postMessage("hello");
    setTimeout(function () {
        for (var i = 0; i < 100; i++) {
            console.log(+new Date);
        }
    }, 50);

    module.exports = {};
});

