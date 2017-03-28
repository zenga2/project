/* eslint-disable */

function detect(ua, platform) {
    var os = {}, // jshint ignore:line
        browser = {}, // jshint ignore:line
        webkit = ua.match(/Web[kK]it[\/]?([\d.]+)/),
        android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
        osx = !!ua.match(/\(Macintosh; Intel /),
        ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
        iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        win = /Win\d{2}|Windows/.test(platform),
        wp = ua.match(/Windows Phone ([\d.]+)/),
        chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
        firefox = ua.match(/Firefox\/([\d.]+)/),
        ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^?]+).*rv:([0-9.].)/),
        webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
        safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);

    if (browser.webkit = !!webkit) browser.version = webkit[1];

    if (android) os.android = true, os.version = android[2];
    if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');
    if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
    if (wp) os.wp = true, os.version = wp[1];
    if (win) os.windows = true;
    if (chrome) browser.chrome = true, browser.version = chrome[1];
    if (firefox) browser.firefox = true, browser.version = firefox[1];
    if (ie) browser.ie = true, browser.version = ie[1];
    if (safari && (osx || os.ios || win)) {
        browser.safari = true;
        if (!os.ios) browser.version = safari[1];
    }
    if (webview) browser.webview = true;

    return {os: os, browser: browser};
}

module.exports = detect(navigator.userAgent, navigator.platform);
