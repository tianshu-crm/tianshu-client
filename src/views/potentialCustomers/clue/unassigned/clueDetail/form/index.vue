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
		<el-form-item v-if="customerInfo.userName" label="当前顾问名称:">{{ customerInfo.userName }}</el-form-item>
		<el-form-item label="转移顾问名称" prop="userId">
			<el-select filterable clearable placeholder="请选择转移顾问名称" v-model="form.userId">
				<el-option v-for="item in nameList" :key="item.userId" :value="item.userId" :label="item.userName"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="下次跟进时间" prop="nextTime">
			<el-date-picker v-model="form.nextTime" type="date" value-format="yyyy-MM-dd" placeholder="选择下次跟进时间"> </el-date-picker>
		</el-form-item>
		<el-form-item label="转移原因" prop="reason">
			<el-input clearable v-model="form.reason" placeholder="请输入转移原因"></el-input>
		</el-form-item>
	</el-form>
</template>
<script>
import { getUserList } from '@/api/clue';
import { deepCopy } from '@/utils/index.js';
export default {
	data() {
		return {
			rules: {
				userId: [{ required: true, message: '请选择转移顾问名称', trigger: 'blue' }], //转移顾问
				nextTime: [{ required: true, message: '请选择下次跟进时间', trigger: 'blur' }], //下次跟进时间
				reason: [{ required: true, message: '请输入转移原因', trigger: 'blur' }], //原因
			},
			form: {
				userId: [], //转移顾问
				nextTime: '', //下次跟进时间
				reason: '', //原因
			},

			nameList: [], //所属顾问下拉列表
			defaultForm: {},
			loading: false,
		};
	},
	props: {
		customerInfo: {
			type: Object,
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
			this.getUserList();
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
		// 所属顾问
		getUserList() {
			getUserList()
				.then((res) => {
					if (res.code == 200) {
						this.nameList = res.data;
					}
				})
				.finally(() => {
					this.loading = false;
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
