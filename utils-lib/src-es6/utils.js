import {isArray} from './type'
import type from './type'

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

export {each}
export * from './type'
export default Object.assign({each}, type)
