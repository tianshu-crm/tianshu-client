<template>
	<div class="company-wrap pd15">
		<page-search :searchFormConfig="searchFormConfig" @searchQuery="searchQuery">
			<template #footer>
				<div class="footer">
					<el-button v-hasPermi="['system:company:add']" type="primary" size="small" @click="handleCompany('0')">新增公司</el-button>
				</div>
			</template>
		</page-search>

		<page-content
			:contentTableConfig="contentTableConfig"
			@currentChange="currentChange"
			@sizeChange="sizeChange"
			:queryParams="queryParams"
			:tableData="tableData"
			:loading="loading"
			:listCount="total"
		>
			<template #handler="scope">
				<el-button type="text" @click="handleCompany('2', scope.row.companyId)">详情</el-button>
				<el-button v-hasPermi="['system:company:edit']" type="text" @click="handleCompany('1', scope.row.companyId)">编辑</el-button>
				<el-button v-hasPermi="['system:company:delete']" type="text" @click="handleDelCompany(scope.row.companyId)">删除</el-button>
			</template>
		</page-content>

		<template v-if="addCompanyShow">
			<company-dialog
				:addCompanyShow="addCompanyShow"
				:companyType="companyType"
				:companyId="companyId"
				@closeEvent="closeEvent"
				@submitEvent="submitEvent"
			></company-dialog>
		</template>
	</div>
</template>

<script>
import PageSearch from '@/components/page-search';
import { searchFormConfig } from './config/search.config'; //搜索组件的配置文件

import PageContent from '@/components/page-content';
import { contentTableConfig } from './config/content.config'; //table组件的配置文件

import CompanyDialog from './cpns/company-dialog.vue'; //新增、编辑、详情弹窗

/* 
companyList:获取table list
companyDel:删除
companyAdd：新增提交
companyUpdate：编辑提交

*/
import { companyList, companyDel } from '@/api/company/index'; //ajax

const constQueryParams = {
	pageSize: 10,
	pageNum: 1,
	companyName: '',
};

export default {
	components: { PageContent, PageSearch, CompanyDialog },
	data() {
		return {
			contentTableConfig: {},
			searchFormConfig: {},
			queryParams: JSON.parse(JSON.stringify(constQueryParams)),
			addCompanyShow: false,
			companyType: '',
			tableData: [],
			loading: true,
			total: 0,
			companyId: null,
		};
	},
	methods: {
		handleCompany(type, companyId) {
			this.companyType = type;
			if (type != '0') {
				this.companyId = companyId;
			}
			this.addCompanyShow = true;
		},
		closeEvent(val) {
			this.addCompanyShow = val;
		},
		submitEvent(val) {
			this.addCompanyShow = val;
			this.getTableList();
		},
		getTableList() {
			this.loading = true;
			companyList(this.queryParams)
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
		//删除
		handleDelCompany(companyId) {
			this.$confirm('确定删除吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.delect(companyId);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		//删除ajax
		delect(companyId) {
			companyDel(companyId)
				.then((res) => {
					if (res.code === 200) {
						this.$message.success(res.msg);
						this.queryParams.pageNum = 1;
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
	height: calc(100vh - 114px);
}
</style>
