import request from '@/utils/request';

// const BASE_URL = process.env.VUE_APP_BASE_API;

export function commonRequest(url, params) {
	return request({
		url:  url,
		method: 'get',
		data: params,
	});
}
