// 这个是深拷贝方法
export function deepCopy(data) {
    var type = dataType(data);
    var obj;
    if (type === "array") {
        obj = [];
    } else if (type === "object") {
        obj = {};
    } else {
        //不再具有下一层次
        return data;
    }
    if (type === "array") {
        for (var i = 0, len = data.length; i < len; i++) {
            obj.push(deepCopy(data[i]));
        }
    } else if (type === "object") {
        for (var key in data) {
            obj[key] = deepCopy(data[key]);
        }
    }
    return obj;
}

export function dataType(obj) {
    var toString = Object.prototype.toString;
    var map = {
        "[object Boolean]": "boolean",
        "[object Number]": "number",
        "[object String]": "string",
        "[object Function]": "function",
        "[object Array]": "array",
        "[object Date]": "date",
        "[object RegExp]": "regExp",
        "[object Undefined]": "undefined",
        "[object Null]": "null",
        "[object Object]": "object",
    };
    if (obj instanceof Element) {
        return "element";
    }
    return map[toString.call(obj)];
}

// 日期格式化
export function formatDate(time, type) {
    let date = new Date(time);

    let year = date.getFullYear();
    let mounth =
        date.getMonth() + 1 < 10 ?
        "0" + (date.getMonth() + 1) :
        date.getMonth() + 1;
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    // console.log('year',year,time)
    let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    if (type == "yyyy-MM-dd") {
        return `${year}-${mounth}-${day}`;
    }
    // return `${year}-${mounth}-${day} ${h}:${m}:${s}`;
    return `${year}-${mounth}-${day}`;
}

// 上传
export function uploadFile(file, params) {
    return new Promise((resolve, reject) => {
        try {
            if (file == null) return;
            const url = "https://edu.siwonet.com:9090/fileUpload";
            var fd = new window.FormData();
            fd.append("fileType", "category");
            fd.append("file", file);
            if (params) {
                Object.keys(params).forEach((key) => fd.append(key, params[key]));
            }
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.send(fd);
            xhr.onerror = (e) => {
                reject(e);
            };
            xhr.onload = () => {
                if (xhr.status === 200) {
                    var res = JSON.parse(xhr.responseText);
                    resolve(res);
                }
            };
        } catch (error) {
            console.error("upload file err:", error);
        }
    });
}


// 下载
export function download(fileName, vp_img_base64) {
    const imgUrl = vp_img_base64;
    // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片
    if (window.navigator.msSaveOrOpenBlob) {
        var bstr = atob(imgUrl.split(',')[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        var blob = new Blob([u8arr]);
        window.navigator.msSaveOrOpenBlob(blob, fileName + '.' + 'png');
    } else {
        // 这里就按照chrome等新版浏览器来处理
        const a = document.createElement('a');
        a.href = imgUrl;
        a.setAttribute('download', fileName);
        a.click();
    }
}

  // 数字转中文（处理一百以内的数字）
export function numberToChinese(val) {
    let chin = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
    if (val <= 10) {
      return chin[val - 1]
    } else if (val <= 100) {
      if (val < 20) {
        return '十' + chin[(val % 10) - 1]
      } else if (val % 10 === 0) {
        return chin[Math.floor(val / 10) - 1] + '十'
      } else {
        return chin[Math.floor(val / 10) - 1] + '十' + chin[(val % 10) - 1]
      }
    }
}


/**
 * base64转file
 * dataurl: base64
 * filename: 设置文件名称
*/
export const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {
      type: mime
    });
  }