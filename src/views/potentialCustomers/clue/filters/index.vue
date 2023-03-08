<template>
	<!-- 线索去重 -->
	<div>
		<!-- 头部 -->
		<el-form size="small" label-width="80px">
			<el-form-item label="手机号码">
				<div class="header-content">
					<el-input v-model="search.phonenumber" placeholder="请输入手机号码"></el-input>
				</div>
			</el-form-item>
			<div class="table-action flex-space-between">
				<div class="lf">
					<el-button type="primary" size="small" @click="selectCustomer">查询</el-button>
					<el-button size="small" plain @click="resetSearch">清空</el-button>
				</div>
				<div class="rt">
					<el-button v-hasPermi="['crm:customer:repeat']" type="primary" size="small" @click="batchReplaceClick">替换数据</el-button>
					<el-button v-hasPermi="['crm:customer:repeatDelete']" type="primary" size="small" @click="batchDeleteClick">删除数据</el-button>
				</div>
			</div>
		</el-form>
		<!-- 表格 -->
		<el-table
			row-key="customerId"
			ref="multipleTable"
			:data="repeatList"
			style="width: 100%"
			:height="tableHeight"
			:cell-class-name="cellcb"
			v-loading="loading"
			element-loading-text="拼命加载中"
			element-loading-background="rgba(255, 255, 255, 0.8)"
			@selection-change="handleSelectionChange"
			:header-cell-style="{ background: '#F6F6F6' }"
			:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
		>
			<el-table-column type="selection" width="80" fixed :reserve-selection="true"></el-table-column>
			<!-- <el-table-column label="序号" type="index" width="80">
				<template slot-scope="scope">
					<div v-if="scope.row.isShow">{{ (page - 1) * pageSize + scope.$index + 1 }}</div>
				</template>
			</el-table-column> -->
			<el-table-column label="客户姓名" prop="name" width="120"></el-table-column>
			<el-table-column label="手机号码" prop="phonenumber" width="120"></el-table-column>
			<el-table-column label="微信号" prop="wechat" width="150"></el-table-column>
			<el-table-column label="性别" prop="sex"></el-table-column>
			<el-table-column label="年龄" prop="age"></el-table-column>
			<el-table-column label="意向级别" prop="level"></el-table-column>
			<el-table-column label="客户性质" prop="nature"></el-table-column>
			<el-table-column label="业务类型" prop="businessType" width="100"></el-table-column>
			<el-table-column label="线索阶段" prop="stage"></el-table-column>
			<el-table-column label="线索状态" prop="status"></el-table-column>
			<el-table-column label="客户来源" prop="source"></el-table-column>
			<el-table-column label="导入批号" prop="importNO" width="250"></el-table-column>
			<el-table-column label="创建人" prop="createBy" width="100"></el-table-column>
			<el-table-column label="推荐人" prop="referrer" width="100"></el-table-column>
			<el-table-column label="推荐人手机号" prop="referrerPhone" width="120"></el-table-column>
			<el-table-column label="推荐人微信号" prop="referrerWechat" width="120"></el-table-column>
			<el-table-column label="创建日期" prop="createTime" width="160" sortable></el-table-column>
			<el-table-column label="最后修改时间" prop="updateTime" width="160" sortable></el-table-column>
			<el-table-column label="操作" width="120" fixed="right">
				<template v-if="scope.row.isShow" slot-scope="scope">
					<el-button v-hasPermi="['crm:customer:repeat']" type="text" @click="replaceClueClick(scope.row)">替换数据</el-button>
					<el-button v-hasPermi="['crm:customer:repeatDelete']" type="text" @click="deleteClueClick(scope.row)">删除</el-button>
				</template>
			</el-table-column>
			<template slot="empty">
				<img src="@/assets/img/no_data.png" style="width: 260px; height: 260px" />
				<p class="emptyText" style="line-height: 0">暂无数据</p>
			</template>
		</el-table>
		<!-- 分页 -->
		<div class="table-page__action">
			<el-pagination
				background
				layout="total, sizes, prev, pager, next, jumper"
				:total="pageCount"
				:page-size="pageSize"
				:page-sizes="[10, 20, 50]"
				@current-change="changePage"
				@size-change="handleSizeChange"
			></el-pagination>
		</div>
	</div>
