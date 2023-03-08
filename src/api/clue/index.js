import request from '@/utils/request';
import { fileExportFun } from '@/utils/exportFile';

// const BASE_URL = process.env.VUE_APP_BASE_API;

/**
 * 线索api接口集合
 * 待分配
 * @method getCustomerList 待分配列表查询
 * @method customerExport 导出数据
 * @method addCustomer 新增线索
 * @method allotUser 批量分配顾问
 * @method importTemplate 下载导入模板
 * @method importData 导入数据
 * @method getUserList 获取顾问列表
 * @method getCustomerDetail 查看详情
 * @method addCustomerRecord 新增轨迹
 * @method getCustomerTrackList 轨迹列表
 * 待跟进
 * @method getNoFollowList 待跟进列表
 * @method noFollowExport 导出
 * @method transferCustomer 转移
 * @method levelUpdCustomer 调级
 * @method failureCustomer 战败
 * @method customerInfo 线索信息
 * 跟进中
 * @method getFollowingList 列表查询
 * @method followingExport 导出数据
 * @method customerCancel 取消分配
 * @method customerTrackInfo 轨迹详情
 * 线索去重
 * @method repeatList 列表查询
 * @method customerRepeat 替换数据
 * @method customerRepeatDelete 删除数据
 */


//------待分配

// 列表查询
export function getCustomerList(params) {
	return request({
		url: `/crm/customer/list`,
		method: 'get',
		params,
	});
}
// 导出数据
export function customerExport(params) {
	fileExportFun(`/crm/customer/export?&key=${params.key}&level=${params.level}&source=${params.source}&newTime=${params.newTime}&lastTime=${params.lastTime}&businessType=${params.businessType}`, '待分配线索.xlsx');
}
// 新增线索
export function addCustomer(params) {
	return request({
		url: `/crm/customer`,
		method: 'post',
		data: params,
	});
}
// 批量分配顾问
export function allotUser(params) {
	return request({
		url: `/crm/customer/allotUser`,
		method: 'post',
		data: params,
	});
}
// 下载导入模板
export function importTemplate() {
	fileExportFun(`/crm/customer/importTemplate`, '待分配线索导入模板.xlsx');
}
// 导入数据
export function importData(params) {
	return request({
		url: `/crm/customer/importData`,
		method: 'post',
		data: params,
	});
}
// 获取顾问列表
export function getUserList(params) {
	return request({
		url: `/system/user/dorpdown`,
		method: 'get',
		data: params,
	});
}
// 查看详情
export function getCustomerDetail(params) {
	return request({
		url: `/crm/customer/${params}`,
		method: 'get',
	});
}
// 新增轨迹
export function addCustomerRecord(params) {
	return request({
		url: `/crm/customer`,
		method: 'put',
		data: params,
	});
}
// 轨迹列表查询
export function getCustomerTrackList(params) {
	return request({
		url: `/crm/customerTrack/list`,
		method: 'get',
		params,
	});
}

// ------待跟进

// 列表查询
export function getNoFollowList(params) {
	return request({
		url: `/crm/customer/noFollowList`,
		method: 'get',
		params,
	});
}
// 导出数据
export function noFollowExport(params) {
	fileExportFun(`/crm/customer/noFollowList/export?&key=${params.key}&level=${params.level}&source=${params.source}&newTime=${params.newTime}&lastTime=${params.lastTime}&businessType=${params.businessType}`, '待跟进线索.xlsx');
}
// 批量转移顾问
export function transferCustomer(params) {
	return request({
		url: `/crm/customer/transfer`,
		method: 'post',
		data: params,
	});
}
// 调级
export function levelUpdCustomer(params) {
	return request({
		url: `/crm/customer/levelUpd`,
		method: 'post',
		data: params,
	});
}
// 战败
export function failureCustomer(params) {
	return request({
		url: `/crm/customer/failure`,
		method: 'post',
		data: params,
	});
}
// 线索信息
export function customerInfo(params) {
	return request({
		url: `/crm/customer/customerInfo/${params}`,
		method: 'get',
	});
}

//---跟进中

// 列表查询
export function getFollowingList(params) {
	return request({
		url: `/crm/customer/followingList`,
		method: 'get',
		params,
	});
}
// 导出数据
export function followingExport(params) {
	fileExportFun(`/crm/customer/followingLsit/export?&key=${params.key}&level=${params.level}&source=${params.source}&newTime=${params.newTime}&lastTime=${params.lastTime}&businessType=${params.businessType}&userId=${params.userId}`, '跟进中线索.xlsx');
}
// 取消分配
export function customerCancel(params) {
	return request({
		url: `/crm/customer/cancel/${params}`,
		method: 'post',
	});
}
// 轨迹详情
export function customerTrackInfo(params) {
	return request({
		url: `/crm/customer/trackInfo/${params}`,
		method: 'get',
	});
}

//-------线索去重
// 列表查询
export function repeatList(params) {
	return request({
		url: `/crm/customer/repeatList`,
		method: 'get',
		params,
	});
}
// 替换数据
export function customerRepeat(params) {
	return request({
		url: `/crm/customer/repeat/${params}`,
		method: 'put',
	});
}
// 删除数据
export function customerRepeatDelete(params) {
	return request({
		url: `/crm/customer/repeatDelete/${params}`,
		method: 'delete',
	});
}