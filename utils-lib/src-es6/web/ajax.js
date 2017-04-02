import {each, isEmptyObj} from '../utils'

// 只能进行异步处理（这是出于简单化的考虑，只实现最常用的功能）
class Ajax {
    constructor() {
        this.xhr = new XMLHttpRequest()
        this.defaultOpt = {
            timeout: '4000',
            uploadType: 'default'
        }
        this.contentTypes = {
            default: 'application/x-www-form-urlencoded;charset=UTF-8',
            text: 'text/plain;charset=UTF-8'
        }
    }

    initAjax(method, url, option) {
        let {xhr, defaultOpt, contentTypes} = this
        option = Object.assign({}, option, defaultOpt)

        xhr.open(method, url, true)
        xhr.setHeader('Content-Type', contentTypes[option.uploadType])
        xhr.send(option.data)

        return new Promise(function (resolve, reject) {
            let isTimeout = false

            // 处理超时
            setTimeout(() => {
                xhr.abort && xhr.abort()

                isTimeout = true
                reject({errorType: "timeoutError", "desc": ""})
            }, option.timeout)

            xhr.onreadystatechange = function () {
                if (isTimeout) return

                if (xhr.readyState === 4) {
                    handle()
                }
            }
            function handle() {
                if (xhr.status >= 200 || xhr.status < 300) {
                    try {
                        let data = JSON.parse(xhr.responseText)
                        resolve(data)
                    } catch (e) {
                        reject({errorType: 'dataError', desc: "Not json"})
                    }
                } else {
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

    get(url, data, option) {
        if (data && !isEmptyObj(data)) {
            let str = serialize(data)
            if (url.indexOf('?') === -1) {
                url += '?' + str
            } else {
                url += "&" + str
            }
        }

        return this.initAjax('GET', url, option)
    }

    post(url, data, option) {
        option.data = option.uploadType === 'text' ? data : serialize(data)

        return this.initAjax('POST', url, option)
    }
}

// 将对象转为表单请求字符串
function serialize(obj) {
    let str = ''
    each(obj, function (val, key) {
        str += `${key}=${val}&`
    })
    return str && str.slice(0, -1)
}
