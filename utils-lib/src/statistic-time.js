// 统计代码执行时间
// todo 计算average time（多次取平均值）
function executeTime(fn, n) {
    var startTime = +(new Date);
    var totalTime;
    var i = 0;
    for (; i < n; i++) {
        fn();
    }
    totalTime = +(new Date) - startTime;
    console.log("Total time: " + totalTime + "ms");
    return totalTime;
}

export {executeTime}
