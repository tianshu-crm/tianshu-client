<template>
	<div class="reset_wrap flex-center h100 pt30">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
			<template v-if="$store.state.forgotPassword.active === 1">
				<el-form-item label="" prop="username" class="username">
					<el-input v-model="ruleForm.username" placeholder="请输入账号"></el-input>
				</el-form-item>
			</template>

			<template v-if="$store.state.forgotPassword.active === 2">
				<el-form-item label="新密码:" prop="oldPass">
					<el-input v-model="ruleForm.oldPass" placeholder="请输入新密码" show-password></el-input>
				</el-form-item>
				<el-form-item label="确认密码:" prop="password">
					<el-input v-model="ruleForm.password" placeholder="输入确认密码" show-password></el-input>
				</el-form-item>
				<el-form-item label="手机:">
					<span>{{ $store.state.forgotPassword.phonenumber }}</span>
				</el-form-item>
				<el-form-item label="验证码:" prop="code" class="phoneCode-wrap">
					<el-input v-model="ruleForm.code" placeholder="请输入短信验证码"> </el-input>
					<el-button class="getCode" type="text" @click="getCode" :disabled="codeDis"> {{ codeText }} </el-button>
				</el-form-item>
			</template>

			<template v-if="$store.state.forgotPassword.active === 3">
				<div style="text-align: center">
					<p class="mt20 font20">重置密码成功！</p>
					<p class="mt20 font20 mb30">{{ countdown }}秒后自动跳转登录页</p>
				</div>
			</template>
			<div clas="save-btn" style="text-align: center">
				<!-- <el-button type="primary" class="login" @click="submitForm('ruleForm')">{{ $store.state.forgotPassword.active | activeFilter }}</el-button> -->
				<el-button type="primary" @click="submitForm('ruleForm')">{{ activeComputed }}</el-button>
			</div>
		</el-form>

		<template v-if="slideShow">
			<slide-verify :slideShow="slideShow" :username="ruleForm.username" @closeSlide="closeSlide" @sildeSuccess="sildeSuccess"></slide-verify>
		</template>
	</div>
</template>

<script>
import slideVerify from './slide-verify.vue';
import { getSendMobileCode, resetPwd } from '@/api/login/index';

export default {
	components: { slideVerify },
	computed: {
		// eslint-disable-next-line vue/return-in-computed-property
		activeComputed() {
			switch (Number(this.$store.state.forgotPassword.active)) {
				case 1:
					return '确定';
				case 2:
					return '确定修改';
				case 3:
					return '前往登录页';
			}
		},
	},
	data() {
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			} else if (value !== this.ruleForm.oldPass) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
				this.codeDis = false;
			}
		};

		return {
			codeDis: true,
			codeText: '获取验证码',
			ruleForm: {
				username: '',
				code: '',
				password: '',
				oldPass: '',
			},
			rules: {
				username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
				oldPass: [{ required: true, message: '请输入', trigger: 'blur' }],
				password: [{ required: true, validator: validatePass2, trigger: 'blur' }],
			},

			slideShow: false,
			countdown: 5,
			timer: null,
		};
	},
	mounted() {
		if (this.$store.state.forgotPassword.active === 3) {
			this.sendCode();
		}
	},
	methods: {
		// $store.state.forgotPassword.active: 1->确认账号  2->重置密码  3->重置成功
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (this.$store.state.forgotPassword.active === 1) {

						this.slideShow = true;

					} else if (this.$store.state.forgotPassword.active === 2) {
						
						this.$set(this.ruleForm, 'phonenumber', this.$store.state.forgotPassword.phonenumber);
						resetPwd(this.ruleForm).then((res) => {
							if (res.code === 200) {
								this.$message.success(res.msg);
								this.$store.dispatch('forgotPassword/setActive', { active: 3 });
							} else {
								this.$message.error(res.msg);
							}
						});
					} else {
						this.goLogin();
					}
				} else {
					return false;
				}
			});
		},
		sildeSuccess() {
			this.slideShow = false;
		},

		closeSlide(val) {
			this.slideShow = val;
		},

		getCode() {
			let phonenumber = this.$store.state.forgotPassword.phonenumber;
			getSendMobileCode(phonenumber).then((res) => {
				if (res.code === 200) {
					this.$message.success(res.msg);

					this.codeText = '60S倒计时';
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		//
		sendCode() {
			this.loading(); //启动定时器
			this.timer = setInterval(() => {
				//创建定时器
				if (this.countdown === 0) {
					this.clearTimer(); //关闭定时器
					this.goLogin();
				} else {
					this.loading();
				}
			}, 1000);
		},
		loading() {
			//启动定时器
			this.countdown--; //定时器减1
		},
		clearTimer() {
			//清除定时器
			clearInterval(this.timer);
			this.timer = null;
		},
		goLogin() {
			this.clearTimer();
			this.$router.push('/login');
		},
	},
};
</script>

<style scoped lang="scss">
.reset_wrap {
	display: flex;
	align-items: center;
}
::v-deep .el-input__inner {
	// height: 60px;
	width: 400px;
	// border-radius: 60px;
}

// ::v-deep .el-button {
// 	width: 200px;
// }

.phoneCode-wrap {
	position: relative;
	::v-deep .el-button--text {
		position: absolute;
		right: 8px;
		width: auto;
	}
}
.username {
	::v-deep .el-form-item__content {
		margin-left: 0px !important;
	}
}

::v-deep .el-button--primary {
	width: 179px !important;
	height: 32px;
	background: #448df8 !important;
	border-radius: 16px;
	padding: 0;
}
</style>
