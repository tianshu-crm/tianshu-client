<template>
	<div>
		<el-dialog
			:title="title"
			:visible.sync="show"
			width="750px"
			:before-close="handleClose"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
		>
			<div v-loading="loading" element-loading-text="拼命加载中" element-loading-background="rgba(255, 255, 255, 0.8)">
				<template v-if="!isDetails">
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="" class="staff-ruleForm">
						<p class="font16 mb15">基础信息</p>
						<el-row>
							<el-col :span="12">
								<el-form-item label="姓名" prop="nickName">
									<el-input v-model.trim="ruleForm.nickName" placeholder="请输入姓名" @blur="handleNickName($event)"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="账号" prop="userName">
									<el-input v-model="ruleForm.userName" disabled placeholder="保存后自动生成"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="密码" prop="password" class="mt20">
									<el-input v-model="ruleForm.password" disabled placeholder="保存后自动生成"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="手机号" prop="phoneNumber" class="mt20">
									<el-input v-model="ruleForm.phoneNumber" placeholder="请输入手机号"></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="12">
								<el-form-item label="证件类型" prop="idCardType" class="mt20">
									<el-select v-model="ruleForm.idCardType" placeholder="请选择证件类型" @change="cardChange($event)">
										<el-option v-for="item in cardOptions" :key="item.value" :label="item.dictLabel" :value="item.dictValue"> </el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="证件号码" prop="idCardNum" class="mt20">
									<el-input v-model="ruleForm.idCardNum" placeholder="请输入证件号码"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="性别" prop="sex" class="mt20">
									<el-radio-group v-model="ruleForm.sex">
										<el-radio v-for="item in sexOptions" :key="item.dictValue" :label="item.dictValue">{{ item.dictLabel }}</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="出生日期" prop="dateOfBirth" class="mt20">
									<el-date-picker v-model="ruleForm.dateOfBirth" type="date" placeholder="选择出生日期" value-format="yyyy-MM-dd"> </el-date-picker>
								</el-form-item>
							</el-col>
						</el-row>

						<p class="font16 mb15 mt20">高级配置</p>
						<el-row>
							<el-col :span="12">
								<el-form-item label="所属部门" prop="dept" class="mt20">
									<el-cascader
										v-model="ruleForm.dept"
										placeholder="选择所属部门"
										ref="deptRef"
										:options="deptOptions"
										:props="deptProps"
										@change="deptChange"
									></el-cascader>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="直属上级" prop="directSuperior" class="mt20">
									<!-- <el-input v-model="ruleForm.directSuperior" placeholder="请输入"></el-input> -->
									<el-select v-model="ruleForm.directSuperior" placeholder="请选择负责人" filterable style="width: 100%">
										<el-option v-for="item in leaderOptions" :key="item.userId" :label="item.userName" :value="item.userId"> </el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="岗位名称" prop="position" class="mt20">
									<el-input v-model="ruleForm.position" placeholder="请输入岗位名称"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="用户角色" prop="role" class="mt20">
									<el-select v-model="ruleForm.role" placeholder="请选择用户角色" @change="roleChange">
										<el-option
											v-for="item in roleOptions"
											:key="item.roleId"
											:label="item.roleName"
											:value="{ value: item.roleId, label: item.roleName }"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="状态" prop="status" class="mt20">
									<el-radio-group v-model="ruleForm.status">
										<el-radio label="0">正常</el-radio>
										<el-radio label="1">停用</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-divider></el-divider>
						<el-form-item class="handle-btn">
							<el-button type="primary" size="mini" @click="submitForm('ruleForm')">保存</el-button>
							<el-button size="mini" @click="resetForm('ruleForm')">取消</el-button>
						</el-form-item>
					</el-form>
				</template>

				<template v-else>
					<div style="line-height: 32px; display: flex; align-content: stretch; justify-content: space-around" class="pb10">
						<div class="font16">
							<p class="font17 mb15" style="font-weight: 700">基础信息</p>
							<div>姓名：{{ ruleForm.nickName }}</div>
							<div>账号：{{ ruleForm.userName }}</div>
							<div>密码：{{ ruleForm.password }}</div>
							<div>手机号：{{ ruleForm.phoneNumber }}</div>
							<div>证件类型：{{ ruleForm.idCardType }}</div>
							<div>证件号码：{{ ruleForm.idCardNum }}</div>
							<div>性别：{{ ruleForm.sex }}</div>
							<div>出生日期：{{ ruleForm.dateOfBirth }}</div>
						</div>
						<div class="font16">
							<p class="font17 mb15 mt15" style="font-weight: 700">高级配置</p>
							<div>所属部门：{{ ruleForm.deptTree.label }}</div>
							<div>直属上级：{{ ruleForm.directSuperior }}</div>
							<div>岗位名称：{{ ruleForm.position }}</div>
							<div>用户角色：{{ ruleForm.role }}</div>
							<div>状态：{{ ruleForm.status == '0' ? '正常' : '停用' }}</div>
						</div>
					</div>
				</template>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import ChineseHelper from '@/utils/chinese/ChineseHelper.js';

