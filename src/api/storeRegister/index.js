import request from '@/utils/request';
import { fileExportFun } from '@/utils/exportFile';

// const BASE_URL = process.env.VUE_APP_BASE_API;

/**
 * 来店登记api接口集合
 * @method customerRegisterList 列表查询
 * @method customerRegisterExport 导出数据
 * @method customerRegisterDetail 查看
 * @method addCustomerRegister 新增来店
 * @method saveCustomerRegister 修改
 * @method deleteCustomerRegister 删除
 * @method importTemplateCustomerRegister 下载导入模板
 * @method importDataCustomerRegister 导入数据
 * @method customerByPhone 获取线索信息
 */


// 列表查询
export function customerRegisterList(params) {
	return request({
		url: `/crm/customerRegister/list`,
		method: 'get',
		params,
	});
}
// 导出数据
export function customerRegisterExport(params) {
	fileExportFun(`/crm/customerRegister/export?&key=${params.key}&startTime=${params.startTime}&userId=${params.userId}&isCustomer=${params.isCustomer}&isTrialrun=${params.isTrialrun}`, '来店登记.xlsx');
}
// 查看
export function customerRegisterDetail(params) {
	return request({
		url: `/crm/customerRegister/${params}`,
		method: 'get',
	});
}
// 新增来店
export function addCustomerRegister(params) {
	return request({
		url: `/crm/customerRegister`,
		method: 'post',
		data: params,
	});
}
// 修改
export function saveCustomerRegister(params) {
	return request({
		url: `/crm/customerRegister`,
		method: 'put',
		data: params,
	});
}
// 删除
export function deleteCustomerRegister(params) {
	return request({
		url: `/crm/customerRegister/${params}`,
		method: 'delete',
	});
}
// 下载导入模板
export function importTemplateCustomerRegister() {
	fileExportFun(`/crm/customerRegister/importTemplate`, '来店登记导入模板.xlsx');
}
// 导入数据
export function importDataCustomerRegister(params) {
	return request({
		url: `/crm/customerRegister/importData`,
		method: 'post',
		data: params,
	});
}
// 获取线索信息
export function customerByPhone(params) {
	return request({
		url: `/crm/customerRegister/customerByPhone/${params}`,
		method: 'get',
	});
}