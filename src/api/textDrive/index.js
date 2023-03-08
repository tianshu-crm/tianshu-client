import request from '@/utils/request';
import { fileExportFun } from '@/utils/exportFile';

// const BASE_URL = process.env.VUE_APP_BASE_API;

/**
 * 试乘试驾api接口集合
 * @method customerTrialrunList 列表查询
 * @method customerTrialrunExport 导出数据
 * @method customerTrialrunDetail 查看
 * @method addCustomerTrialrun 新增
 * @method editCustomerTrialrun 重新预约
 */


// 列表查询
export function customerTrialrunList(params) {
	return request({
		url: `/crm/customerTrialrun/list`,
		method: 'get',
		params,
	});
}
// 导出数据
export function customerTrialrunExport(params) {
	fileExportFun(`/crm/customerTrialrun/export?&key=${params.key}&trialrunTime=${params.trialrunTime}&createTime=${params.createTime}&type=${params.type}&status=${params.status}&trialrunCarType=${params.trialrunCarType}&trialrunCarSeries=${params.trialrunCarSeries}`, '试乘试驾.xlsx');
}
// 查看
export function customerTrialrunDetail(params) {
	return request({
		url: `/crm/customerTrialrun/${params}`,
		method: 'get',
	});
}
// 新增
export function addCustomerTrialrun(params) {
	return request({
		url: `/crm/customerTrialrun`,
		method: 'post',
		data: params,
	});
}
// 重新预约
export function editCustomerTrialrun(params) {
	return request({
		url: `/crm/customerTrialrun`,
		method: 'put',
		data: params,
	});
}
