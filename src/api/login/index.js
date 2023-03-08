import request from '@/utils/request';

// const BASE_URL = process.env.VUE_APP_BASE_API;

/**
 * 登录api接口集合
 * @method getSendMobileCode 发送短信验证码
 * @method mobileLogin 短信验证码登录
 * @method getRouters 获取路由信息
 * @method quickLogin 快捷登录(用于演示系统的登录)
 */

//  发送短信验证码
export function getSendMobileCode(params) {
	return request({
		url: `/sendMobileCode/${params}`,
		method: 'get',
	});
}

// 短信验证码登录
export function mobileLogin(params) {
	return request({
		url: '/mobileLogin',
		method: 'post',
		data: params,
	});
}

// 快捷登录
export function quickLogin(params) {
	return request({
		url: '/login',
		method: 'post',
		data: params,
	});
}

// 获取路由信息
export function getRouters() {
	return request({
		url: '/getRouters',
		method: 'get',
	});
}

//根据账号密码获取用户手机号
export function getUserMobile(params) {
	return request({
		url: '/getUserMobile',
		method: 'post',
		data: params,
	});
}

// 通过账号获取手机号码
export function getUserPhoneByAccount(params) {
	params = { username: params };
	return request({
		url: `/getUserPhoneByAccount`,
		method: 'get',
		params: params,
	});
}

// 重置密码
export function resetPwd(params) {
	return request({
		url: '/resetPwd',
		method: 'post',
		data: params,
	});
}

// 获取钉钉二维码
export function dingTalkLoginUrl() {
	return request({
		url: '/feishuLoginUrl',
		method: 'get',
	});
}

//个人中心
//重置密码获取验证码
export function changeSendMobileCode() {
	return request({
		url: '/sendMobileCode',
		method: 'get',
	});
}

// 修改密码
export function updatePassWord(params) {
	return request({
		url: '/updPwd',
		method: 'post',
		data: params,
	});
}

// 获取用户信息
export function getUserInfo(params) {
	return request({
		url: '/getInfo',
		method: 'get',
		data: params,
	});
}

// 根据飞书Code获取Token
export function getTokenWithFeishuCode(params) {
	return request({
		url: '/feishuCallback',
		method: 'get',
		params,
	});
}

// 根据钉钉Code获取Token
export function getTokenWithDingdingCode(params) {
	return request({
		url: '/dingTalkCallback',
		method: 'get',
		params,
	});
}

// 根据企业微信Code获取Token
export function getTokenWithQiweiCode(params) {
	return request({
		url: '/wxCallback',
		method: 'get',
		params,
	});
}
