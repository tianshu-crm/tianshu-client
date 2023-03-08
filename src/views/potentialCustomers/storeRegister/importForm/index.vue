<template>
	<el-form
		label-width="80px"
		ref="form"
		:model="form"
		:rules="rules"
		v-loading="loading"
		element-loading-text="加载中~"
		element-loading-background="rgba(255, 255, 255, 0.8)"
	>
		<!-- 选择文件-- -->
		<input
			type="file"
			accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
			name
			ref="fileDom"
			v-show="false"
			@change="changeFile"
		/>
		<el-form-item label="线索内容" prop="fileName">
			<el-input disabled v-model="form.fileName" class="input-with-select">
				<el-button type="primary" slot="append" icon="el-icon-upload" @click="selectFile">上传</el-button>
			</el-input>
		</el-form-item>
		<el-form-item label-width="0">
			<el-button type="text" @click="downLoadTemplate">【模板下载】</el-button>
			<span>注意：请按照模板里的字段完成数据录入，每次导入的数据条目数量不超过1000条</span>
		</el-form-item>
	</el-form>
</template>
<script>
import { importTemplateCustomerRegister } from '@/api/storeRegister';
import { deepCopy } from '@/utils/index.js';
export default {
	props: {
		type: {
			type: String,
		},
	},
	data() {
		return {
			rules: {
				fileName: [{ required: true, message: '请导入数据', trigger: 'blur' }],
			},
			form: {
				fileName: '', //文件名
				file: {}, //文件
			},
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
		},
		getValue() {
			const form = deepCopy(this.form);
			const formData = new FormData();
			Object.keys(form).forEach((key) => {
				formData.append(key, form[key]);
			});
			return formData;
		},
		setValue(form = {}) {
			this.form = deepCopy(form);
		},
		// 重置清空
		reset() {
			this.form = deepCopy(this.defaultForm);
			this.$refs.form.clearValidate();
		},
		//导入-------------------------------------------------------
		// 1选择文件
		selectFile() {
			var input = this.$refs.fileDom;
			input.click();
		},
		// 2选择完文件
		changeFile(e) {
			var file = e.target.files[0];
			this.form.fileName = file.name;
			this.form.file = file;
		},
		// 下载模板
		downLoadTemplate() {
			this.$notify({
				title: '导出模板',
				message: '正在导出，请稍后~',
				type: 'success',
				showClose: false,
				duration: 2000,
			});
			importTemplateCustomerRegister();
		},
	},
	created() {
		this.init();
	},
};
</script>
<style lang="scss" scoped></style>
