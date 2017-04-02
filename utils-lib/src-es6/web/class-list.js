// polyfill for classList
import {each} from '../util/utils'

let slice = Array.prototype.slice

class ClassList {
    contains(cName) {
        // 检查是否是合法的类名
        cName = String(cName)
        if (!cName || /\s+/.test(cName)) {
            throw new Error(`Invalid class name: ${cName}`)
        }

        let className = this.className
        if (!className) {
            return false
        } else {
            return className.search(new RegExp(`\\b${cName}\\b`)) !== -1
        }
    }

    add() {
        each(slice.call(arguments), cName => {
            if (this.contains(cName)) return

            cName = String(cName)
            if (!this.className) {
                this.className = cName
            } else {
                this.className += ' ' + cName
            }
        })
    }

    remove() {
        each(slice.call(arguments), cName => {
            if (!this.contains(cName)) return

            cName = String(cName)
            let patter = new RegExp(`\\b${cName}\\b\\s*`, 'g')
            this.className.replace(patter, '')
        })
    }

    toggle(cName, force) {
        cName = String(cName)

        let method = this.contains(cName)
            ? force !== true && 'remove'
            : force !== false && 'add'

        if (method) {
            this[method](cName)
        }
    }
}

export {ClassList}
