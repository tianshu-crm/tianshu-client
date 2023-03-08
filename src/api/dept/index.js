import request from '@/utils/request';

// const BASE_URL = process.env.VUE_APP_BASE_API;

//企业管理->员工管理

//  查询部门
export function deptList(params) {
	return request({
		url: `/system/dept/list?pageSize=${params.pageSize}&pageNum=${params.pageNum}&status=${params.status}&deptName=${params.deptName}`,
		method: 'get',
	});
}

export function deptTree() {
	return request({
		url: `/system/role/deptTree`,
		method: 'get',
	});
}

// 新增部门
export function deptAdd(params) {
	return request({
		url: `/system/dept/add`,
		method: 'post',
		data: params,
	});
}


// 编辑部门
export function deptUpdate(params) {
	return request({
		url: `/system/dept/edit`,
		method: 'post',
		data: params,
	});
}


// 部门详情
export function deptDetails(params) {
	return request({
		url: `/system/dept/${params}`,
		method: 'get',
	});
}

//删除
export function deptDel(params) {
	return request({
		url: `/system/dept/${params}`,
		method: 'DELETE',
	});
}


//获取负责人
export function deptUser() {
	return request({
		url: `/system/user/dorpdown`,
		method: 'get',
	});
}