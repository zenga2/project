var data;
require('../styles/main.css');

var worker = new Worker('/project/webpackDemo/app/scripts/testWorker.js');
worker.onmessage = function (event) {
    console.log(event);
};

require.ensure([], function () {
    data = require('./data');
    worker.postMessage(data.info);
});

setTimeout(function () {
    for (var i = 0; i < 100; i++) {
        console.log(+new Date);
    }
}, 50);

module.exports = {};

