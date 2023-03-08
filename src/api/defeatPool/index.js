import request from '@/utils/request';
import { fileExportFun } from '@/utils/exportFile';

// const BASE_URL = process.env.VUE_APP_BASE_API;

/**
 * 战败池api接口集合
 * @method failureList 列表查询
 * @method customerFailureExport 导出数据
 * @method customerFailureDetail 查看
 * @method customerActivate 激活
 * @method customerActivateAll 激活线索
 */


// 列表查询
export function failureList(params) {
	return request({
		url: `/crm/customer/failureList`,
		method: 'get',
		params,
	});
}
// 导出数据
export function customerFailureExport(params) {
	fileExportFun(`/crm/customer/failureExport?&key=${params.key}&intentionCarSeries=${params.intentionCarSeries}&failureTime=${params.failureTime}&userId=${params.userId}&reason=${params.reason}`, '战败池.xlsx');
}
// 查看
export function customerFailureDetail(params) {
	return request({
		url: `/crm/customer/failure/${params}`,
		method: 'get',
	});
}
// 激活
export function customerActivate(params) {
	return request({
		url: `/crm/customer/activate`,
		method: 'post',
		data: params,
	});
}
// 激活线索
export function customerActivateAll(params) {
	return request({
		url: `/crm/customer/activateAll`,
		method: 'post',
		data: params,
	});
}
