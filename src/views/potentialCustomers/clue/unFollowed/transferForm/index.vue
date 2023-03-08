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
					<el-form-item label="性别:"  label-width="60px" v-if="customerInfo.sex">{{ customerInfo.sex }}</el-form-item>
					<el-form-item label="手机号码:"  label-width="80px">{{ customerInfo.phonenumber }}</el-form-item>
					<el-form-item label="微信号:" label-width="70px" v-if="customerInfo.wechat">{{ customerInfo.wechat }}</el-form-item>
					<el-form-item label="年龄:" label-width="70px" v-if="customerInfo.age">{{ customerInfo.age }}</el-form-item>
				</div>
			</div>
			<el-button type="text" @click="routerPushClueDetail">查看详情</el-button>
		</div>
		<div class="flex">
			<el-form-item label="当前顾问名称:">{{ customerInfo.userName }}</el-form-item>
			<el-form-item label="当前客户级别:" v-if="customerInfo.level">{{ customerInfo.level }}</el-form-item>
		</div>
		<el-form-item label="调整意向级别" prop="level">
			<el-select filterable clearable placeholder="请选择调整意向级别" v-model="form.level">
				<el-option v-for="item in levelList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="下次跟进时间" prop="nextTime">
			<el-date-picker v-model="form.nextTime" type="date" value-format="yyyy-MM-dd" placeholder="选择下次跟进时间"> </el-date-picker>
		</el-form-item>
		<el-form-item label="调整意愿" prop="reason">
			<el-input clearable v-model="form.reason" placeholder="请输入调整意愿"></el-input>
		</el-form-item>
	</el-form>
</template>
<script>
import { dataDictionary } from '@/api/news';
import { deepCopy } from '@/utils/index.js';
export default {
	data() {
		return {
			rules: {
				level: [{ required: true, message: '请选择调整意向级别', trigger: 'change' }], //调整意向级别
				nextTime: [{ required: true, message: '请选择下次跟进时间', trigger: 'blur' }], //下次跟进时间
				reason: [{ required: true, message: '请输入调整意愿', trigger: 'blur' }], //调整意愿
			},
			form: {
				level: '', //转移顾问
				nextTime: '', //下次跟进时间
				reason: '', //原因
			},
			levelList: [], // 顾问下拉列表
			defaultForm: {},
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
			this.defaultForm = deepCopy(this.form);
			this.initLevelList();
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
		// 跳转线索详情
		routerPushClueDetail() {
			this.$router.push({
				path: '/clue/clueDetail',
				query: {
					customerId: this.customerId,
				},
			});
		},
		//意向级别列表
		initLevelList() {
			this.loading = true;
			dataDictionary('crm_customer_level')
				.then((res) => {
					this.levelList = res.data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep .el-input {
	width: 440px !important;
}
</style>
