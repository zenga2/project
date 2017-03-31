// 将图片转为base64
// <input type="file"  id="picFile" onchange="readFile(this)" />
function readFile(obj) {
    var reader;
    var file = obj.files[0];

    //判断类型是不是图片
    if (!/image\/\w+/.test(file.type)) {
        alert("请确保文件为图像类型");
        return false;
    }
    reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        alert(this.result); //就是base64
    }
}

export {readFile
}