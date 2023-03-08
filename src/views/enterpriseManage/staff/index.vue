<template>
	<div class="company-wrap pd15">
		<page-search :searchFormConfig="searchFormConfig" @searchQuery="searchQuery"> </page-search>

		<page-content
			:heigth="tableHeight"
			:contentTableConfig="contentTableConfig"
			:queryParams="queryParams"
			:loading="loading"
			:tableData="tableData"
			:listCount="total"
			@multipleChoiceEvent="multipleChoiceEvent"
			:rowKey="'userId'"
			@currentChange="currentChange"
			@sizeChange="sizeChange"
		>
			<template #status="scope">
				{{ scope.row.status == 0 ? '正常' : '停用' }}
			</template>

			<template #headlerHeadler>
				<div class="header-content">
					<!-- <el-button size="mini" type="warning" class="el-icon-download mb15" plain>批量导出{{ scope }}</el-button> -->
					<el-button v-hasPermi="['system:user:adduser']" type="primary" size="small" @click="handleStaff('0', null)">新增员工</el-button>
					<el-button v-hasPermi="['system:user:deleteuser']" size="small" type="primary" @click="delect(null)">批量删除</el-button>
				</div>
			</template>

			<template #handler="scope">
				<el-button type="text" @click="handleStaff('2', scope.row.userId, null)">详情</el-button>
				<el-button v-hasPermi="['system:user:edituser']" type="text" @click="handleStaff('1', scope.row.userId)">编辑</el-button>
				<el-button v-hasPermi="['system:user:resetpassword']" type="text" @click="resetPassword(scope.row)">密码重置</el-button>
				<el-button v-hasPermi="['system:user:deactivateuser']" type="text" @click="deactivate(scope.row)">{{
					scope.row.status == 0 ? '停用' : '启用'
				}}</el-button>
				<el-button v-hasPermi="['system:user:deleteuser']" type="text" @click="delect(scope.row.userId)">删除</el-button>
			</template>
		</page-content>

		<template v-if="staffShow">
			<staff-dialog :staffShow="staffShow" :type="staffType" :userId="userId" @closeEvent="closeEvent" @staffEvent="staffEvent"></staff-dialog>
		</template>
	</div>
</template>

<script>
import PageSearch from '@/components/page-search';
import { searchFormConfig } from './config/search.config';

import PageContent from '@/components/page-content';
import { contentTableConfig } from './config/content.config'; //搜索组件的配置文件

import StaffDialog from './cpns/staff-dialog'; //新增、编辑、详情弹窗

import { userList, updatePwd, putDeactivate, delectUser } from '@/api/staff/index'; //ajax

const constQueryParams = {
	pageSize: 10,
	pageNum: 1,
	userName: '',
	phoneNumber: '',
	companyName: '', //公司名称
	filialeName: '', //分公司名称
	deptName: '', //部门公司
	roleName: '', //角色
	positionName: '', //岗位
};

export default {
	components: { PageContent, PageSearch, StaffDialog },
	data() {
		return {
			contentTableConfig: {},
			searchFormConfig: {},
			queryParams: JSON.parse(JSON.stringify(constQueryParams)),
			staffShow: false,
			staffType: '',
			loading: true,
			tableData: [],
			total: 0,
			userId: null,
			ids: [],
			tableHeight: window.innerHeight - 280, //页面高度
		};
	},
	methods: {
		handleStaff(val, userId) {
			if (userId && val != '0') {
				this.userId = userId;
			}
			this.staffType = val;
			this.staffShow = true;
		},
		closeEvent(val) {
			this.staffShow = val;
		},
		staffEvent(val) {
			this.staffShow = val;
			this.getTableList();
		},
		getTableList() {
			this.loading = true;
			userList(this.queryParams)
				.then((res) => {
					if (res.code === 200) {
						this.tableData = res.rows;
						this.total = res.total;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		searchQuery(data) {
			for (let key in data) {
				this.queryParams[key] = data[key];
			}
			if (data.resetFlag) {
				this.queryParams.pageNum = 1;
			}
			this.getTableList();
		},
		//重置密码
		resetPassword(row) {
			let params = {
				userId: row.userId,
			};
			this.handlePassWord(params);
		},
		handlePassWord(params) {
			this.$confirm('确定重置密码吗?重置后密码为：用户名全拼+企业名首字母', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					updatePwd(params)
						.then((res) => {
							if (res.code === 200) {
								this.$message.success(res.msg);
							} else {
								this.$message.error('重置密码失败，失败原因:' + res.msg);
							}
						})
						.catch(() => {
							this.$message.error('出错了！');
						});
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消重置',
					});
				});
		},
		//停用
		deactivate(row) {
			let params = {
				userId: row.userId,
				status: row.status,
			};
			this.handleDeactivate(params);
		},
		handleDeactivate(params) {
			let msg = '确定停用吗？';
			if (params.status == 1) {
				msg = '确定启用吗？';
			}
			this.$confirm(msg, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					params.status = Math.abs(params.status - 1);
					putDeactivate(params)
						.then((res) => {
							if (res.code === 200) {
								this.$message.success(res.msg);
								this.getTableList();
							} else {
								this.$message.error('操作失败');
							}
						})
						.catch(() => {
							this.$message.error('出错了！');
						});
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消操作',
					});
				});
		},
		//拿到多选数据
		multipleChoiceEvent(ids) {
			this.ids = ids;
		},
		//删除
		delect(id) {
			this.$confirm('确定删除吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.handleDelect(id);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		handleDelect(id) {
			let params = {
				userIdArray: [id],
			};
			if (id == null) {
				params.userIdArray = this.ids;
			}
			delectUser(params)
				.then((res) => {
					if (res.code === 200) {
						this.$message.success(res.msg);
						this.getTableList();
					} else {
						this.$message.erorr('删除失败！');
					}
				})
				.catch(() => {
					this.$message.erorr('出错了！');
				});
		},
		//分页
		currentChange(val) {
			this.queryParams.pageNum = val;
			this.getTableList();
		},
		sizeChange(val) {
			this.queryParams.pageSize = val;
			this.getTableList();
		},
	},
	created() {
		this.contentTableConfig = contentTableConfig;
		this.searchFormConfig = searchFormConfig;
		this.getTableList();
	},
};
</script>

<style scoped lang="scss">
.page-search {
	::v-deep .el-input {
		width: 150px;
	}
}
.company-wrap {
	background-color: #fff;
}
.header-content {
	margin-bottom: 10px;
}
</style>
