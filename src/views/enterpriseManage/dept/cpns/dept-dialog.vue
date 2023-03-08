<template>
	<div>
		<el-dialog
			:title="title"
			:visible.sync="show"
			width="500px"
			:before-close="handleClose"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
		>
			<el-form
				:model="ruleForm"
				:rules="rules"
				ref="ruleForm"
				label-width="80px"
				class="demo-ruleForm"
				:hide-required-asterisk="errorIcon"
				v-loading="loading"
				element-loading-text="拼命加载中"
				element-loading-background="rgba(255, 255, 255, 0.8)"
			>
				<el-form-item label="上级部门" prop="dept" v-if="isAdd">
					<template>
						<el-cascader
							v-model="ruleForm.dept"
							:show-all-levels="false"
							:options="options"
							:props="props"
							@change="deptChange($event)"
							placeholder="请选择上级部门"
						></el-cascader>
					</template>
				</el-form-item>
				<template v-else>
					<span style="width: 68px; display: inline-block; text-align: right; height: 40px" class="mr10">上级部门</span
					>{{ ruleForm.parentName ? ruleForm.parentName : deptName }}
				</template>
				<el-form-item label="部门名称" prop="deptName">
					<el-input v-if="deptType != '2'" v-model="ruleForm.deptName" placeholder="请输入部门名称"></el-input>
					<template v-else>{{ ruleForm.deptName }}</template>
				</el-form-item>
				<el-form-item label="负责人" prop="leader">
					<el-select v-if="deptType != '2'" v-model="ruleForm.leader" placeholder="请选择负责人" style="width: 100%">
						<el-option v-for="item in leaderOptions" :key="item.userId" :label="item.userName" :value="item.userId"> </el-option>
					</el-select>
					<template v-else>{{ ruleForm.leader }}</template>
				</el-form-item>
				<el-form-item label="联系电话" prop="phone">
					<el-input v-if="deptType != '2'" v-model="ruleForm.phone" placeholder="请输入联系电话"></el-input>
					<template v-else>{{ ruleForm.phone }}</template>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-radio-group v-if="deptType != '2'" v-model="ruleForm.status">
						<el-radio label="0">正常</el-radio>
						<el-radio label="1">停用</el-radio>
					</el-radio-group>
					<template v-else>{{ ruleForm.status == '0' ? '正常' : '停用' }}</template>
				</el-form-item>
				<el-divider></el-divider>
				<el-form-item class="btn-item">
					<el-button v-if="deptType != '2'" size="mini" type="primary" @click="submitForm('ruleForm')">确定</el-button>
					<el-button size="mini" @click="resetForm('ruleForm')">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import { deptTree, deptAdd, deptDetails, deptUpdate, deptUser } from '@/api/dept/index'; //ajax
import { checkPhone } from '@/utils/toolsValidate.js';
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
		isAdd: {
			type: Boolean,
			default: true,
		},
		deptName: {
			type: String,
		},
		deptId: {
			type: Number,
			default: 0,
		},
	},
	components: {},
	watch: {
		deptType: {
			handler(val) {
				if (val == '1') {
					this.title = '编辑部门';
				} else if (val == '2') {
					this.title = '部门详情';
					this.isDetails = true;
					this.errorIcon = true;
				}
			},
			immediate: true,
			deep: true,
		},
	},

	data() {
		return {
			props: {
				label: 'label',
				value: 'id',
				children: 'children',
				checkStrictly: true,
			},
			show: false, //是否是查看详情状态
			loading: false,
			isDetails: false,
			errorIcon: false,
			title: '新增部门',
			ruleForm: {
				parentId: '',
				dept: '',
			},
			rules: {
				dept: [{ required: true, message: '请选择', trigger: 'change' }],
				parentId: [{ required: true, message: '请输入', trigger: 'blur' }],
				deptName: [{ required: true, message: '请输入', trigger: 'blur' }],
				leader: [{ required: true, message: '请输入', trigger: 'blur' }],
				phone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
				status: [{ required: true, message: '请选择', trigger: 'change' }],
			},
			options: [],
			leaderOptions: [],
		};
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (this.deptType == '0') {
						//新增
						if (this.deptId != 0) {
							this.ruleForm.parentId = this.deptId;
						}
						deptAdd(this.ruleForm).then((res) => {
							if (res.code === 200) {
								this.$message.success('操作成功！');
								this.$emit('submitEvent', false);
							} else {
								this.$message.error(res.msg);
							}
						});
					} else {
						//编辑
						deptUpdate(this.ruleForm).then((res) => {
							if (res.code === 200) {
								this.$message.success('操作成功！');
								this.$emit('submitEvent', false);
							} else {
								this.$message.error(res.msg);
							}
						});
					}
				} else {
					return false;
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.$emit('closeDeptEvent', false);
		},
		handleClose() {
			this.$emit('closeDeptEvent', false);
		},
		getDeptTree() {
			this.loading = true;
			return deptTree(this.deptId)
				.then((res) => {
					if (res.code === 200) {
						this.options = res.data;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		getDeptUser() {
			this.loading = true;
			return deptUser()
				.then((res) => {
					if (res.code === 200) {
						this.leaderOptions = res.data;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		treeChange(data) {
			this.$refs.tree.setCheckedKeys([data.deptId]);
			this.ruleForm.parentId = this.node;
		},
		getdeptDetails() {
			this.loading = true;
			deptDetails(this.deptId)
				.then((res) => {
					this.ruleForm = res.data;
					if (this.deptType === '2') {
						this.ruleForm.leader = this.leaderOptions.find((item) => item.userId == this.ruleForm.leader).userName;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		deptChange(e) {
			if (e.length > 0) {
				this.ruleForm.parentId = e[e.length - 1];
			}
		},
	},
	created() {
		this.show = this.deptDiaShow;

		let promiseList = [];
		promiseList.push(this.getDeptUser());
		if (this.isAdd) {
			promiseList.push(this.getDeptTree());
		}
		Promise.all(promiseList).then(() => {
			if (this.deptType != '0') {
				this.getdeptDetails();
			}
		});
	},
};
</script>

<style scoped lang="scss">
.el-cascader,
.el-select {
	width: 100% !important;
}
.btn-item {
	::v-deep .el-form-item__content {
		margin-left: 0px !important;
		text-align: center;
	}
}
</style>
