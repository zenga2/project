import {addDataToUrl} from '../util/utils'

class Jsonp {
    constructor() {
        this.count = 0
        this.fnName = 'func0'
        this.defaultOpt = {
            timeout: 4000
        }
        window.__jsonp__ = this
    }

    increment() {
        this.count++
        this.fnName = 'func' + this.count
    }

    get(url, data, option) {
        option = Object.assign({}, option, this.defaultOpt)

        function clean() {
            option.finishedFn && option.finishedFn()
        }

        return new Promise((resolve, reject) => {
            let fnName = this.fnName;
            let el = document.createElement('script')
            let isTimeout = false

            // 处理超时
            setTimeout(() => {
                isTimeout = true
                reject({errorType: "timeoutError", "desc": ""})
                clean()
            }, option.timeout)

            data = data || {}
            data.jsonp = '__jsonp__.' + fnName
            url = addDataToUrl(data, url)
            this.increment()

            this[fnName] = function (response) {
                if (isTimeout) return

                try {
                    resolve(response)
                } finally {
                    clean()
                    delete this[fnName]
                    el.parentNode.removeChild(el)
                }
            }


            el.src = url
            el.onerror = function (event) {
                reject({errorType: "unknowError", "desc": "", event})
                clean()
            }
            option.beforeSendFn && option.beforeSendFn()
            document.head.appendChild(el)
        })
    }

    beforeSend(fn) {
        this.defaultOpt.beforeSendFn = fn
    }

    finished(fn) {
        this.defaultOpt.finishedFn = fn
    }
}