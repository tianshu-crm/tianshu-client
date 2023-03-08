import request from '@/utils/request';

// const BASE_URL = process.env.VUE_APP_BASE_API;

//企业信息->区域管理

//  获取区域下拉接口
export function selectList(params) {
	return request({
		url: `/system/area/areaname/list`,
		method: 'post',
		data: params,
	});
}

// 区域列表查询接口
export function tableList(params) {
	return request({
		url: `/system/area/area/list`,
		method: 'post',
		data: params,
	});
}

// 添加区域
export function addArea(params) {
	return request({
		url: `/system/area/add/area`,
		method: 'post',
		data: params,
	});
}

// 编辑区域
export function updateArea(params) {
	return request({
		url: `/system/area/update/area`,
		method: 'post',
		data: params,
	});
}

//区域详情
export function forupdate(params) {
	return request({
		url: `/system/area/forupdate/${params}`,
		method: 'get',
	});
}


//  删除
export function deleteArea(params) {
	return request({
		url: `/system/area/delete/${params}`,
		method: 'DELETE',
	});
}

//检查区域名称是否存在
export function isexist(params) {
	return request({
		url: `/system/area/check/isexist`,
		method: 'post',
		data: params,
	});
}
