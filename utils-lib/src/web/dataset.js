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

