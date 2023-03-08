import { Session } from '@/utils/storage.js';
import { getUserInfo } from '@/api/login/index.js'

const userInfosModule = {
	namespaced: true,
	state: {
		userInfos: Session.get('userInfo') || {},
		permissions: Session.get('permissions') || [],
	},
	mutations: {
		// 设置用户信息
		getUserInfos(state, user) {
			state.userInfos = user;
			Session.set('userInfo', user);
		},
		// 设置用户权限
		getPermissions(state, permissions) {
			state.permissions = permissions;
			Session.set('permissions', permissions);
		},
	},
	actions: {
		// 设置用户信息
		async setUserInfos({ commit }) {
			const data = await getUserInfo();
			if (data) {
				commit('getUserInfos', data.user);
				commit('getPermissions', data.permissions);
			}
		},
	},
};

export default userInfosModule;
