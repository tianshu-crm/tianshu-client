<template>
	<div class="login">
		<el-image class="login-bg" src="https://weilango.oss-cn-beijing.aliyuncs.com/icon/loginPic.png" fit="cover"></el-image>
		<div class="login-weaper">
			<div class="login-right">
				<div class="login-main">
					<h4 class="login-title font20">天枢易销CRM</h4>
					<el-tabs v-model="currentTab" stretch>
						<el-tab-pane name="account">
							<template #label>
								<span><i class="el-icon-user-solid"></i> 账号登录</span>
							</template>
							<login-account ref="accountRef" @loginEvent="loginEvent" />
						</el-tab-pane>
						<el-tab-pane name="phone">
							<template #label>
								<span><i class="el-icon-mobile-phone"></i> 验证码</span>
							</template>
							<login-phone ref="phoneRef" @loginEvent="loginEvent" />
						</el-tab-pane>
					</el-tabs>

					<div class="account-control" v-if="currentTab === 'account'">
						<el-checkbox v-model="isKeepPassword">记住密码</el-checkbox>
						<el-link type="primary" @click="forgotPassword">忘记密码</el-link>
					</div>

					<el-button :loading="loginLoading" type="primary" class="login-btn mt30" @click="handleLoginClick">立即登录</el-button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import LoginAccount from './cpns/login-account.vue';
import LoginPhone from './cpns/login-phone.vue';
import { mobileLogin, getRouters } from '@/api/login/index';
import { Session } from '@/utils/storage';
export default {
	components: {
		LoginAccount,
		LoginPhone,
	},
	data() {
		return {
			currentTab: 'account',
			isKeepPassword: false,
			loginLoading: false,
		};
	},
	created() {
		if (Session.get('loginAccountInfo')) {
			this.isKeepPassword = true;
		}
	},
	methods: {
		handleLoginClick() {
			//账号密码登录
			if (this.currentTab === 'account') {
				this.$refs.accountRef.loginAction(this.isKeepPassword);
			} else {
				//走手机号码登录
				this.$refs.phoneRef.phoneAction(this.isKeepPassword);
			}
		},

		async loginEvent(data) {
			let res = null;
			if (this.isKeepPassword) {
				let dataJson = JSON.parse(JSON.stringify(data));
				dataJson.code = '';
				Session.set('loginAccountInfo', dataJson);
			} else {
				Session.remove('loginAccountInfo');
			}
			try {
				this.loginLoading = true;
				res = await mobileLogin(data);
			} catch (err) {
				// eslint-disable-next-line no-unused-vars
				res = err;
				// this.submit.loading = false;
				return;
			}
			this.loginLoading = false;
			if (res.code === 200) {
				Session.set('token', res.token);
				// 存储用户信息到vuex
				await this.$store.dispatch('userInfos/setUserInfos');
				// 存储路由信息到vuex
				const router = await getRouters();
				if (router.code == 200) {
					this.routerHandler(router.data);
					Session.set('routers', router.data);
					window.location.href = `${window.location.origin}${window.location.pathname}`;
				}
			} else {
				this.$message.error(res.msg);
			}
		},

		routerHandler(res) {
			res.forEach((item) => {
				if (item.children) {
					item.redirect = item.path;
					this.routerHandler(item.children);
				}
				if (item.component == 'Layout') {
					item.component = 'layout/routerView/parent';
				}
				if (item.path.indexOf('/') !== 0) {
					item.path = '/' + item.path;
				}
				if (item.component.indexOf('/') == 0) {
					item.component = item.component.substr(1);
				}
			});
		},

		forgotPassword() {
			this.$router.push('/forgotPassword');
		},
	},
};
</script>
<style lang="scss" scoped>
.login {
	height: 100%;
	width: 100%;
	overflow: hidden;
	display: flex;
	position: relative;
	.login-bg {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
	}
	.login-weaper {
		margin: auto;
		width: 480px;
		padding: 64px;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
		border: none;
		box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.18);
		background-color: #fff;
		border-radius: 8px;
		.login-title {
			margin: 15px;
			text-align: center;
		}
		.account-control {
			margin-top: 10px;
			display: flex;
			justify-content: space-between;
		}
		.login-btn {
			margin-top: 10px;
			width: 100%;
			height: 32px;
			background: #448df8 !important;
			border-radius: 16px;
			padding: 0px;
		}
	}
}
::v-deep .el-tabs__nav-wrap::after {
	height: 0px;
}

::v-deep .el-tabs__active-bar {
	background-color: transparent !important;
}

::v-deep .el-tabs__item.is-active {
	color: #448df8 !important;
	// font-size: 18px;
}
::v-deep .el-tabs__item {
	color: #909399 !important;
	// font-size: 18px;
}
</style>
