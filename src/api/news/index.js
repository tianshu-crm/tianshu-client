import request from '@/utils/request';

// const BASE_URL = process.env.VUE_APP_BASE_API;

/**
 * 消息中心api接口集合
 * @method getMessageList 列表查询
 * @method deleteMessage 已读消息删除
 * @method messageType 数据字典-消息分类
 * @method readMessage 未读改为已读
 * @method windowlist 获取窗口消息列表
 * @method readAllMessage 全部已读
 */

export function getMessageList(params) {
	return request({
		url: `/message/v1/list`,
		method: 'post',
		data: params,
	});
}
 
export function deleteMessage(params) {
	return request({
		url: `/message/v1/read/delete`,
		method: 'post',
		data: params,
	});
}

export function dataDictionary(params) {
	return request({
		url: `/system/dict/data/type/${params}`,
		method: 'get',
		data: params,
	});
}

export function readMessage(params) {
	return request({
		url: `/message/v1/read/${params}`,
		method: 'post',
		data: params,
	});
}
export function windowlist(params) {
	return request({
		url: `/message/v1/notice/windowlist/${params}`,
		method: 'get',
		data: params,
	});
}
export function readAllMessage(params) {
	return request({
		url: `/message/v1/readall/${params}`,
		method: 'post',
	});
}