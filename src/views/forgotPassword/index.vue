<template>
	<div class="forgot_password_wrap w100 pd30">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">登录</el-breadcrumb-item>
			<el-breadcrumb-item>忘记密码</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="container h100 mt30">
			<div class="steps_content">
				<el-steps :active="$store.state.forgotPassword.active" simple finish-status="success">
					<el-step title="确认账号" icon="el-icon-edit"> </el-step>
					<el-step title="重置密码" icon="el-icon-upload"></el-step>
					<el-step title="重置成功" icon="el-icon-picture"></el-step>
				</el-steps>
				<reset></reset>
			</div>
		</div>
	</div>
</template>

<script>
import reset from './cpns/reset.vue';
export default {
	components: { reset },
	data() {
		return {
			active: 1,
		};
	},
	methods: {},
};
</script>

<style scoped lang="scss">
.forgot_password_wrap {
	.container {
		width: 700px;
		margin: 0 auto;
		// display: flex;
		// justify-content: center;
		// background-color: aqua;
	}
	.steps_content {
		// width: 100%;
		// height: 520px;
		// background-color: #ccc;
	}
}

::v-deep .el-steps--simple {
	background-color: #dcdfe6;
	width: auto;
}
</style>
