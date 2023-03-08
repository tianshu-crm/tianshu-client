<template>
	<div class="roleInfo-wrap pd20" v-loading="loading" element-loading-text="拼命加载中" element-loading-background="rgba(255, 255, 255, 0.8)">
		<div class="go-back">
			<el-button size="small" type="primary" @click="goBack">返回</el-button>
		</div>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="roleinfo-ruleForm" :disabled="readonly">
			<p class="font16">基本信息</p>
			<el-form-item label="角色名称" prop="roleName">
				<el-input v-model="ruleForm.roleName" placeholder="请输入角色名称"></el-input>
			</el-form-item>
			<el-form-item label="角色描述" prop="roleDes">
				<el-input type="textarea" v-model="ruleForm.roleDes" placeholder="请输入角色描述"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-radio-group v-model="ruleForm.status">
					<el-radio label="0">正常</el-radio>
					<el-radio label="1">停用</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-divider></el-divider>
			<p class="font16">功能权限</p>
			<div class="fun-per mt20">
				<el-form-item>
					<el-input class="input-search" placeholder="请输入资源名称" v-model="filterText" clearable></el-input>
				</el-form-item>
			</div>
			<div class="tree-content mt20">
				<div class="checkbox-all">
					<el-checkbox :value="isSelectAll" @change="handleCheckAllChange">{{ menuList.length }}项</el-checkbox>
				</div>
				<div class="tree-body">
					<el-tree
						:data="menuList"
						:default-checked-keys="ruleForm.menuIds"
						show-checkbox
						ref="menuTree"
						highlight-current
						node-key="id"
						:props="defaultProps"
						default-expand-all
						:filter-node-method="filterNode"
						@check-change="clickMenuIds"
					>
					</el-tree>
				</div>
			</div>
			<p class="font16 mt20 mb20">数据权限</p>

			<el-form-item label="权限范围" prop="dataScope">
				<el-select v-model="ruleForm.dataScope" placeholder="请选择权限范围" @change="rangeChange($event)">
					<el-option v-for="(item, index) in options" :label="item.dictLabel" :value="item.dictValue" :key="index"></el-option>
				</el-select>
			</el-form-item>

			<div class="tree-content mt20" v-if="isShow">
				<div class="checkbox-all">
					<el-checkbox :value="roleIsSelectAll" @change="roleHandleCheckAllChange">{{ roleMenuList.length }}项</el-checkbox>
				</div>
				<div class="tree-body">
					<el-tree
						:data="roleMenuList"
						:default-checked-keys="ruleForm.deptIds"
						show-checkbox
						highlight-current
						node-key="id"
						ref="deptTree"
						:props="defaultProps"
						default-expand-all
						@check-change="clickDeptIds"
					>
					</el-tree>
				</div>
			</div>
			<template v-if="!readonly">
				<el-form-item class="mt20 mb5">
					<el-button type="primary" size="mini" @click="submitForm('ruleForm')">提交</el-button>
					<el-button @click="resetForm('ruleForm')" size="mini">返回</el-button>
				</el-form-item>
			</template>
		</el-form>
	</div>
</template>

