import {serialize, addDataToUrl} from '../util/utils'

// 只能进行异步处理（这是出于简单化的考虑，只实现最常用的功能）
class Ajax {
    constructor() {
        this.xhr = new XMLHttpRequest()
        this.defaultOpt = {
            timeout: 4000,
            uploadType: 'default'
        }
        this.contentTypes = {
            default: 'application/x-www-form-urlencoded;charset=UTF-8',
            text: 'text/plain;charset=UTF-8'
        }
    }

    initAjax(method, url, option) {
        function clean() {
            option.ajaxCompleteFn && option.ajaxCompleteFn()
        }

        return new Promise((resolve, reject) => {
            let {xhr, contentTypes} = this
            option = Object.assign({}, option, this.defaultOpt)
            let isTimeout = false

            option.ajaxStartFn && option.ajaxStartFn()

            xhr.open(method, url, true)
            xhr.setRequestHeader('Content-Type', contentTypes[option.uploadType])
            xhr.send(option.data)

            // 处理超时
            setTimeout(() => {
                xhr.abort()

                isTimeout = true
                reject({errorType: "timeoutError", "desc": ""})
            }, option.timeout)

            xhr.onabort = function () {
                clean()
            }

            xhr.onreadystatechange = function () {
                console.log(`status555: ${xhr.status}--${xhr.statusText}---readyState:${xhr.readyState}`)
                if (isTimeout) return

                if (xhr.readyState === 4) {
                    handle()
                    clean()
                }
            }

            function handle() {
                console.log(`status0: ${xhr.status}`)
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log(`status1: ${xhr.status}`)
                    try {
                        let response = JSON.parse(xhr.responseText)
                        resolve(response)
                    } catch (e) {
                        reject({errorType: 'dataError', desc: "Not json"})
                    }
                } else {
                    console.log(`status2: ${xhr.status}`)
                    reject({
                        errorType: 'networkError',
                        desc: "",
                        status: xhr.status,
                        statusText: xhr.statusText
                    })
                }
            }
        })
    }

    get(url, data, option = {}) {
        url = addDataToUrl(data, url)

        return this.initAjax('GET', url, option)
    }

    post(url, data, option = {}) {
        option.data = option.uploadType === 'text' ? data : serialize(data)

        return this.initAjax('POST', url, option)
    }

    ajaxStart(fn) {
        this.defaultOpt.ajaxStartFn = fn
    }

    ajaxComplete(fn) {
        this.defaultOpt.ajaxCompleteFn = fn
    }
}

export {Ajax}
