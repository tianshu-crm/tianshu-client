<template>
	<div class="company-wrap pd15">
		<page-search :searchFormConfig="searchFormConfig" @searchQuery="searchQuery">
			<template #footer>
				<div class="footer">
					<el-button v-hasPermi="['system:role:add']" type="primary" size="small" @click="handleRole('0', null)">新增角色</el-button>
				</div>
			</template>
		</page-search>

		<page-content
			:contentTableConfig="contentTableConfig"
			:queryParams="queryParams"
			:tableData="tableData"
			:loading="loading"
			:listCount="listCount"
			@currentChange="currentChange"
			@sizeChange="sizeChange"
		>
			<template #status="scope">
				<span>{{ scope.row.status == 0 ? '正常' : '停用' }}</span>
			</template>

			<template #handler="scope">
				<el-button type="text" @click="handleRole('2', scope.row.roleId)">详情</el-button>
				<el-button v-hasPermi="['system:role:edit']" type="text" @click="handleRole('1', scope.row.roleId)">编辑</el-button>
				<el-button v-hasPermi="['system:role:changestatus']" type="text" @click="deactivate(scope.row)">{{
					scope.row.status == 0 ? '停用' : '启用'
				}}</el-button>
				<el-button v-hasPermi="['system:role:remove']" type="text" @click="delect(scope.row.roleId)">删除</el-button>
			</template>
		</page-content>
	</div>
</template>

<script>
import PageSearch from '@/components/page-search';
import { searchFormConfig } from './config/search.config';

import PageContent from '@/components/page-content';
import { contentTableConfig } from './config/content.config'; //搜索组件的配置文件

import { roleList, changeStatus, delectRole } from '@/api/role/index'; //ajax

const constQueryParams = {
	pageSize: 10,
	pageNum: 1,
	roleName: '',
	status: '',
};

export default {
	components: { PageContent, PageSearch },
	data() {
		return {
			contentTableConfig: {},
			searchFormConfig: {},
			queryParams: JSON.parse(JSON.stringify(constQueryParams)),
			tableData: [],
			listCount: 0,
			loading: false,
		};
	},
	methods: {
		getTableList() {
			this.loading = true;
			roleList(this.queryParams)
				.then((res) => {
					if (res.code === 200) {
						this.tableData = res.rows;
						this.listCount = res.total;
					} else {
						this.$message.error(res.msg);
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
		////启用/停用角色
		deactivate(row) {
			let params = {
				roleId: row.roleId,
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
					changeStatus(params)
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
		//删除角色

		delect(roleId) {
			this.$confirm('确定删除吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					delectRole(roleId).then((res) => {
						if (res.code === 200) {
							this.$message.success(res.msg);
							this.getTableList();
						} else {
							this.$message.erorr('删除失败！');
						}
					});
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		//新增角色
		handleRole(type, roleId) {
			this.$router.push({
				path: '/roleInfo',
				query: {
					type: type,
					roleId: roleId,
				},
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
.company-wrap {
	background-color: #fff;
	height: calc(100vh - 114px);
}
</style>
