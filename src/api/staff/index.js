import request from '@/utils/request';

// const BASE_URL = process.env.VUE_APP_BASE_API;

//企业信息->员工管理

//  获取区域下拉接口
export function userList(params) {
	return request({
		url: `/system/user/query/list`,
		method: 'post',
		data: params,
	});
}

// 重置密码
export function updatePwd(params) {
	return request({
		url: `/system/user/resetPwd`,
		method: 'put',
		data: params,
	});
}

//停用
export function putDeactivate(params) {
	return request({
		url: `/system/user/status/${params.userId}/${params.status}`,
		method: 'post',
		data: params,
	});
}

//员工删除
export function delectUser(params) {
	return request({
		url: `/system/user/delete/user`,
		method: 'post',
		data: params,
	});
}

// 员工详情
export function userDetail(params) {
	return request({
		url: `/system/user/detail/${params}`,
		method: 'get',
	});
}

// 账号生成
export function generateAccount(params) {
	return request({
		url: `/system/user/made/username`,
		method: 'post',
		data: params,
	});
}

// 获取部门树
export function deptTree() {
	return request({
		url: `/system/role/deptTree`,
		method: 'get',
	});
}

// 获取角色
export function rolelist() {
	return request({
		url: `/system/user/role/dropdown`,
		method: 'get',
	});
}

// 添加员工
export function addUser(params) {
	return request({
		url: `/system/user/add/user`,
		method: 'post',
		data: params,
	});
}

//编辑员工
export function updateUser(params) {
	return request({
		url: `/system/user/update/user`,
		method: 'post',
		data: params,
	});
}

//获取证件类型与性别字典
export function types(params) {
	return request({
		url: `/system/dict/data/types/${params}`,
		method: 'get',
	});
}
