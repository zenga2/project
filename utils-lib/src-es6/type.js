function getType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

function helper(type) {
    return function (obj) {
        return getType(obj) === type
    }
}

let isArray = Array.isArray || helper('array')
let [isRegExp, isPlainObject, isDate] = ['regexp', 'object', 'date'].map(function (type) {
    return helper(type)
})

function isBoolean(arg) {
    return typeof arg === 'boolean'
}

function isNull(arg) {
    return arg === null
}

function isNullOrUndefined(arg) {
    return arg === null || arg === undefined
}

function isNumber(arg) {
    return typeof arg === 'number'
}

function isString(arg) {
    return typeof arg === 'string'
}

function isSymbol(arg) {
    return typeof arg === 'symbol'
}

function isUndefined(arg) {
    return arg === undefined
}

function isObject(arg) {
    return arg !== null && typeof arg === 'object'
}

function isFunction(arg) {
    return typeof arg === 'function'
}

function isPrimitive(arg) {
    return arg === null ||
        typeof arg !== 'object' && typeof arg !== 'function'
}

// 仅仅判断自有属性,同时如果参数为原始类型的值
function isEmptyObj(obj) {
    if (obj && typeof obj !== 'object') throw Error('Invalid argument: isEmptyObj need a object')

    return Object.key(obj).length === 0
}

export {
    getType,
    isArray,
    isRegExp,
    isPlainObject,
    isDate,
    isBoolean,
    isNull,
    isNullOrUndefined,
    isNumber,
    isString,
    isSymbol,
    isUndefined,
    isObject,
    isFunction,
    isPrimitive,
    isEmptyObj
}