require('babel-polyfill');
// import fs from "fs";

async function test(){
    await new Promise(function (resolve, reject) {
        setTimeout(function () {
        	console.log("er");
            resolve("hello");
        }, 500);
    })
}

test().then(function (data) {
	console.log("www");
    console.log(data);
});
