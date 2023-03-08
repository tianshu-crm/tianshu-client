import { Session } from '@/utils/storage';

const BASE_URL = process.env.VUE_APP_BASE_API;

// post导出文件
export function fileExportFun (url, fileName, params) {
    function request() {
     
		const req = new XMLHttpRequest();
		req.open('POST', BASE_URL + url, true);
		req.responseType = 'blob'; // 包装返回数据格式, 打印出来是 Blob 格式的数据，不是乱码的文本
		// req.setRequestHeader('Content-Type', 'application/json');
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		req.setRequestHeader('Authorization', Session.get('token'));
		req.onload = function () {
			const data = req.response;
			const blob = new Blob([data]);
			const blobUrl = window.URL.createObjectURL(blob);
			download(blobUrl);
		};
		req.send(params);
	}
	function download(blobUrl) {
		const a = document.createElement('a');
		a.style.display = 'none';
		a.download = fileName;
		a.href = blobUrl;
		a.click();
		// document.body.removeChild(a);
		window.URL.revokeObjectURL(blobUrl);
	}
	request();

}