<template>
	<el-form
		label-width="110px"
		ref="form"
		:model="form"
		:rules="rules"
		v-loading="loading"
		element-loading-text="拼命加载中"
		element-loading-background="rgba(255, 255, 255, 0.8)"
	>
		<!-- 用户个人信息 -->
		<div class="user-content flex-space-between">
			<div>
				<div class="marginBottom10">
					<div class="flex">
						<div class="userName">{{ customerInfo.name }}</div>
						<div class="marginLeft10">
							<el-tag type="info" v-if="customerInfo.businessType">{{ customerInfo.businessType }}</el-tag>
						</div>
					</div>
				</div>
				<div class="flex-warp">
					<el-form-item label="性别:" label-width="60px" v-if="customerInfo.sex">{{ customerInfo.sex }}</el-form-item>
					<el-form-item label="手机号码:"  label-width="80px">{{ customerInfo.phonenumber }}</el-form-item>
					<el-form-item label="微信号:" label-width="70px" v-if="customerInfo.wechat">{{ customerInfo.wechat }}</el-form-item>
					<el-form-item label="年龄:" label-width="70px" v-if="customerInfo.age">{{ customerInfo.age }}</el-form-item>
				</div>
			</div>
			<el-button type="text" @click="routerPushClueDetail">查看详情</el-button>
		</div>
		<div class="flex">
			<el-form-item label="当前顾问名称:">{{ customerInfo.userName }}</el-form-item>
		</div>
		<el-form-item label="战败原因" prop="reason">
			<el-select filterable clearable placeholder="请选择战败原因" v-model="form.reason">
				<el-option v-for="item in failureList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="战败说明" prop="remark">
			<el-input type="textarea" :rows="4" v-model="form.remark" placeholder="请输入战败说明"></el-input>
		</el-form-item>
	</el-form>
</template>
<script>
import { deepCopy } from '@/utils/index.js';
import { dataDictionary } from '@/api/news';
export default {
	data() {
		return {
			rules: {
				reason: [{ required: true, message: '请选择战败原因', trigger: 'change' }],
				remark: [{ required: true, message: '请输入战败说明', trigger: 'bur' }],
			},
			form: {
				reason: '', //原因
				remark: '', //战败说明
			},
			defaultForm: {},
			failureList: [], // 战败原因列表
			loading: false,
		};
	},
	props: {
		customerInfo: {
			type: Object,
		},
		customerId: {
			type: String,
		},
	},
	created() {
		this.init();
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
			this.initFailureList();
			this.defaultForm = deepCopy(this.form);
		},
		getValue() {
			const form = deepCopy(this.form);
			return form;
		},
		setValue(form = {}) {
			this.form = deepCopy(form);
		},
		// 重置清空
		reset() {
			this.form = deepCopy(this.defaultForm);
			this.$refs.form.clearValidate();
		},
		//战败原因列表
		initFailureList() {
			this.loading = true;
			dataDictionary('crm_customer_failure')
				.then((res) => {
					this.failureList = res.data;
				})
				.finally(() => {
					this.loading = false;
				});
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
};
</script>
<style lang="scss" scoped>
::v-deep .el-input {
	width: 450px !important;
}
</style>
