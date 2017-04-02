function paddingLeft(str, padStr, totalLen) {
    while (str.length < totalLen) {
        str = padStr + str
    }

    return str.slice(-totalLen)
}

function paddingRight(str, padStr, totalLen) {
    while (str.length < totalLen) {
        str += padStr
    }

    return str.slice(0, totalLen)
}

export {paddingLeft, paddingRight}