import { userDetail, generateAccount, deptTree, addUser, rolelist, types, updateUser } from '@/api/staff/index'; //ajax
import { deptUser } from '@/api/dept/index'; //ajax

import { checkPhone, checkIdCard, checkPassPort } from '@/utils/toolsValidate.js';

export default {
	components: {},
	props: {
		staffShow: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: '0',
		},
		userId: {
			type: Number,
		},
	},
	watch: {
		type: {
			handler(val) {
				if (val == '1') {
					this.title = '编辑员工';
				} else if (val == '2') {
					this.title = '员工详情';
					this.isDetails = true;
				}
			},
			immediate: true,
			deep: true,
		},
		//   ConvertPinyin：汉转字母
		'ruleForm.nickName': {
			handler(n) {
				if (n.length == 0) {
					this.ruleForm.password = '';
					this.ruleForm.userName = '';
					return;
				}
				//处理默认密码
				this.ruleForm.password = ChineseHelper.ConvertPinyin(n) + ChineseHelper.GetFirstPinyin('天枢易销');
			},
		},
		'ruleForm.userName': {
			handler(n, o) {
				if (n == o && n.length > 0) {
					this.$refs['ruleForm'].clearValidate(['userName']);
				}
			},
		},
	},
	filters: {
		deptTreeFilter: function (val) {
			return val.toString();
		},
	},
	data() {
		return {
			title: '新增员工',
			isDetails: false,
			loading: false,
			cardOptions: [], //证件类型下拉
			sexOptions: [], //性别下拉
			roleOptions: [], //角色下拉
			deptOptions: [], //部门下拉
			deptProps: {
				value: 'id',
				label: 'label',
				children: 'children',
			},
			ruleForm: {
				//员工昵称
				nickName: '',
				//密码
				password: '',
				userName: '', //账号
				//电话号码
				phoneNumber: '',
				sex: '',
				dateOfBirth: '',
				idCardType: '', //证件类型
				idCardNum: '', //证件号码
				dept: '',
				deptTree: {},
				// deptId: '',
				// deptName: '', //部门ID和名称
				directSuperior: '', //直属上级
				position: '', //岗位名称
				role: '',
				roleId: '',
				roleName: '', //角色ID和名称
				status: null, //状态
			},
			leaderOptions: [],
			rules: {
				nickName: [{ required: true, message: '请输入', trigger: 'blur' }],
				userName: [{ required: true, message: '请输入', trigger: 'blur' }],
				password: [{ required: true, message: '请输入', trigger: 'blur' }],
				// phoneNumber: [{ required: true, message: '请输入', trigger: 'blur' }],
				phoneNumber: [{ required: true, validator: checkPhone, trigger: 'blur' }],
				idCardType: [{ required: true, message: '请选择', trigger: 'change' }],
				// idCardNum: [{ required: true, message: '请选择', trigger: 'change' }],
				idCardNum: [{ required: true, validator: checkIdCard, trigger: 'blur' }],
				sex: [{ required: true, message: '请选择', trigger: 'change' }],
				dateOfBirth: [{ required: true, message: '请选择', trigger: 'change' }],
				dept: [{ required: true, message: '请选择', trigger: 'change' }],
				directSuperior: [{ required: true, message: '请输入', trigger: 'blur' }],
				position: [{ required: true, message: '请输入', trigger: 'blur' }],
				role: [{ required: true, message: '请选择', trigger: 'change' }],
				status: [{ required: true, message: '请选择', trigger: 'change' }],
			},
			show: false,
			roleDis: true, //角色下拉
			deptId: null, //部门最后一位id
		};
	},
	methods: {
		handleClose() {
			this.$emit('closeEvent', false);
		},

		close() {},

		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (this.type == '0') {
						this.handleAdd();
					} else if (this.type == '1') {
						this.handleEdit();
					}
				} else {
					return false;
				}
			});
		},
		//新增
		handleAdd() {
			addUser(this.ruleForm)
				.then((res) => {
					if (res.code === 200) {
						this.$message.success(res.msg);
						this.$emit('staffEvent', false);
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch((error) => {
					this.$message.error(error);
				});
		},
		//编辑提交
		handleEdit() {
			this.ruleForm.userId = this.userId;
			updateUser(this.ruleForm)
				.then((res) => {
					if (res.code === 200) {
						this.$message.success(res.msg);
						this.$emit('staffEvent', false);
					} else {
						this.$message.error(res.msg);
					}
				})
				.catch(() => {
					this.$message.error('出错了！');
				});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.$emit('closeEvent', false);
		},
		//姓名失焦 获取账号
		handleNickName(event) {
			if (event && event.target.value.length > 0) {
				let params = {
					nickName: this.ruleForm.nickName,
				};
				generateAccount(params)
					.then((res) => {
						if (res.code == 200) {
							this.ruleForm.userName = res.data.username;
						}
					})
					.finally(() => {
						this.ruleForm = JSON.parse(JSON.stringify(this.ruleForm));
					});
			}
		},
		//回显
		getDetaild() {
			this.loading = true;
			userDetail(this.userId)
				.then((res) => {
					this.ruleForm = res.data;
					this.ruleForm.dept = res.data.deptTree.value;
					this.ruleForm.role = res.data.roleName;
					this.ruleForm.status = res.data.status.toString();
					if (this.type == '2') {
						let val = this.leaderOptions.find((item) => item.userId == this.ruleForm.directSuperior);
						this.ruleForm.directSuperior = val.userName;
						this.ruleForm.deptTree.label = this.ruleForm.deptTree.label.toString();
						this.ruleForm.idCardType = this.cardOptions.find((item) => item.dictValue == this.ruleForm.idCardType).dictLabel;
						this.ruleForm.sex = this.sexOptions.find((item) => item.dictValue == this.ruleForm.sex).dictLabel;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//获取部门下拉
		getDeptTree() {
			this.loading = true;
			return deptTree()
				.then((res) => {
					this.deptOptions = res.data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//获取直属上级下拉
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
		//获取角色下拉
		getRolelist() {
			this.loading = true;
			return rolelist()
				.then((res) => {
					if (res.code === 200) {
						this.roleOptions = res.data;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 获取证件类型与性别
		getTypes() {
			this.loading = true;
			let val = 'sys_document_type,sys_user_sex';
			return types(val)
				.then((res) => {
					if (res.code === 200) {
						this.cardOptions = res.data[0].sys_document_type;
						this.sexOptions = res.data[1].sys_user_sex;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//部门change事件
		deptChange(e) {
			if (e.length > 0) {
				this.ruleForm.role = '';
				this.ruleForm.deptTree.value = e;
				this.ruleForm.deptTree.label = this.$refs['deptRef'].getCheckedNodes()[0].pathLabels;
			}
		},
		//角色change事件
		roleChange(e) {
			this.ruleForm.roleId = e.value;
			this.ruleForm.roleName = e.label;
		},
		//证件类型change事件
		cardChange(e) {
			this.ruleForm.idCardNum = '';
			if (e == 1) {
				this.rules.idCardNum[0].validator = checkPassPort;
			} else {
				this.rules.idCardNum[0].validator = checkIdCard;
			}
		},
	},

	created() {
		this.show = this.staffShow;
		let promiseList = [];
		//获取部门下拉
		promiseList.push(this.getDeptTree());
		//获取证件类型与性别
		promiseList.push(this.getTypes());
		//获取角色下拉
		promiseList.push(this.getRolelist());
		//获取直属上级
		promiseList.push(this.getDeptUser());

		Promise.all(promiseList).then(() => {
			if (this.type != '0') {
				this.getDetaild();
			}
		});
	},
};
</script>

<style scoped lang="scss">
.staff-ruleForm {
	.el-select,
	.el-date-editor {
		width: 100%;
	}
	.handle-btn {
		text-align: center;
		::v-deep .el-form-item__content {
			margin-left: 0px !important;
		}
	}

	.el-cascader {
		width: 100%;
	}
}
</style>
