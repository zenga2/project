import {isArray, isEmptyObj} from './typeUtils'

function each(obj, fn) {
    if (!obj || !fn) return

    if (isArray) {
        for (let i = 0, len = obj.length; i < len; i++) {
            if (fn.call(obj, obj[i], i) === false) return
        }
    } else {
        let keys = Object.keys(obj)
        for (let i = 0, len = keys.length; i < len; i++) {
            let k = keys[i]
            if (fn.call(obj, obj[k], k) === false) return
        }
    }
}

// 扩展对象
function extendObj(targetObj, obj, isOverwrite) {
    isOverwrite = isOverwrite || false;
    let keys = Object.keys(obj)

    for (let i = 0, len = keys.length; i < len; i++) {
        let key = keys[i]
        if (isOverwrite || !(key in targetObj)) {
            targetObj[key] = obj[key]
        }
    }

    return targetObj
}

// 将对象转为表单请求字符串
function serialize(obj) {
    let str = ''

    each(obj, function (val, key) {
        str += `${key}=${val}&`
    })

    return str && str.slice(0, -1)
}

// 把数据拼接到URL上
function addDataToUrl(data, url) {
    if (data && !isEmptyObj(data)) {
        let str = serialize(data)
        if (url.indexOf('?') === -1) {
            url += '?' + str
        } else {
            url += "&" + str
        }
    }

    return url
}

export {each, extendObj, serialize, addDataToUrl}
export * from './typeUtils'
