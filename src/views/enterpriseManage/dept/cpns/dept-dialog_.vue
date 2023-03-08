<template>
	<div>
		<el-dialog :title="title" :visible.sync="show" width="25%" :before-close="handleClose">
			<page-form
				ref="refForm"
				:searchForm="searchForm"
				:searchData="searchData"
				:searchHandle="searchHandle"
				:isHandle="true"
				:rules="rules"
				:isShowRequired="false"
                :isDetails="isDetails"
			>
			</page-form>
		
		</el-dialog>
	</div>
</template>

<script>
import PageForm from '@/components/page-form';
export default {
	props: {
		deptDiaShow: {
			type: Boolean,
			default: false,
		},
		deptType: {
			type: String,
			default: '0',
		},
	},
	components: { PageForm },
	watch: {
		deptType: {
			handler(val) {
				if (val == '1') {
					this.title = '编辑部门';
				} else if (val == '2') {
					this.title = '部门详情';
                    this.isDetails = true;
				}
			},
			immediate: true,
			deep: true,
		},
	},

	data() {
		let statusList = [
			{ label: '启用', value: 1 },
			{ label: '禁用', value: 2 },
		];
		return {
			show: false,
            //是否是查看详情状态
            isDetails:false,
			title: '新增部门',
			searchData: {
				a: '1',
				b: '2',
				c: '',
			},
			searchForm: [
				{ label: '上级部门', prop: 'a', type: 'input', placeholder: '请输入', width: '', size: 'medium' },
				{ label: '部门名称', prop: 'b', type: 'input', placeholder: '请输入', width: '', size: 'medium' },
				{ label: '状态', prop: 'c', type: 'radio', radios: statusList },
			],
			searchHandle: [
				//查询和重置按钮
				{ label: '保存', type: 'primary', size: 'mini', handle: this.save },
				{ label: '取消', type: 'primary', size: 'mini', handle: this.handleClose },
			],
			rules: {
				a: [{ required: true, message: '请输入', trigger: 'blur' }],
				b: [{ required: true, message: '请输入', trigger: 'blur' }],
				c: [{ required: true, message: '请选择', trigger: 'blur' }],
			},
		};
	},
	methods: {
		handleClose() {
			this.$emit('closeDeptEvent', false);
		},
		save() {
			this.$refs.refForm.$children[0].validate((valid) => {
				if (valid) {
					console.log('success submit!!');
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
	},
	created() {
		this.show = this.deptDiaShow;
	},
};
</script>

<style scoped lang="scss">
.dept-details {
}
</style>
