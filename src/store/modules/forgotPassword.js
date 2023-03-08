const forgotPassword = {
	namespaced: true,
	state: {
		active: 1,
		phonenumber: '',
	},
	mutations: {
		updateActive(state, data) {
			state.active = data.active;
		},
		updatePhoneNum(state, data) {
			state.phonenumber = data.phonenumber;
		},
	},
	actions: {
		setActive({ commit }, data) {
			commit('updateActive', data);
		},
		setPhoneNum({ commit }, data) {
			commit('updatePhoneNum', data);
		},
	},
};

export default forgotPassword;
