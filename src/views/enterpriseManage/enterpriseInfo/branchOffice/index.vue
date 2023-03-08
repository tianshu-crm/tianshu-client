<template>
	<div class="company-wrap pd15">
		<page-search :searchFormConfig="searchFormConfig" @searchQuery="searchQuery">
			<template #footer>
				<div class="footer">
					<el-button v-hasPermi="['system:filiale:add']" type="primary" size="small" @click="handleBranch('0')">新增分公司</el-button>
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
			<template #handler="scope">
				<el-button type="text" @click="handleBranch('2', scope.row.filialeId)">详情</el-button>
				<el-button v-hasPermi="['system:filiale:edit']" type="text" @click="handleBranch('1', scope.row.filialeId)">编辑</el-button>
				<el-button v-hasPermi="['system:filiale:remove']" type="text" @click="handleDelect(scope.row.filialeId)">删除</el-button>
			</template>
		</page-content>

		<template v-if="branchShow">
			<branch-office-dialog
				:branchShow="branchShow"
				:type="branchType"
				:filialeId="filialeId"
				@closeEvent="closeEvent"
				@submitEvent="submitEvent"
			></branch-office-dialog>
		</template>
	</div>
</template>

<script>
import PageSearch from '@/components/page-search';
import { searchFormConfig } from './config/search.config';

import PageContent from '@/components/page-content';
import { contentTableConfig } from './config/content.config'; //搜索组件的配置文件

import BranchOfficeDialog from './cpns/branchoffice-dialog'; //新增、编辑、详情弹窗

import { filialeList, filialeDel } from '@/api/branchOffice/index'; //ajax

const constQueryParams = {
	pageSize: 10,
	pageNum: 1,
	filialeName: '',
};

export default {
	components: { PageContent, PageSearch, BranchOfficeDialog },
	data() {
		return {
			//配置
			contentTableConfig: {},
			searchFormConfig: {},
			//子组件
			branchType: '',
			branchShow: false,
			// table数据
			queryParams: JSON.parse(JSON.stringify(constQueryParams)),
			tableData: [],
			loading: true,
			listCount: 0,
			//主键ID
			filialeId: '',
		};
	},
	methods: {
		handleBranch(val, filialeId) {
			this.filialeId = filialeId; //id
			this.branchType = val; //type
			this.branchShow = true;
		},
		closeEvent(val) {
			this.branchShow = val;
		},
		submitEvent(val) {
			this.branchShow = val;
			this.getTableList();
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
		//获取列表
		getTableList() {
			this.loading = true;
			filialeList(this.queryParams)
				.then((res) => {
					if (res.code === 200) {
						this.tableData = res.rows;
						this.listCount = res.total;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//删除
		handleDelect(filialeId) {
			this.$confirm('确定删除吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.delect(filialeId);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		//删除ajax
		delect(filialeId) {
			filialeDel(filialeId)
				.then((res) => {
					if (res.code === 200) {
						this.$message.success(res.msg);
						this.getTableList();
					} else {
						this.$message.error('操作失败！');
					}
				})
				.catch(() => {
					this.$message.error('出错了！');
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
	// height: calc(100vh - 114px);
}
</style>
