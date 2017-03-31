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

export {getData, setData}
