<template>
	<div class="login-account">
		<el-form :rules="rules" :model="account" ref="formRef">
			<el-form-item prop="phonenumber">
				<el-input v-model="account.phonenumber" placeholder="请输入手机号码" prefix-icon="el-icon-lock" />
			</el-form-item>
			<el-form-item prop="code" class="phoneCode-wrap">
				<el-input placeholder="请输入验证码" v-model="account.code"> </el-input>
				<el-button class="getCode" type="text" @click="getCode"> {{ countDown <= 0 ? '获取短信验证码' : countDown + 's后获取' }}</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
// import { Session } from '@/utils/storage';
import { getSendMobileCode } from '@/api/login/index';
export default {
	data() {
		return {
			countDown: 0,
			countDownSetInterval: null,
			account: {
				phonenumber: '',
				code: '',
			},
			rules: {
				phonenumber: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
				code: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
			},
		};
	},
	methods: {
		getCode() {
			if (this.countDown > 0) {
				return;
			}
			this.$refs.formRef.validateField('phonenumber', (valid) => {
				if (!valid) {
					getSendMobileCode(this.account.phonenumber).then((res) => {
						this.countDown = 60;
						clearInterval(this.countDownSetInterval);
						this.countDownSetInterval = setInterval(() => {
							if (this.countDown > 0) {
								this.countDown -= 1;
							}
						}, 1000);
						if (res.code === 200) {
							this.$message.success(res.msg);
						} else {
							this.$message.error(res.msg);
						}
					});
				} else {
					return false;
				}
			});
		},

		setIntervalFun() {},

		async phoneAction() {
			this.$refs.formRef.validate(async (valid) => {
				if (valid) {
					// this.submit.loading = true;

					this.$emit('loginEvent', this.account);

					// let res = null;
					// try {
					// 	res = await mobileLogin(this.account);
					// } catch (err) {
					// 	// eslint-disable-next-line no-unused-vars
					// 	res = err;
					// 	// this.submit.loading = false;
					// 	return;
					// }

					// if (res.code === 200) {
					// 	Session.set('token', res.token);
					// 	// 存储用户信息到vuex
					// 	await this.$store.dispatch('userInfos/setUserInfos');
					// 	// 存储路有信息到vuex
					// 	const router = await getRouters();
					// 	console.log(router);
					// }
					// console.log('执行phoneAction');
					// mobileLogin(this.account).then((res) => {
					// 	console.log(res);
					// 	if (res.code === 200) {
					// 		// 存储 token 到浏览器缓存
					// 		Session.set('token', res.token);

					// 	}
					// });
				} else {
					return false;
				}
			});
		},
	},
};
</script>
<style scoped lang="scss">
.phoneCode-wrap {
	position: relative;
	.getCode {
		position: absolute;
		right: 8px;
		width: auto;
	}
}
</style>
