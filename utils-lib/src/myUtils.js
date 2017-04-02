/**
 * Created by ZENG on 2017/1/6.
 */

// 常用正则
var ipRegExp = /^(((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}(((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.)$/;
var urlRegExp = /^https?:\/\/[-\w.]+(:\d+)?(\/([\w/#_.]*)?)?$/;
var emailRegExp = /^(\w+\.)*\w+@(\w+\.)+[A-Za-z]+$/;

// 将图片转为base64
// <input type="file"  id="picFile" onchange="readFile(this)" />
function readFile(obj) {
    var reader;
    var file = obj.files[0];

    //判断类型是不是图片
    if (!/image\/\w+/.test(file.type)) {
        alert("请确保文件为图像类型");
        return false;
    }
    reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        alert(this.result); //就是base64
    }
}

// 遍历dom
function traverseDom(node, func) {
    func(node);
    node = node.firstChild;
    while (node) {
        traverseDom(node, func);
        node = node.nextSibling;
    }
}

// 对函数进行包装，增加过滤条件
function funcWrapper(func, filter) {
    return function () {
        if (filter.apply(this, arguments)) {
            func.apply(this, arguments);
        }
    }
}

// 给遍历dom函数增加参数校验
var traverseDomWrapper = funcWrapper(traverseDom, function (node, func) {
    var errStr = "";
    if (!(node instanceof Node)) {
        errStr += "\n参数错误：第一个参数应该是一个DOM";
    }
    if (typeof func !== "function") {
        errStr += "\n参数错误：第二个参数应该是一个回调函数";
    }
    if (errStr) {
        throw new Error(errStr);
    }
    return true;
});

// 将child节点插入到parent中，使其成为第n个子节点(从0开始计数)
function insertAt(parent, child, n) {
    var childNodes = parent.childNodes;
    var len = childNodes.length;

    if (n < 0 || n > len) {
        throw new Error("invalid index");
    } else if (n === len) {
        parent.appendChild(child);
    } else {
        parent.insertBefore(child, childNodes[n]);
    }
}

// 统计代码执行时间
// todo 计算average time（多次取平均值）
function executeTime(fn, n) {
    var startTime = +(new Date);
    var totalTime;
    var i = 0;
    for (; i < n; i++) {
        fn();
    }
    totalTime = +(new Date) - startTime;
    console.log("Total time: " + totalTime + "ms");
    return totalTime;
}

// 在IE上模拟dataset，因为<=10不支持dataset
// 1、使用时必须用完整访问方式，即dom.dataset.xxx,
// 2、不能把dom.dataset赋值给一个变量，然后直接用这个变量引用对象进行修改
//    因为这样就没法把数据同步到HTML上
// 3、格式要求比一般实现严格，dataset的属性必须是驼峰的写法,
//    HTML的data-属性名，必须是xx-yy-zz(字母必须小写，中间连字符只能有一个)
//    否则将会出错
function supportDataset() {
    if (!("dataset" in document.body)) {
        Object.defineProperty(Element.prototype, "dataset", {
            configurable: true,
            enumerable: false,
            get: function () {
                var name;
                var patt;
                var result;
                var attrStr;
                var self = this;
                var interval;

                // >=IE9支持outerHTML、trim()、Object.create()
                // 数据流向 HTML属性 ==> dataMapObj;
                this.htmlAttrObj = Object.create(null);
                this.dataMapObj = Object.create(null);
                attrStr = this.outerHTML.match(/^<[a-z]+(.*)>/)[1].trim();
                patt = /\bdata-(-?\w+(?:-\w+)*)="(\w+)"/g;
                while (result = patt.exec(attrStr)) {
                    name = result[1].replace(/-(\w)/g, function (str, $1) {
                        return $1.toUpperCase();
                    });
                    this.dataMapObj[name] = this.htmlAttrObj[name] = result[2];
                }

                // 同步数据(dataMapObj ==> HTML属性)
                function syncData(dom) {
                    var haObj = dom.htmlAttrObj;
                    var dmObj = dom.dataMapObj;
                    var key;
                    var isComplete = true;   // 多检查一次，确保同步完全

                    // 删除HTML属性
                    for (key in haObj) {
                        if (!(key in dmObj)) {
                            delete haObj[key];
                            dom.removeAttribute("data-" + key.replace(/[A-Z]/g, function (str) {
                                    return "-" + str.toLowerCase();
                                }));
                            isComplete = false;
                        }
                    }

                    // 修改或新增HTML属性
                    for (key in dmObj) {
                        if (dmObj[key] !== haObj[key]) {
                            haObj[key] = dmObj[key];
                            dom.setAttribute("data-" + key.replace(/[A-Z]/g, function (str) {
                                    return "-" + str.toLowerCase();
                                }), haObj[key]);
                            isComplete = false;
                        }
                    }

                    console.log("syncData：isComplete-" + isComplete + "---" + (+new Date));
                    return isComplete;
                }

                // 设置定时器，更新接下来的修改
                interval = setInterval(function () {
                    if (syncData(self)) {
                        clearInterval(interval);
                    }
                }, 10);

                return this.dataMapObj;
            }
        });
    }
}

// 获取dataset的值，因为<=IE10不支持dataset，所以直接当属性来获取
function supportData() {
    if (!("data" in Element.prototype)) {
        Object.defineProperty(Element.prototype, "data", {
            configurable: true,
            enumerable: false,
            writable: false,
            value: function (key, val) {
                var len = arguments.length;

                if (len === 1) {
                    return getData(this, key);
                } else if (len === 2) {
                    setData(this, key, val);
                }
            }
        });
    }
}
function getData(dom, key) {
    if ("dataset" in dom) {
        return dom.dataset[key];
    } else {
        key = "data-" + key.replace(/[A-Z]/g, function (str) {
                return "-" + str.toLowerCase();
            });
        return dom.getAttribute(key);
    }
}
function setData(dom, key, val) {
    if ("dataset" in dom) {
        dom.dataset[key] = val;
    } else {
        key = "data-" + key.replace(/[A-Z]/g, function (str) {
                return "-" + str.toLowerCase();
            });
        dom.setAttribute(key, val);
    }
}

// 查询窗口滚动条的位置
function getScrollOffset(w) {
    var htmlDom;
    w = w || window;

    // 支持>=IE9和其他浏览器
    if ("pageXOffset" in w) {
        return {x: w.pageXOffset, y: w.pageYOffset};
    }

    // 支持<=IE8的IE浏览器(只对标准模式进行支持，不考虑怪异模式)
    htmlDom = w.document.documentElement;
    return {x: htmlDom.scrollLeft, y: htmlDom.scrollTop};
}

// 查询窗口的视口尺寸
function getViewportSize(w) {
    var htmlDom;
    w = w || window;

    // 支持>=IE9和其他浏览器
    if ("innerWidth" in w) {
        return {width: w.innerWidth, height: w.innerHeight}
    }

    // 支持<=IE8的IE浏览器(只对标准模式进行支持，不考虑怪异模式)
    htmlDom = w.document.documentElement;
    return {width: htmlDom.clientWidth, height: htmlDom.clientHeight}
}

// 滚动浏览器到文档最下面的页面可见
function scrollToVisible() {
    // 文档的高度
    var documentHeight = document.documentElement.offsetHeight;
    // 视口的高度
    var viewportHeight = getViewportSize().height;

    // 滚动让最后一页可见
    window.scrollTo(0, documentHeight - viewportHeight);
}

// 获取元素e的文档坐标
// 窗口的滚动条的位置还等于document.documentElement.getBoundingClientRect()的left和top的绝对值
// 这个是视口坐标原点到文档坐标原点的偏移量(即窗口的滚动条的位置等于两坐标原点的偏移量)
function getElementPosition(el) {
    var rectObj = el.getBoundingClientRect();
    var scrollOffsetObj = getScrollOffset();
    return {
        left: rectObj.left + scrollOffsetObj.x,
        top: rectObj.top + scrollOffsetObj.y
    };
}

// 获取元素e的视口坐标
// 这个兼容较低版本浏览器(不支持getBoundingClientRect)
function getClientPosLV(el) {
    var left = 0;
    var top = 0;
    var e;
    
    // 循环以累加偏移量
    for(e = el; !!e; e = e.offsetParent) {
        left += el.offsetLeft;
        top += el.offsetTop;
    }

    // 循环以减去滚动的偏移量
    // 这也减去了主滚动条，并转换为视口坐标
    for(e = el.parentNode; !!e && e.nodeType === 1; e = el.parentNode) {
        left -= e.scrollLeft;
        top -= e.scrollTop;
    }

    return {left: left, top: top};
}

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

// 扩展对象
function extendObj(targetObj, obj, isOverwrite) {
    isOverwrite = isOverwrite || false;
    var key;

    for (key in obj) {
        if (obj.hasOwnProperty(key) && (isOverwrite || !(key in targetObj))) {
            targetObj[key] = obj[key];
        }
    }
    return targetObj;
}

// ajax模块
function ajax(url, options) {
    var defaultOptions = {
        method: "POST",
        isAsync: true,
        headers: {
            //"Content-Type": "text/plain;charset=UTF-8"
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        dataType: "json"
    };
    options = extendObj((options || {}), defaultOptions, true);
    var headKey;
    var headers = options.headers;
    var dataStr = null;
    var urlDataStr = "";
    var data = options.data;

    for (var key in data) {
        urlDataStr += "&" + key + "=" + data[key];
    }
    if (urlDataStr) {
        if (options.method.toUpperCase() === "GET") {
            url += (url.indexOf("?") === -1 ? "?" + urlDataStr.slice(1) : urlDataStr);
        } else {
            dataStr = urlDataStr.slice(1);
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open(options.method, url, options.isAsync, options.username, options.password);
    for (headKey in headers) {
        xhr.setRequestHeader(headKey, headers[headKey]);
    }

    function handle() {
        if (xhr.status === 200) {
            if (options.dataType === "json" && options.success) {
                options.success(JSON.parse(xhr.responseText), xhr.statusText, xhr);
            }
        } else {
            options.error && options.error(xhr.responseText, xhr.statusText, xhr);
        }
    }

    // 异步ajax请求
    if (options.isAsync) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                handle();
            }
        };
    }

    xhr.send(dataStr);

    // 同步ajax请求
    if (!options.isAsync) {
        handle();
    }
}

// JSONP模块
var getJSONP = (function () {
    var counter = 0;
    return function (url, callback) {
        var cbnum = "cb" + counter++;
        var cbname = "getJSONP" + "." + cbnum;
        var scriptDom = document.createElement("script");

        if (url.indexOf("?") === -1) {
            url += "?jsonp=" + cbname;
        } else {
            url += "&jsonp=" + cbname;
        }

        getJSONP[cbnum] = function (data) {
            try {
                callback && callback(data);
            } finally {
                delete getJSONP[cbnum];
                scriptDom.parentNode.removeChild(scriptDom);
            }
        };

        scriptDom.src = url;
        document.head.appendChild(scriptDom);
    }
})();

// 增强版typeof
function getType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

// 判断类型的工具方法
var typeUtils = (function () {
    function isType(type) {
        return function (obj) {
            return Object.prototype.toString.call(obj) === "[object " + type + "]";
        }
    }

    return {
        isObject: isType("Object"),
        isString: isType("String"),
        isArray: Array.isArray || isType("Array"),
        isFunction: isType("Function"),
        isUndefined: isType("Undefined")
    };
})();

// 遍历对象或数组
function each(obj, fn) {
    if (!obj || !fn) return;
    var i;
    var len;
    var key;

    if (typeUtils.isArray(obj)) {
        for (i = 0, len = obj.length; i < len; i++) {
            if (fn.call(obj, obj[i], i, obj) === false) return;
        }
    } else {
        for (key in obj) {
            if (fn.call(obj, obj[key], key, obj) === false) return;
        }
    }
}

// 遍历对象的属性
function walkProperty(obj, fn) {
    each(obj, function (item, key) {
        fn.call(this, item, key, this);

        var type = getType(item);
        if (type === "object" || type === "array") {
            walkProperty(item, fn);
        }
    });
}

// 实现以类同步代码的方式书写嵌套的异步函数（函数实现）
function exeQueue() {
    var funcArr = Array.prototype.slice.call(arguments);
    var len = funcArr.length;
    var i = 0;

    function next(data) {
        if (i < len) {
            funcArr[i++](data, next);
        }
    }

    next();
}

// 实现以类同步代码的方式书写嵌套的异步函数（函数实现）
function ExeQueue() {
    this.funcArr = Array.prototype.slice.call(arguments);
}

ExeQueue.prototype.add = function (fn) {
    this.funcArr.push(fn);
    return this;
};
ExeQueue.prototype.addAll = function (fnArr) {
    this.funcArr = this.funcArr.concat(fnArr);
    return this;
};
ExeQueue.prototype.clear = function () {
    this.funcArr = [];
    return this;
};
ExeQueue.prototype.run = function (isClear) {
    var i = 0;
    var fnArr = this.funcArr;
    var len = fnArr.length;

    if (isClear) this.funcArr = [];

    function next(data) {
        if (i < len) {
            fnArr[i++](data, next);
        }
    }

    next();
};