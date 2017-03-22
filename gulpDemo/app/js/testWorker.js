/**
 * Created by ZENG on 2017/1/15.
 */
console.log("this is worker");
console.log(typeof window);
console.log(importScripts);
postMessage("sdgsgsg");
var stack;
try{
    var up = new Error();
    throw up;
} catch(e){
    console.log(e)
    stack = e.stack.split("\n");
}

console.log(+new Date);