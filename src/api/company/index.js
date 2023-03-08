import request from '@/utils/request';

// const BASE_URL = process.env.VUE_APP_BASE_API;

//  查询公司列表
export function companyList(params) {
	return request({
		url: `/system/company/query/companylist`,
		method: 'post',
		data: params,
	});
}

// 新增公司管理
export function companyAdd(params) {
	return request({
		url: `/system/company/add/companyinfo`,
		method: 'post',
		data: params,
	});
}

// 公司信息编辑提交
export function companyUpdate(params) {
	return request({
		url: `/system/company/update/companyinfo`,
		method: 'post',
		data: params,
	});
}

// 公司信息删除
export function companyDel(params) {
	return request({
		url: `/system/company/delete/${params}`,
		method: 'post',
	});
}

// 查询公司详情
export function companyDetails(params) {
	return request({
		url: `/system/company/${params}`,
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