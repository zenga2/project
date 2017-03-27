function getType(obj) {
    return Object.prototype.toString.call(obj).slice(7).toLowerCase()
}

function helper(type) {
    return function (obj) {
        return getType(obj) === type
    }
}

let [isPlainObject, isNull] = ['object', 'null'].map(function (type) {
    return helper(type)
})

function isUndefined(obj) {
    return typeof obj === 'undefined'
}

function isNumber(obj) {
    return typeof obj === 'number'
}

let isArray = Array.isArray || function (obj) {
        return getType('obj') === 'array'
    }

function each(obj, fn) {
    if (!obj) return

    if (isArray) {
        for (let i = 0, len = obj.length; i < len; i++) {
            if (fn.call(obj, obj[i], i) === false) return
        }
    } else {
        for (let k in obj) {
            if (fn.call(obj, obj[k], k) === false) return
        }
    }
}

export {getType, isPlainObject, isNull, isUndefined, isArray, isNumber, each}
export default {getType, isPlainObject, isNull, isUndefined, isArray, isNumber, each}
