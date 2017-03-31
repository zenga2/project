// 文档就绪函数
var whenReady = (function () {
    var funcs = [];        // 当获得事件时，需要运行的函数
    var ready = false;     // 当触发事件时，切换到true

    // 文档准备就绪时，调用事件处理程序
    function handler() {
        document.removeEventListener("DOMContentLoaded", handler);
        window.removeEventListener("load", handler);

        // 运行所有注册函数
        // 注意每次都要计算func.length,
        // 以防止这些函数调用时，注册新的函数
        for (var i = 0; i < funcs.length; i++) {
            funcs[i].call(document);
        }

        ready = true;
        funcs = null;
    }

    // doScroll只在 <=IE10 中存在,其类型是function
    // IE11和其他浏览器不存在该属性
    if (document.readyState === "complete" ||
        ( document.readyState !== "loading" && !document.documentElement.doScroll )) {
        window.setTimeout(handler, 0);
    } else {
        document.addEventListener("DOMContentLoaded", handler);
        window.addEventListener("load", handler);
    }

    return function (f) {
        if (ready) {
            // 已准备就绪，就直接调用
            f.call(document);
        } else {
            // 否则，就加入队列等候
            funcs.push(f);
        }
    }
})();

export {whenReady}