<script>
import { treeselect, roleSelect, deptTree, add, details, update } from '@/api/role/index'; //ajax
export default {
	watch: {
		filterText(val) {
			this.$refs.menuTree.filter(val);
		},
	},
	computed: {
		//是否全选
		isSelectAll() {
			return this.getAllSelectedId().length === this.getAllId().length;
		},
		roleIsSelectAll() {
			return this.getRoleAllSelectedId().length === this.getRoleAllId().length;
		},
	},
	data() {
		return {
			loading: false,
			filterText: '',
			readonly: false,
			defaultProps: {
				children: 'children',
				label: 'label',
			},
			options: [],
			isShow: false,
			menuList: [],
			roleMenuList: [],
			ruleForm: {
				roleName: '',
				roleDes: '',
				status: '',
				menuIds: [],
				dataScope: '',
				deptIds: [],
			},
			rules: {
				roleName: [{ required: true, message: '请输入', trigger: 'blur' }],
				status: [{ required: true, message: '请选择', trigger: 'change' }],
				dataScope: [{ required: true, message: '请选择', trigger: 'change' }],
			},
		};
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let type = this.$route.query.type;
					if (type === '0') {
						add(this.ruleForm).then((res) => {
							this.handleCode(res.code, res.msg);
						});
					} else if (type === '1') {
						this.ruleForm.roleId = this.$route.query.roleId;
						update(this.ruleForm).then((res) => {
							this.handleCode(res.code, res.msg);
						});
					}
				} else {
					return false;
				}
			});
		},
		handleCode(code, msg) {
			if (code === 200) {
				this.$message.success(msg);
				this.goBack();
			} else {
				this.$message.error('操作失败');
			}
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.$router.go(-1);
		},
		//获取功能权限树
		getTreeselect() {
			this.loading = true;
			treeselect()
				.then((res) => {
					this.menuList = res.data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		clickMenuIds() {
			this.ruleForm.menuIds = this.$refs.menuTree.getCheckedKeys();
		},
		clickDeptIds() {
			this.ruleForm.deptIds = this.$refs.deptTree.getCheckedKeys();
		},
		// 树过滤
		filterNode(value, data) {
			if (!value) return true;
			return data.label.indexOf(value) !== -1;
		},
		getRoleSelect() {
			this.loading = true;
			roleSelect('sys_role_dataScope')
				.then((res) => {
					this.options = res.data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		rangeChange(e) {
			if (e && e == 2) {
				this.isShow = true;
				this.getDeptTree();
			} else {
				this.isShow = false;
			}
		},
		getDeptTree() {
			this.loading = true;
			deptTree()
				.then((res) => {
					this.roleMenuList = res.data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		getDetails() {
			this.loading = true;
			details(this.$route.query.roleId)
				.then((res) => {
					this.ruleForm = res.data; //展示数据权限数
					if (res.data.dataScope == '2') {
						this.getDeptTree();
						this.isShow = true;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		goBack() {
			this.$router.back();
		},
		// 获取所有已选中的node id
		getAllSelectedId() {
			if (!this.$refs.menuTree) {
				return [];
			}
			return this.$refs.menuTree.getCheckedKeys();
		},
		// 获取所有的node id
		getAllId() {
			const list = [];
			const initList = (menus) => {
				menus.forEach((item) => {
					if (item.children && item.children.length) {
						initList(item.children);
					}
					list.push(item.id);
				});
			};

			initList(this.menuList);
			return list;
		},
		// 是否全选
		handleCheckAllChange(isChecked) {
			if (isChecked) {
				this.ruleForm.menuIds = this.getAllId();
			} else {
				this.$refs.menuTree.setCheckedKeys([]);
				this.ruleForm.menuIds = [];
			}
		},
		//先这样
		// 获取所有已选中的node id
		getRoleAllSelectedId() {
			if (!this.$refs.deptTree) {
				return [];
			}
			return this.$refs.deptTree.getCheckedKeys();
		},
		// 获取所有的node id
		getRoleAllId() {
			const list = [];
			const initList = (menus) => {
				menus.forEach((item) => {
					if (item.children && item.children.length) {
						initList(item.children);
					}
					list.push(item.id);
				});
			};

			initList(this.roleMenuList);
			return list;
		},
		// 是否全选
		roleHandleCheckAllChange(isChecked) {
			if (isChecked) {
				this.ruleForm.deptIds = this.getRoleAllId();
			} else {
				this.$refs.deptTree.setCheckedKeys([]);
				this.ruleForm.deptIds = [];
			}
		},
	},
	created() {
		this.getTreeselect();
		this.getRoleSelect();

		if (this.$route.query.type != '0') {
			this.getDetails();
		}
		if (this.$route.query.type == '2') {
			this.readonly = true;
		}
	},
};
</script>
<style scoped lang="scss">
.roleInfo-wrap {
	background-color: #fff;
	height: calc(100vh - 114px);
	overflow: hidden;
	overflow-y: auto;
	border-radius: 8px;

	.go-back {
		text-align: right;
		height: 15px;
	}
	.roleinfo-ruleForm {
		width: 660px;
		.fun-per {
			// width: ;
			::v-deep .el-form-item__content {
				margin-left: 0px !important;
			}
			.el-input {
				width: 60%;
				margin-right: 26px;
			}
		}
		.tree-content {
			border: 1px solid #eee;
			.checkbox-all {
				border-bottom: 1px solid #eee;
				padding: 10px;
			}
			.tree-body {
				height: 300px;
				overflow: hidden;
				overflow-y: auto;
			}
		}
	}
}
</style>
