<template>
	<div class="company-wrap pd15">
		<page-search :searchFormConfig="searchFormConfig" @searchQuery="searchQuery">
			<template #footer>
				<div class="footer">
					<el-button v-hasPermi="['system:area:addarea']" type="primary" size="small" @click="handleRegion('0', null)">新增区域</el-button>
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
			<template #areaRange="scope">
				{{ scope.row.areaRange.areaRangeStr }}
			</template>
			<template #handler="scope">
				<el-button type="text" @click="handleRegion('2', scope.row.areaId)">详情</el-button>
				<el-button v-hasPermi="['system:area:updatearea']" type="text" @click="handleRegion('1', scope.row.areaId)">编辑</el-button>
				<el-button v-hasPermi="['system:area:deletearea']" type="text" @click="handleDelect(scope.row.areaId)">删除</el-button>
			</template>
		</page-content>

		<template v-if="regionShow">
			<region-dialog :regionShow="regionShow" @closeEvent="closeEvent" @regionEvent="regionEvent" :type="iareaType" :areaId="areaId"></region-dialog>
		</template>
	</div>
</template>

<script>
import PageSearch from '@/components/page-search';
import { searchFormConfig } from './config/search.config';

import PageContent from '@/components/page-content';
import { contentTableConfig } from './config/content.config'; //搜索组件的配置文件

import RegionDialog from './cpns/region-dialog.vue'; //新增、编辑、详情弹窗

import { tableList, deleteArea } from '@/api/region/index'; //ajax

const constQueryParams = {
	pageSize: 10,
	pageNum: 1,
	areaId: '',
	cityName: '',
};

export default {
	components: { PageContent, PageSearch, RegionDialog },
	data() {
		return {
			contentTableConfig: {},
			searchFormConfig: {},
			queryParams: JSON.parse(JSON.stringify(constQueryParams)),
			regionShow: false,
			//table数据
			tableData: [],
			loading: true,
			listCount: 0,
			//子组件
			iareaType: '',
			areaId: null,
		};
	},
	methods: {
		handleRegion(type, areaId) {
			this.iareaType = type;
			this.areaId = areaId;
			this.regionShow = true;
		},
		closeEvent(val) {
			this.regionShow = val;
		},
		regionEvent(val) {
			this.regionShow = val;
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
		getTableList() {
			this.loading = true;
			tableList(this.queryParams)
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
		handleDelect(id) {
			this.$confirm('确定删除吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.delect(id);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		//删除ajax
		delect(id) {
			deleteArea(id)
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
