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
		<div class="flex">
			<el-form-item label="跟进方式" prop="type">
				<el-select
					:disabled="disabled"
					filterable
					clearable
					placeholder="请选择跟进方式"
					v-model="form.type"
					class="search-select"
					:popper-append-to-body="false"
				>
					<el-option v-for="item in followtypeList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="通话时长" prop="callDuration">
				<el-input clearable :disabled="disabled" v-model="form.callDuration" placeholder="请输入通话时长">
					<span slot="suffix">min</span>
				</el-input>
			</el-form-item>
			<el-form-item label="跟进内容" prop="content">
				<el-input clearable :disabled="disabled" v-model="form.content" placeholder="请输入跟进内容"> </el-input>
			</el-form-item>
			<el-form-item label="下次跟进日期" prop="nextTime">
				<el-date-picker :disabled="disabled" v-model="form.nextTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择日期"> </el-date-picker>
			</el-form-item>
			<el-form-item label="下次跟进内容" prop="nextContent">
				<el-input clearable :disabled="disabled" v-model="form.nextContent" placeholder="请输入下次跟进内容"> </el-input>
			</el-form-item>
		</div>
	</el-form>
</template>
<script>
import { dataDictionary } from '@/api/news';
import { deepCopy } from '@/utils/index.js';
export default {
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			rules: {
				// type: [{ required: true, message: '请选择跟进方式', trigger: 'change' }],
				// callDuration: [{ required: true, message: '请输入通话时长', trigger: 'blur' }],
				// nextTime: [{ required: true, message: '请选择下次跟进日期', trigger: 'change' }],
				// content: [{ required: true, message: '请输入跟进内容', trigger: 'blur' }],
				// nextContent: [{ required: true, message: '请输入下次跟进内容', trigger: 'blur' }],
			},
			form: {
				type: '', //跟进方式
				callDuration: '', //通话时长
				nextTime: '', //下次跟进日期
				content: '', //跟进内容
				nextContent: '', //下次跟进内容
			},

			followtypeList: [], // 意向级别下拉列表
			defaultForm: {},
			loading: false,
		};
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
			this.initFollowtypeList();
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
		//跟进方式列表
		initFollowtypeList() {
			dataDictionary('crm_customer_followtype').then((res) => {
				this.followtypeList = res.data;
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
	width: 400px;
}
</style>
