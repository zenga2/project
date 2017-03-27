var chalk = require('chalk')
var dateUtils = require('../dist/src-es6/date')

var dateStr1 = dateUtils.formate(new Date, 'yyyy-MM-dd hh:mm:ss')
var test1 = /^\d{4}(-\d{2}){2}[ ]\d{2}(:\d{2}){2}$/.test(dateStr1)

var dateStr2 = dateUtils.formate(new Date, 'yyy-dd hh:mm')
var test2 = /^\d{3}-\d{2}[ ]\d{2}:\d{2}$/.test(dateStr2)

if (test1 && test2) {
    console.log(chalk.green('formate function in date.js passed test!'))
} else {
    console.error(chalk.red('formate function in date.js not passed test!'))
}

console.log(dateStr1, test1, ' | ', dateStr2, test2)
