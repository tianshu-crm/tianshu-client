<template>
	<el-form
		label-width="80px"
		ref="form"
		:model="form"
		:rules="rules"
		v-loading="loading"
		element-loading-text="拼命加载中"
		element-loading-background="rgba(255, 255, 255, 0.8)"
	>
		<!-- 批量激活线索不显示 -->
		<div v-if="type">
			<div class="user-content flex-space-between">
				<div>
					<div class="marginBottom10">
						<div class="flex">
							<div class="userName">{{ form.name }}</div>
							<div class="marginRight10 marginLeft10">
								<el-tag type="info">{{ form.level }}</el-tag>
							</div>
							<el-tag type="info">{{ form.businessType }}</el-tag>
						</div>
					</div>
					<div class="flex-warp">
						<el-form-item label="性别:" label-width="60px">{{ form.sex }}</el-form-item>
						<el-form-item label="手机号码:" label-width="80px">{{ form.phonenumber }}</el-form-item>
						<el-form-item label="微信号:">{{ form.wechat }}</el-form-item>
						<el-form-item label="年龄:">{{ form.age }}</el-form-item>
					</div>
				</div>
				<el-button type="text" @click="routerPushClueDetail">查看详情</el-button>
			</div>
			<div class="flex-space-between">
				<el-form-item label="战败顾问:">{{ form.userName }}</el-form-item>
				<el-form-item label="战败时间:">{{ form.failureTime }}</el-form-item>
				<el-form-item label="战败原因:">{{ form.reason }}</el-form-item>
			</div>
			<el-form-item label="战败说明:">{{ form.remark }}</el-form-item>
		</div>

		<!-- 查看线索不显示 -->
		<el-form-item label="激活原因" prop="activateReason" v-if="type != 2">
			<el-input type="textarea" rows="3" v-model="form.activateReason" placeholder="请输入激活原因"></el-input>
		</el-form-item>
	</el-form>
</template>
<script>
import { deepCopy } from '@/utils/index.js';
export default {
	data() {
		return {
			rules: {
				activateReason: [{ required: true, message: '请输入激活原因', trigger: 'blur' }], //战败原因
			},
			form: {},
			defaultForm: {},
			loading: false,
		};
	},
	props: {
		type: {
			type: Number,
		},
		customerId: {
			type: String,
		},
	},
	methods: {
		// 校验
		isPass() {
			return new Promise((resolve) => {
				let form = this.$refs.form;
				form.validate((pass) => {
					resolve(pass);
				});
			});
		},
		init() {
			this.defaultForm = deepCopy(this.form);
		},
		getValue() {
			const form = deepCopy(this.form);
			return form;
		},
		setValue(form = {}) {
			this.form = deepCopy({ ...form, activateReason: '' });
		},
		// 重置清空
		reset() {
			this.form = deepCopy(this.defaultForm);
			this.$refs.form.clearValidate();
		},
		// 跳转线索详情
		routerPushClueDetail() {
			this.$router.push({
				path: '/clue/clueDetail',
				query: {
					customerId: this.customerId,
				},
			});
		},
	},
	created() {
		this.init();
	},
};
</script>
<style lang="scss" scoped>
::v-deep .el-input {
	width: 400px !important;
}
</style>
