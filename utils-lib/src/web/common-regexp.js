// 常用正则
var ipRegExp = /^(((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}(((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.)$/;
var urlRegExp = /^https?:\/\/[-\w.]+(:\d+)?(\/([\w/#_.]*)?)?$/;
var emailRegExp = /^(\w+\.)*\w+@(\w+\.)+[A-Za-z]+$/;

export {ipRegExp, urlRegExp, emailRegExp}
