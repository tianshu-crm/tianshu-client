import request from '@/utils/request';

// const BASE_URL = process.env.VUE_APP_BASE_API;
//系统管理->任务管理


// 获取任务列表
export function taskList(params) {
	return request({
		url: `/system/task/tasklist`,
		method: 'post',
		data: params,
	});
}

//获取tab切换卡片状态
export function tabs() {
	return request({
		url: `/system/dict/data/type/crm_task_type`,
		method: 'get',
	});
}

//获取任务详情
export function taskdetail(params) {
	return request({
		url: `/system/task/taskdetail/${params}`,
		method: 'get',
	});
}

//审批
export function audit(params) {
	return request({
		url: `/crm/customer/audit`,
		method: 'post',
		data: params,
	});
}