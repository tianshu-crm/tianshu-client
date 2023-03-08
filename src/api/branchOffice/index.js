import request from '@/utils/request';

// const BASE_URL = process.env.VUE_APP_BASE_API;

//  查询分公司列表
export function filialeList(params) {
	return request({
		url: `/system/filiale/query/filialelist`,
		method: 'post',
		data: params,
	});
}

// 新增分公司
export function filialeAdd(params) {
	return request({
		url: `/system/filiale/add/filialelist`,
		method: 'post',
		data: params,
	});
}

// 分公司信息编辑提交
export function filialeUpdate(params) {
	return request({
		url: `/system/filiale/update/filialelist`,
		method: 'post',
		data: params,
	});
}

// 分公司删除
export function filialeDel(params) {
	return request({
		url: `/system/filiale/delete/${params}`,
		method: 'post',
	});
}

// 查询分公司详情
export function filialeDetails(params) {
	return request({
		url: `/system/filiale/${params}`,
		method: 'get',
	});
}


//获取省市组合数据
export function cityInfo() {
	return request({
		url: `/common/city/info`,
		method: 'get',
	});
}