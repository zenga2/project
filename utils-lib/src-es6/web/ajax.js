class Ajax {
    constructor() {
        this.xhr = new XMLHttpRequest()
    }
    initAjax(method, url){
        xhr.open(method, url, true)
        xhr.setHeader('')
    }
    get(url) {}
    post(url, data) {}
}
