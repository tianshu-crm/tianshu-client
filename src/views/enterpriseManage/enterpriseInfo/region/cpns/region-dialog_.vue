<template>
	<div>
		<el-dialog title="新增区域" :visible.sync="show" width="auto" :before-close="handleClose">
			<page-form
				ref="refForm"
				:searchForm="searchForm"
				:searchData="searchData"
				:searchHandle="searchHandle"
				:isHandle="true"
				:rules="rules"
				:isShowRequired="false"
			>
			</page-form>
		</el-dialog>
	</div>
</template>
<script>
import PageForm from '@/components/page-form';
export default {
	components: { PageForm },
	props: {
		regionShow: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			show: false,
			searchData: {},

			searchForm: [
				{ label: '区域名称', prop: 'areaName', type: 'input', placeholder: '请输入', width: '320px', size: 'medium' },
				{
					label: '区域范围',
					prop: 'city',
					type: 'cascader',
					placeholder: '请选择',
					width: '320px',
					size: 'medium',
					options: [],
					change: this.cityChange,
					dictUrl: '/common/city/info',
					props: {
						value: 'cityAreaCode',
						label: 'cityAreaName',
						children: 'subBordList',
						multiple: true,
					},
				},
			],
			searchHandle: [
				//查询和重置按钮
				{ label: '保存', type: 'primary', size: 'mini', handle: this.save },
				{ label: '取消', type: 'primary', size: 'mini', handle: this.close },
			],
			rules: {
				areaName: [{ required: true, message: '请输入', trigger: 'blur' }],
			},
		};
	},
	methods: {
		handleClose() {
			this.$emit('closeEvent', false);
		},
		save() {
			// console.log(this.searchData, '保存');
			// console.log(this.$refs.refForm, '@111');
			// this.$refs.refForm.$children[0].validate((valid) => {
			// 	if (valid) {
			// 		console.log('success submit!!');
			// 	} else {
			// 		console.log('error submit!!');
			// 		return false;
			// 	}
			// });
		},
		cityChange(e) {
			// console.log(this.$refs.refForm.$refs['cascader'][0].getCheckedNodes());
			this.$refs.refForm.$refs['cascader'][0].getCheckedNodes().map((item) => {
				const itemChecked = item.data.cityAreaName;
				console.log(itemChecked);
				return itemChecked;
			});
		},
		close() {
			this.$emit('closeEvent', false);
		},
	},

	created() {
		this.show = this.regionShow;
		// console.log(11)
		// 模拟编辑
		// this.searchData.city = []
	
	},
};
</script>
