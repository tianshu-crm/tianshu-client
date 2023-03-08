import request from '@/utils/request';

// const BASE_URL = process.env.VUE_APP_BASE_API;

//企业管理-> 角色管理

//  查询角色列表
export function roleList(params) {
	return request({
		url: `/system/role/list?pageSize=${params.pageSize}&pageNum=${params.pageNum}&roleName=${params.roleName}&status=${params.status}`,
		method: 'get',
	});
}

//启用/停用角色
export function changeStatus(params) {
	return request({
		url: `/system/role/changeStatus`,
		method: 'put',
		data: params,
	});
}

//删除角色
export function delectRole(params) {
	return request({
		url: `/system/role/${params}`,
		method: 'DELETE',
	});
}

//新增-编辑角色

//功能权限树列表
export function treeselect() {
	return request({
		url: `/system/menu/treeselect`,
		method: 'get',
	});
}

//数据权限树列表
export function deptTree() {
	return request({
		url: `/system/role/deptTree`,
		method: 'get',
	});
}

//查询权限范围下拉
export function roleSelect(params) {
	return request({
		url: `/system/dict/data//type/${params}`,
		method: 'get',
	});
}

// 新增角色
export function add(params) {
	return request({
		url: `/system/role/add`,
		method: 'post',
		data: params,
	});
}

// 根据角色编号获取详细信息
export function details(params) {
	return request({
		url: `/system/role/query/${params}`,
		method: 'get',
	});
}

// 修改角色
export function update(params) {
	return request({
		url: `/system/role/update`,
		method: 'PUT',
		data: params,
	});
}