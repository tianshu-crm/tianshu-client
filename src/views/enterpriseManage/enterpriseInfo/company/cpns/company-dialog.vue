<template>
	<div>
		<el-dialog
			:title="title"
			:visible.sync="show"
			width="600px"
			:before-close="handleClose"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
		>
			<div v-loading="loading" element-loading-text="拼命加载中" element-loading-background="rgba(255, 255, 255, 0.8)">
				<page-form-plus
					ref="refForm"
					:searchForm="searchForm"
					:searchData="searchData"
					:searchHandle="searchHandle"
					:isHandle="true"
					:rules="rules"
					:isShowRequired="false"
					:isDetails="isDetails"
				>
				</page-form-plus>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import PageFormPlus from '@/components/page-form-plus';

import { companyAdd, companyUpdate, companyDetails } from '@/api/company/index'; //ajax
export default {
	components: { PageFormPlus },
	props: {
		addCompanyShow: {
			type: Boolean,
			default: false,
		},
		companyType: {
			type: String,
			default: '0',
		},
		companyId: {
			type: Number,
		},
	},
	watch: {
		companyType: {
			handler(val) {
				if (val == '1') {
					this.title = '编辑公司';
				} else if (val == '2') {
					this.title = '公司详情';
					this.isDetails = true;
				}
			},
			immediate: true,
			deep: true,
		},
	},

	data() {
		return {
			show: false,
			loading: false,
			isDetails: false,
			title: '新增公司',
			searchData: {},
			// cityList:[],
			searchForm: [
				{
					itemName: '基础信息',
					entityList: [
						{ label: '公司名称', prop: 'companyName', type: 'input', placeholder: '请输入公司名称', width: '100%', size: 'medium' },
						{ label: '公司地址', prop: 'companyRegAddress', type: 'input', placeholder: '请输入公司地址', width: '100%', size: 'medium' },
						{ label: '法人代表', prop: 'legalPersonName', type: 'input', placeholder: '请输入法人代表', width: '100%', size: 'medium' },
						{ label: '联系电话', prop: 'companyPhone', type: 'input', placeholder: '请输入联系电话', width: '100%', size: 'medium' },
						{
							label: '所在城市',
							prop: 'cityCodeList',
							type: 'cascader',
							placeholder: '请选择所在城市',
							width: '100%',
							size: 'medium',
							options: [],
							change: this.cityChange,
							dictUrl: '/common/city/info',
							props: {
								value: 'cityAreaCode',
								label: 'cityAreaName',
								children: 'subBordList',
							},
						},
						{ label: '注册时间', prop: 'companyRegTime', type: 'date', placeholder: '请选择注册时间', width: '100%', size: 'medium' },
					],
				},
				{
					itemName: '发票信息',
					entityList: [
						{ label: '企业编码', prop: 'identifier', type: 'input', placeholder: '请输入统一社会信用代码', width: '100%', size: 'medium' },
						{ label: '开户账号', prop: 'accountNum', type: 'input', placeholder: '请输入开户账号', width: '100%', size: 'medium' },
						{ label: '开户行', prop: 'accountOpenBank', type: 'input', placeholder: '请输入开户行', width: '100%', size: 'medium' },
					],
				},
			],
			searchHandle: [
				//查询和重置按钮
				{ label: '保存', type: 'primary', size: 'mini', handle: this.save },
				{ label: '取消', type: '', size: 'mini', handle: this.close },
			],
			rules: {
				companyName: [{ required: true, message: '请输入', trigger: 'blur' }],
				companyRegAddress: [{ required: true, message: '请输入', trigger: 'blur' }],
				legalPersonName: [{ required: true, message: '请输入', trigger: 'blur' }],
				companyPhone: [{ required: true, message: '请输入', trigger: 'blur' }],
				cityCodeList: [{ required: true, message: '请选择', trigger: 'change' }],
				identifier: [{ required: true, message: '请输入', trigger: 'blur' }],
				accountNum: [{ required: true, message: '请输入', trigger: 'blur' }],
				accountOpenBank: [{ required: true, message: '请输入', trigger: 'blur' }],
				companyRegTime: [{ required: true, message: '请选择', trigger: 'change' }],
			},
		};
	},
	methods: {
		handleClose() {
			this.$emit('closeEvent', false);
		},
		save() {
			this.$refs.refForm.$children[0].validate((valid) => {
				if (valid) {
					if (this.companyType == '0') {
						this.addsubmitForm();
					} else if (this.companyType == '1') {
						this.editsubmitForm();
					}
				} else {
					return false;
				}
			});
		},
		//新增提交ajax
		addsubmitForm() {
			companyAdd(this.searchData)
				.then((res) => {
					if (res.code === 200) {
						this.$message.success(res.msg);
						this.$emit('submitEvent', false);
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch(() => {
					this.$message.error('出错了!');
				});
		},
		//编辑提交ajax
		editsubmitForm() {
			this.searchData.companyId = this.companyId;
			companyUpdate(this.searchData)
				.then((res) => {
					if (res.code === 200) {
						this.$message.success(res.msg);
						this.$emit('submitEvent', false);
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch(() => {
					this.$message.error('出错了!');
				});
		},
		//详情与回显
		getCompanyDetails() {
			this.loading = true;
			companyDetails(this.companyId)
				.then((res) => {
					if (res.code === 200) {
						this.searchData = res.data;
						this.searchData.cityCodeList = JSON.parse(JSON.parse(this.searchData.cityCodeList));
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//城市级联选择器事件  处理code和name
		cityChange(e) {
			if (e.length) {
				this.$nextTick(() => {
					let checkedNodes = this.$refs.refForm.$refs['cascader'][0].getCheckedNodes()[0].pathLabels;
					this.searchData.cityCode = e[e.length - 1];
					this.searchData.cityName = checkedNodes[checkedNodes.length - 1];
				});
			}
		},
		close() {
			this.$emit('closeEvent', false);
		},
	},

	created() {
		this.show = this.addCompanyShow;
		if (this.companyType != '0') {
			this.getCompanyDetails();
		}
	},
};
</script>

<style scoped lang="scss">
::v-deep .el-cascader {
	width: 100% !important;
}

::v-deep .el-date-editor.el-input,
.el-date-editor.el-input__inner {
	width: 100% !important;
}
</style>
