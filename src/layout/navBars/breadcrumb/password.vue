<template>
	<el-dialog
		title="修改密码"
		:visible.sync="isShowpassword"
		width="400px"
		:before-close="handleClose"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		class="password-wrap"
	>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm">
			<!-- 解决记住密码后浏览器自动回填 readonly onfocus="this.removeAttribute('readonly');" -->
			<el-form-item prop="code" class="password-inp">
				<el-input v-model="ruleForm.code" placeholder="请输入验证码" clearable>
					<i slot="prefix" class="el-input__icon el-icon-connection"></i>
				</el-input>
				<el-button type="text" @click="getCode">{{ countDown <= 0 ? '获取短信验证码' : countDown + 's后获取' }}</el-button>
			</el-form-item>
			<el-form-item prop="oldPass">
				<el-input v-model="ruleForm.oldPass" placeholder="请输入新密码" show-password clearable readonly onfocus="this.removeAttribute('readonly');"
					><i slot="prefix" class="el-input__icon el-icon-lock"></i
				></el-input>
			</el-form-item>
			<el-form-item prop="password">
				<el-input v-model="ruleForm.password" placeholder="请确认输入密码" show-password clearable
					><i slot="prefix" class="el-input__icon el-icon-lock"></i
				></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="handleClose" size="mini">取 消</el-button>
			<el-button type="primary" @click="handleSave" size="mini">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { changeSendMobileCode, updatePassWord } from '@/api/login/index'; //ajax
export default {
	data() {
		var validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'));
			} else {
				if (this.ruleForm.password !== '') {
					this.$refs.ruleForm.validateField('password');
				}
				callback();
			}
		};
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			} else if (value !== this.ruleForm.oldPass) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		};
		return {
			isShowpassword: false,
			countDown: 0,
			ruleForm: {
				code: '',
				oldPass: '',
				password: '',
			},
			rules: {
				code: { required: true, message: '请输入', trigger: 'blur' },
				oldPass: [{ validator: validatePass, trigger: 'blur' }],
				password: [{ validator: validatePass2, trigger: 'blur' }],
			},
		};
	},
	created() {},
	methods: {
		open() {
			this.isShowpassword = true;
		},
		getCode() {
			changeSendMobileCode()
				.then((res) => {
					if (res.code === 200) {
						if (this.countDown > 0) {
							return;
						}
						this.countDown = 60;
						clearInterval(this.countDownSetInterval);
						this.countDownSetInterval = setInterval(() => {
							if (this.countDown > 0) {
								this.countDown -= 1;
							}
						}, 1000);
						this.$message.success(res.msg);
					} else {
						this.$message.error('发送失败,失败原因:' + res.msg);
					}
				})
				.catch(() => {
					this.$message.error('出错了!');
				});
		},
		handleSave() {
			this.$refs['ruleForm'].validate((valid) => {
				if (valid) {
					this.submitEvent();
				} else {
					return false;
				}
			});
		},
		submitEvent() {
			updatePassWord(this.ruleForm)
				.then((res) => {
					console.log(res);
					if (res.code === 200) {
						this.$message.success(res.msg);
						this.handleClose();
					} else {
						this.$message.error('修改失败!');
					}
				})
				.catch(() => {
					this.$message.error('出错了!');
				});
		},
		handleClose() {
			this.$refs.ruleForm.resetFields();
			this.isShowpassword = false;
		},
	},
};
</script>
<style scoped lang="scss">
.password-wrap {
	.password-inp {
		position: relative;
		::v-deep .el-button--text {
			position: absolute;
			right: 8px;
		}
	}
}
</style>
