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

export {traverseDom, funcWrapper, traverseDomWrapper}
