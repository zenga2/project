"use strict";

// import fs from "fs";

var test = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return new Promise(function (resolve, reject) {
                            setTimeout(function () {
                                console.log("er");
                                resolve("hello");
                            }, 500);
                        });

                    case 2:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function test() {
        return _ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('babel-polyfill');

test().then(function (data) {
    console.log("www");
    console.log(data);
});