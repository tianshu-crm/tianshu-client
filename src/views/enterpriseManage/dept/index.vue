<template>
	<div class="dept-wrap">
		<page-search :searchFormConfig="searchFormConfig" @searchQuery="searchQuery">
			<template #footer>
				<div class="footer">
					<el-button v-hasPermi="['system:dept:add']" type="primary" size="small" @click="handleDept('0', true, null, 0)">新增部门</el-button>
				</div>
			</template>
		</page-search>

		<el-table
			:data="tableData"
			style="width: 100%"
			:height="tableHeight"
			:header-cell-style="{ background: '#F6F6F6' }"
			row-key="deptId"
			:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			class="dept-table"
			v-loading="loading"
			element-loading-text="拼命加载中"
			element-loading-background="rgba(255, 255, 255, 0.8)"
		>
			<el-table-column prop="deptName" label="部门名称"> </el-table-column>
			<el-table-column align="center" prop="status" label="状态">
				<template slot-scope="scope">
					{{ scope.row.status == '0' ? '正常' : '停用' }}
				</template>
			</el-table-column>
			<el-table-column align="center" prop="deptStaffNum" label="成员数"></el-table-column>
			<el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
			<el-table-column align="center" label="操作" width="180"
				><template slot-scope="scope">
					<el-button type="text" @click="handleDept('2', false, scope.row.deptName, scope.row.deptId)">详情</el-button>
					<el-button v-hasPermi="['system:dept:add']" type="text" @click="handleDept('0', false, scope.row.deptName, scope.row.deptId)"
						>新增</el-button
					>
					<el-button
						v-hasPermi="['system:dept:edit']"
						type="text"
						@click="handleDept('1', false, scope.row.deptName, scope.row.deptId)"
						v-if="scope.row.parentId != 0 && scope.row.children.length == 0"
						>编辑</el-button
					>
					<el-button v-hasPermi="['system:dept:remove']" type="text" @click="handleDelect(scope.row.deptId)" v-if="scope.row.parentId != 0"
						>删除</el-button
					>
				</template></el-table-column
			>
			<template slot="empty">
				<img src="../../../assets/img/no_data.png" style="width: 260px; height: 260px" />
				<p class="emptyText" style="line-height: 0">暂无数据</p>
			</template>
		</el-table>

		<el-pagination
			class="mt15"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:page-sizes="[10, 20, 50]"
			:page-size="queryParams.pageSize"
			:current-page="queryParams.pageNum"
			background
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
		>
		</el-pagination>

		<!-- deptDiaShow:展示与否
        deptType：新增（0）、编辑（1）、详情（2）
        closeDeptEvent：关闭事件 -->
		<template v-if="deptDiaShow">
			<dept-dialog
				:deptDiaShow="deptDiaShow"
				:deptType="deptType"
				:isAdd="isAdd"
				:deptName="deptName"
				:deptId="deptId"
				@closeDeptEvent="closeDeptEvent"
				@submitEvent="submitEvent"
			></dept-dialog>
		</template>
	</div>
</template>

<script>
import PageSearch from '@/components/page-search';
import { searchFormConfig } from './config/search.config'; //搜索组件的配置文件

import DeptDialog from './cpns/dept-dialog.vue'; //新增（0）、编辑（1）、详情（2）组件

import { deptList, deptDel } from '@/api/dept/index'; //ajax

const constQueryParams = {
	pageSize: 10,
	pageNum: 1,
	status: '',
	deptName: '',
};

export default {
	components: { PageSearch, DeptDialog },
	data() {
		return {
			//获取list接口参数
			queryParams: JSON.parse(JSON.stringify(constQueryParams)),
			//总条数
			total: 0,
			//搜索模块配置文件数据
			searchFormConfig: {},
			//新增等弹窗是否展示
			deptDiaShow: false,
			//传给新增子组件参数，参数说明： 新增（0）、编辑（1）、详情（2）
			deptType: '',
			//table高度
			tableHeight: window.innerHeight - 245,
			//table数据
			tableData: [],
			isAdd: true, //是否是从列表外新增点击进入，是 则需要加载下拉选择器 不是就加载deptName字段
			deptName: '', //当前选中部门节点名称
			deptId: 0, //当前选中数据的主键ID
			loading: false,
		};
	},
	methods: {
		getTableList() {
			this.loading = true;
			deptList(this.queryParams)
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
		handleDept(type, isAdd, deptName, deptId) {
			// type:新增 编辑 详情区分
			// isAdd： 是否是 新增部门 点击按钮进入 需要加载级联选择器
			// deptName ： 从列表数据点击新增后 展示的当前部门名称字段
			// deptId： 列表点击 取当前数据的主键ID
			this.deptType = type;
			this.isAdd = isAdd;
			this.deptName = deptName;
			this.deptId = deptId;
			this.deptDiaShow = true;
		},
		handleDelect(deptId) {
			this.$confirm('此操作将删除该部门, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					deptDel(deptId).then((res) => {
						if (res.code === 200) {
							this.$message.success(res.msg);
							this.getTableList();
						} else {
							this.$message.error(res.msg);
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
		closeDeptEvent(val) {
			this.deptDiaShow = val;
			this.isAdd = true;
		},
		submitEvent(val) {
			this.deptDiaShow = val;
			this.getTableList();
		},
		handleEdit() {},
		handleSizeChange(val) {
			this.queryParams.pageSize = val;
			this.getTableList();
		},
		handleCurrentChange(val) {
			this.queryParams.pageNum = val;
			this.getTableList();
		},
	},
	created() {
		this.searchFormConfig = searchFormConfig;
		this.getTableList();
	},
};
</script>

<style scoped lang="scss">
.dept-wrap {
	background-color: #fff;
	padding: 20px;
	border-radius: 8px;
	// height: calc(100vh - 120px);

	.el-pagination {
		text-align: center;
	}
	/* 表格居中 */
	.dept-table {
		.el-table td,
		.el-table th {
			text-align: left !important;
		}
	}
}
</style>
