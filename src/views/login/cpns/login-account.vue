<template>
	<div class="login-account">
		<el-form :rules="rules" :model="account" ref="formRef">
			<el-form-item prop="username">
				<el-input v-model="account.username" placeholder="请输入账号" prefix-icon="el-icon-user" />
			</el-form-item>
			<el-form-item prop="password">
				<el-input
					v-model.trim="account.password"
					show-password
					placeholder="请输入密码"
					@blur="onInputBlur"
					prefix-icon="el-icon-lock"
				/>
			</el-form-item>
			<el-form-item prop="code" class="phoneCode-wrap">
				<el-input placeholder="请输入验证码" v-model="account.code"> </el-input>
				<el-button class="getCode" type="text" @click="getCode"> {{ countDown <= 0 ? '获取短信验证码' : countDown + 's后获取' }}</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import { getUserMobile, getSendMobileCode } from '@/api/login/index';
import { Session } from '@/utils/storage';
export default {
	watch: {
		'account.password': {
			handler: function (newVal, oldVal) {
			},
		},
	},
	data() {
		return {
			mobile: '',
			account: {
				username: '',
				password: '',
				code: '',
			},
			rules: {
				username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
				code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
			},
			countDown: 0,
			countDownSetInterval: null,
			readonly: false,
			isIdentical: null,
		};
	},
	created() {
		let loginAccountInfo = Session.get("loginAccountInfo");
		if (loginAccountInfo) {
			this.account = Session.get("loginAccountInfo");
			this.mobile = this.account.phonenumber;
		}
	},
	methods: {
		onInputBlur() {
			this.$refs.formRef.validateField('username', (valid) => {
				if (!valid && this.account.password.length > 0 && this.isIdentical != this.account.password)  {
					this.isIdentical = this.account.password;
					getUserMobile(this.account).then((res) => {
						if (res.code === 200) {
							this.account.phonenumber = res.mobile;
							this.mobile = res.mobile;
						} else {
							this.$message.error(res.msg);
						}
					});
				} else {
					return false;
				}
			});
		},
		getCode() {
			if (this.countDown > 0) {
				this.readonly = false;
				return;
			}

			//根据用户账号与密码没有拿到手机号码返回处理
			if (!this.mobile.length) {
				return this.$message.warning('请输入正确的账户名和密码！');
			}

			let validateFieldList = [];
			this.$refs.formRef.validateField(['username', 'password'], (valid) => {
				if (!valid) {
					validateFieldList.push(valid);
					if (validateFieldList.length == 2 && validateFieldList.every((item) => item === '')) {
						getSendMobileCode(this.mobile).then((res) => {
							this.readonly = true;
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
				} else {
					return false;
				}
			});
		},

		async loginAction() {
			this.$refs.formRef.validate(async (valid) => {
				if (valid) {
					this.$emit('loginEvent', this.account);
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
