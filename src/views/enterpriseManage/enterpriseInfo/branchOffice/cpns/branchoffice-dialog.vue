<template>
	<div>
		<el-dialog
			:title="title"
			:visible.sync="show"
			width="30%"
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
					:labelWidth="'100px'"
				>
				</page-form-plus>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import PageFormPlus from '@/components/page-form-plus';

import { filialeDetails, filialeAdd, filialeUpdate } from '@/api/branchOffice/index'; //ajax

import { checkPhone } from '@/utils/toolsValidate.js';
export default {
	components: { PageFormPlus },
	props: {
		branchShow: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: '0',
		},
		filialeId: {
			type: Number,
		},
	},
	watch: {
		type: {
			handler(val) {
				if (val == '1') {
					this.title = '编辑分公司';
				} else if (val == '2') {
					this.title = '分公司详情';
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
			title: '新增分公司',
			searchData: {},

			searchForm: [
				{
					itemName: '基础信息',
					entityList: [
						{
							label: '公司名称',
							prop: 'companyName',
							type: 'select',
							placeholder: '请选择公司名称',
							width: '100%',
							size: 'medium',
							options: [],
							dictUrl: '/system/company/company/list',
							change: this.typeChange,
						},
						{ label: '分公司名称', prop: 'filialeName', type: 'input', placeholder: '请输入分公司名称', width: '100%', size: 'medium' },
						{
							label: '城市',
							prop: 'cityCodeList',
							type: 'cascader',
							placeholder: '请选择城市',
							width: '',
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
						{ label: '公司地址', prop: 'filialeAddress', type: 'input', placeholder: '请输入公司地址', width: '100%', size: 'medium' },
						{ label: '负责人', prop: 'generalManager', type: 'input', placeholder: '请输入负责人', width: '100%', size: 'medium' },
						{ label: '联系电话', prop: 'filialePhone', type: 'input', placeholder: '请输入联系电话', width: '100%', size: 'medium' },
					],
				},
				{
					itemName: '发票信息',
					entityList: [
						{ label: '企业编码', prop: 'filialeIdentifier', type: 'input', placeholder: '请输入企业编码', width: '100%', size: 'medium' },
						{ label: '开户账号', prop: 'filialeAccountNum', type: 'input', placeholder: '请输入开户账号', width: '100%', size: 'medium' },
						{ label: '开户行', prop: 'filialeOpenBank', type: 'input', placeholder: '请输入开户行', width: '', size: 'medium' },
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
				filialeName: [{ required: true, message: '请输入', trigger: 'blur' }],
				cityCodeList: [{ required: true, message: '请输入', trigger: 'blur' }],
				filialeAddress: [{ required: true, message: '请输入', trigger: 'blur' }],
				generalManager: [{ required: true, message: '请输入', trigger: 'blur' }],
				filialePhone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
				filialeIdentifier: [{ required: true, message: '请输入', trigger: 'blur' }],
				filialeAccountNum: [{ required: true, message: '请输入', trigger: 'blur' }],
				filialeOpenBank: [{ required: true, message: '请输入', trigger: 'blur' }],
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
					if (this.type == '0') {
						this.addsubmitForm();
					} else if (this.type == '1') {
						this.editsubmitForm();
					}
				} else {
					return false;
				}
			});
		},
		//新增提交ajax
		addsubmitForm() {
			filialeAdd(this.searchData)
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
			this.searchData.filialeId = this.filialeId;
			filialeUpdate(this.searchData)
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
		//回显
		getfilialeDetails() {
			this.loading = true;
			filialeDetails(this.filialeId)
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
		typeChange(e) {
			let list = e.split(',');
			this.searchData.companyId = list[0];
			this.searchData.companyName = list[1];
		},
		cityChange(e) {
			let checkedNodes = this.$refs.refForm.$refs['cascader'][0].getCheckedNodes()[0].pathLabels;
			this.searchData.cityCode = e[e.length - 1];
			this.searchData.cityName = checkedNodes[checkedNodes.length - 1];
		},

		close() {
			this.$emit('closeEvent', false);
		},
	},

	created() {
		this.show = this.branchShow;
		if (this.type != '0') {
			this.getfilialeDetails();
		}
		// console.log(11)
		// 模拟编辑
		// this.searchData.projectName = 'TEST';
	},
};
</script>

<style scoped lang="scss">
::v-deep .el-cascader {
	width: 100% !important;
}
</style>