</template>
<script>
import { repeatList, customerRepeat, customerRepeatDelete } from '@/api/clue';
export default {
	data() {
		return {
			search: {
				phonenumber: '', //手机号码
			},
			repeatList: [], //线索列表
			tableHeight: window.innerHeight - 345, //页面高度
			page: 1, //当前页码
			pageSize: 10, //条数
			pageCount: null, //数量
			loading: false, //加载动画
			multipleSelection: [], //点击多选框的值
			valLength: '',
		};
	},
	props: {},
	components: {},
	watch: {},
	mounted() {},
	methods: {
		// 列表查询
		initCustomerList() {
			this.loading = true;
			repeatList({
				...this.search,
				pageNum: this.page,
				pageSize: this.pageSize,
			})
				.then((res) => {
					this.repeatList = res.rows;
					this.repeatList.map((repeat) => {
						// 用来判断是否显示复选框和操作按钮
						repeat.isShow = true;
					});
					this.pageCount = res.total;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 复选框显示与隐藏
		cellcb(scope) {
			if (!scope.row.isShow) {
				return 'clue-Cell';
			}
		},
		//多选框选中的值
		handleSelectionChange(val) {
			this.multipleSelection = val;
			this.valLength = val.length;
		},
		//点击分页
		changePage(page) {
			this.page = page;
			this.initCustomerList();
		},
		//调整每页显示条数
		handleSizeChange(pageSize) {
			this.pageSize = pageSize;
			this.initCustomerList();
		},
		//搜索
		selectCustomer() {
			this.page = 1;
			this.initCustomerList();
		},
		//重置
		resetSearch() {
			this.page = 1;
			this.search = {
				phonenumber: '', //手机号码
			};
			this.initCustomerList();
		},
		// 批量替换
		batchReplaceClick() {
			if (this.valLength) {
				this.replaceClues(this.multipleSelection.map((clue) => clue.customerId).join(','));
			} else {
				this.$message.error('您当前还未选择需要替换的线索信息');
			}
		},
		// 单个替换
		replaceClueClick(row) {
			this.replaceClues(row.customerId);
		},
		replaceClues(ids) {
			this.$confirm("确认要替换(保留'新'数据)当前选中的线索信息吗？", '提示', {
				type: 'warning',
			})
				.then(() => {
					customerRepeat(ids).then((res) => {
						if (res.code == 200) {
							this.$message.success(res.msg);
							this.initCustomerList();
						} else {
							this.$message.error(res.msg);
						}
					});
				})
				.catch(() => {
					this.$message('已取消操作');
				});
		},
		// 批量删除
		batchDeleteClick() {
			if (this.valLength) {
				this.deleteClues(this.multipleSelection.map((clue) => clue.customerId).join(','));
			} else {
				this.$message.error('您当前还未选择需要删除的线索信息');
			}
		},
		// 单个删除
		deleteClueClick(row) {
			this.deleteClues(row.customerId);
		},
		deleteClues(ids) {
			this.$confirm("确认要删除(保留'旧'数据)当前选中的线索信息吗？", '提示', {
				type: 'warning',
			})
				.then(() => {
					customerRepeatDelete(ids).then((res) => {
						if (res.code == 200) {
							this.$message.success(res.msg);
							this.initCustomerList();
						} else {
							this.$message.error(res.msg);
						}
					});
				})
				.catch(() => {
					this.$message('已取消操作');
				});
		},
	},
};
</script>
<style>
.clue-Cell .el-checkbox__input {
	display: none !important;
	background-color: rgb(251, 6, 6);
}
</style>
<style lang="scss" scoped>
.header-content {
	::v-deep .el-input {
		width: 200px;
	}
}
</style>
