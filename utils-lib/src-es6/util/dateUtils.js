import {paddingLeft} from './stringUtils'

// fmt eg: 'yyyy-MM-dd hh:mm:ss'
function formate(date, fmt) {
    let matchStr
    let obj = {
        '(M+)': date.getMonth() + 1,
        '(d+)': date.getDay(),
        '(h+)': date.getHours(),
        '(m+)': date.getMinutes(),
        '(s+)': date.getSeconds()
    }

    if (/(y+)/.test(fmt)) {
        matchStr = RegExp.$1
        fmt = fmt.replace(matchStr, String(date.getFullYear()).slice(4 - matchStr.length))
    }

    for (let k in obj) {
        if (new RegExp(k).test(fmt)) {
            matchStr = RegExp.$1
            let val = String(obj[k])
            // 当匹配模式中的M|d|h|m|s为单个的话，则相应的值左边不补零
            val = matchStr.length === 1 ? val : paddingLeft(val, '0', 2)
            fmt = fmt.replace(matchStr, val)
        }
    }

    return fmt
}

export {formate}