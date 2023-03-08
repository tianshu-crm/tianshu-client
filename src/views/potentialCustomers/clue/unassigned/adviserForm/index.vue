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
		<el-form-item label="顾问名称" prop="name">
			<el-select filterable size="small" placeholder="请选择顾问名称" v-model="form.name">
				<el-option v-for="item in nameList" :key="item.userId" :value="item.userId" :label="item.userName"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="下次跟进时间" prop="nextTime">
			<el-date-picker v-model="form.nextTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择下次跟进时间"> </el-date-picker>
		</el-form-item>
	</el-form>
</template>
<script>
import { deepCopy } from '@/utils/index.js';
import { getUserList } from '@/api/clue';
export default {
	props: {
		type: {
			type: String,
		},
	},
	data() {
		return {
			rules: {
				name: [{ required: true, message: '请选择顾问名称', trigger: 'blur' }],
				nextTime: [{ required: true, message: '请选择下次跟进时间', trigger: 'blur' }],
			},
			form: {
				name: '', //顾问名称-----测试
				nextTime: '', //下次跟进时间
			},
			nameList: [],
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
		getUserList() {
			this.loading = true;
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
	width: 400px;
}
</style>
